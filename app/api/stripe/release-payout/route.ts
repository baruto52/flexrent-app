import { NextResponse }
from "next/server";

import Stripe
from "stripe";

import { createClient }
from "@supabase/supabase-js";

import { z }
from "zod";

export const runtime =
  "nodejs";

const stripe =
  new Stripe(
    process.env
      .STRIPE_SECRET_KEY!
  );

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

const schema =
  z.object({

    bookingId:
      z.string(),

    paymentIntentId:
      z.string(),
  });

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {

      return NextResponse.json(
        {
          error:
            "Ungültige Daten",
        },
        {
          status: 400,
        }
      );
    }

    const {

      bookingId,

      paymentIntentId,

    } = parsed.data;

    /*
      LOAD BOOKING
    */

    const {
      data: booking,
      error: bookingError,
    } =
      await supabase
        .from("bookings")
        .select("*")
        .eq(
          "id",
          bookingId
        )
        .maybeSingle();

    if (
      bookingError ||
      !booking
    ) {

      return NextResponse.json(
        {
          error:
            "Booking nicht gefunden",
        },
        {
          status: 404,
        }
      );
    }

    /*
      DISPUTE CHECK
    */

    if (
      booking.payout_status ===
      "disputed"
    ) {

      return NextResponse.json(
        {
          error:
            "Booking ist im Dispute Status",
        },
        {
          status: 400,
        }
      );
    }

    /*
      CAPTURE PAYMENT
    */

    const payment =
      await stripe
        .paymentIntents
        .capture(
          paymentIntentId
        );

    /*
      UPDATE BOOKING
    */

    const {
      error:
        updateError,
    } =
      await supabase
        .from("bookings")
        .update({

          payout_status:
            "released",

          escrow_status:
            "completed",

          released_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          bookingId
        );

    if (updateError) {

      return NextResponse.json(
        {
          error:
            "Booking Update Fehler",
        },
        {
          status: 500,
        }
      );
    }

    /*
      OPTIONAL:
      SPÄTER:
      Stripe Transfer
      Stripe Connect Release
      Partial Payouts
      Automatic Escrow Release
    */

    return NextResponse.json({

      success: true,

      payment,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Payout Release Fehler",
      },
      {
        status: 500,
      }
    );

  }
}