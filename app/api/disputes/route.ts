import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

import { z }
from "zod";

export const runtime =
  "edge";

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

    listingId:
      z.string(),

    openedBy:
      z.string(),

    againstUser:
      z.string(),

    reason:
      z.string()
        .min(3)
        .max(200),

    details:
      z.string()
        .min(10)
        .max(5000),
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

    const data =
      parsed.data;

    /*
      CREATE DISPUTE
    */

    const {
      error,
    } =
      await supabase
        .from("disputes")
        .insert({

          booking_id:
            data.bookingId,

          listing_id:
            data.listingId,

          opened_by:
            data.openedBy,

          against_user:
            data.againstUser,

          reason:
            data.reason,

          details:
            data.details,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Dispute Fehler",
        },
        {
          status: 500,
        }
      );
    }

    /*
      FREEZE PAYOUT
    */

    await supabase
      .from("bookings")
      .update({

        payout_status:
          "disputed",

        escrow_status:
          "pending",
      })
      .eq(
        "id",
        data.bookingId
      );

    /*
      OPTIONAL:
      SPÄTER:
      Stripe Connect Hold
      Stripe Refunds
      Admin Review Queue
    */

    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Server Fehler",
      },
      {
        status: 500,
      }
    );

  }
}