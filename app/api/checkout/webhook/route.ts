import { NextResponse }
from "next/server";

import Stripe
from "stripe";

import { headers }
from "next/headers";

import {
  createClient,
} from "@supabase/supabase-js";

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

export async function POST(
  req: Request
) {

  try {

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

    /*
      VERIFY EVENT
    */

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
        "WEBHOOK VERIFY ERROR:",
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

      console.log(
        "CHECKOUT COMPLETED:",
        session.id
      );

      /*
        FIND BOOKING
      */

      const {
        data: booking,
        error: bookingFindError,
      } =
        await supabase
          .from("bookings")
          .select("*")
          .eq(
            "stripe_session_id",
            session.id
          )
          .maybeSingle();

      if (
        bookingFindError
      ) {

        console.log(
          "BOOKING FIND ERROR:",
          bookingFindError
        );

        return NextResponse.json(

          {
            error:
              "Booking nicht gefunden",
          },

          {
            status: 500,
          }
        );
      }

      /*
        NO BOOKING
      */

      if (!booking) {

        console.log(
          "NO BOOKING FOUND FOR SESSION:",
          session.id
        );

        return NextResponse.json(

          {
            error:
              "Keine Booking gefunden",
          },

          {
            status: 404,
          }
        );
      }

      /*
        ALREADY PAID
      */

      if (
        booking.payment_status ===
        "paid"
      ) {

        console.log(
          "BOOKING ALREADY PAID"
        );

        return NextResponse.json({

          received: true,
        });
      }

      /*
        UPDATE BOOKING
      */

      const {
        error: updateError,
      } =
        await supabase
          .from("bookings")
          .update({

            payment_status:
              "paid",

            status:
              "confirmed",

            paid_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            booking.id
          );

      if (updateError) {

        console.log(
          "BOOKING UPDATE ERROR:",
          updateError
        );

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
        OWNER NOTIFICATION
      */

      await supabase
        .from("notifications")
        .insert({

          user_id:
            booking.owner_id,

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
            booking.renter_id,

          title:
            "Buchung bestätigt",

          description:
            "Deine Zahlung war erfolgreich.",
        });

      console.log(
        "BOOKING CONFIRMED:",
        booking.id
      );
    }

    /*
      PAYMENT FAILED
    */

    if (
      event.type ===
      "checkout.session.expired"
    ) {

      const session =
        event.data
          .object as Stripe.Checkout.Session;

      await supabase
        .from("bookings")
        .update({

          payment_status:
            "expired",

          status:
            "cancelled",
        })
        .eq(
          "stripe_session_id",
          session.id
        );

      console.log(
        "BOOKING EXPIRED:",
        session.id
      );
    }

    return NextResponse.json({

      received: true,
    });

  } catch (error: any) {

    console.log(
      "WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(

      {
        error:
          error.message ||
          "Webhook Fehler",
      },

      {
        status: 500,
      }
    );
  }
}