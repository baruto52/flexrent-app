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

    amount:
      z.number()
        .positive(),
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

      amount,

    } = parsed.data;

    /*
      LOAD BOOKING
    */

    const {
      data: booking,
      error:
        bookingError,
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
      STRIPE REFUND
    */

    const refund =
      await stripe
        .refunds
        .create({

          payment_intent:
            paymentIntentId,

          amount:
            Math.round(
              amount * 100
            ),
        });

    /*
      FULL / PARTIAL
    */

    const fullRefund =

      Number(amount) >=
      Number(
        booking.total_price
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

          refund_status:

            fullRefund

              ? "full"

              : "partial",

          refunded_amount:
            amount,

          payout_status:
            "refunded",
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

    return NextResponse.json({

      success: true,

      refund,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Refund Fehler",
      },
      {
        status: 500,
      }
    );

  }
}