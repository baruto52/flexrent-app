import { NextResponse }
from "next/server";

import Stripe
from "stripe";

import { headers }
from "next/headers";

import {
  createClient,
} from "@supabase/supabase-js";

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

export async function POST(
  req: Request
) {

  const body =
    await req.text();

  const headersList =
    await headers();

  const signature =
    headersList.get(
      "stripe-signature"
    );

  if (!signature) {

    return NextResponse.json(
      {
        error:
          "Keine Stripe Signatur",
      },
      {
        status: 400,
      }
    );
  }

  let event:
    Stripe.Event;

  try {

    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET!
      );

  } catch (err: any) {

    console.log(
      "WEBHOOK ERROR:",
      err.message
    );

    return NextResponse.json(
      {
        error:
          err.message,
      },
      {
        status: 400,
      }
    );
  }

  /*
    PAYMENT SUCCESS
  */

  if (
    event.type ===
    "checkout.session.completed"
  ) {

    const session =
      event.data
        .object as Stripe.Checkout.Session;

    const metadata =
      session.metadata;

    const amount =
      session.amount_total
        ? session.amount_total / 100
        : 0;

    console.log(
      "PAYMENT SUCCESS"
    );

    /*
      BOOKING SAVE
    */

    const {
      error:
        bookingError,
    } =
      await supabase
        .from("bookings")
        .insert({

          listing_id:
            metadata?.listingId,

          renter_id:
            metadata?.renterId,

          reviewed_user_id:
            metadata?.ownerId,

          total_price:
            amount,

          payment_status:
            "paid",

          stripe_session_id:
            session.id,
        });

    if (bookingError) {

      console.log(
        "BOOKING ERROR:",
        bookingError
      );
    }

    /*
      OWNER NOTIFICATION
    */

    await supabase
      .from("notifications")
      .insert({

        user_id:
          metadata?.ownerId,

        title:
          "Neue Buchung",

        description:
          "Du hast eine neue bezahlte Buchung erhalten.",
      });

    /*
      RENTER NOTIFICATION
    */

    await supabase
      .from("notifications")
      .insert({

        user_id:
          metadata?.renterId,

        title:
          "Buchung bestätigt",

        description:
          "Deine Zahlung war erfolgreich.",
      });

    console.log(
      "BOOKING SAVED"
    );
  }

  return NextResponse.json({
    received: true,
  });
}