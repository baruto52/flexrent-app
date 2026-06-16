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

  console.log(
    "WEBHOOK TRIGGERED"
  );

  const session =
    event.data
      .object as Stripe.Checkout.Session;

  console.log(
    "CHECKOUT COMPLETED:",
    session.id
  );

  console.log(
    "METADATA:",
    session.metadata
  );

  const metadata =
    session.metadata;

      if (!metadata) {

        return NextResponse.json({

          received: true,
        });
      }

      /*
        DUPLICATE CHECK
      */

      const {
        data:
          existingBooking,
      } =
        await supabase
          .from("bookings")
          .select("id")
          .eq(
            "stripe_session_id",
            session.id
          )
          .maybeSingle();

      if (
        existingBooking
      ) {

        console.log(
          "BOOKING ALREADY EXISTS"
        );

        return NextResponse.json({

          received: true,
        });
      }

      /*
        FINAL OVERLAP CHECK
      */

      const {
        data:
          overlappingBookings,
      } =
        await supabase
          .from("bookings")
          .select("*")
          .eq(
            "listing_id",
            metadata.listingId
          )
          .in(
            "status",
            [
              "confirmed",
              "active",
            ]
          )
          .lte(
            "start_date",
            metadata.endDate
          )
          .gte(
            "end_date",
            metadata.startDate
          );

      if (

        overlappingBookings &&

        overlappingBookings
          .length > 0
      ) {

        console.log(
          "BOOKING OVERLAP BLOCKED"
        );

        return NextResponse.json({

          received: true,
        });
      }

      /*
        CREATE BOOKING
      */

      const {
        data: booking,
        error:
          bookingError,
      } =
        await supabase
          .from("bookings")
          .insert({

            listing_id:
              metadata.listingId,

            renter_id:
              metadata.renterId,

            owner_id:
              metadata.ownerId,

            start_date:
              metadata.startDate,

            end_date:
              metadata.endDate,

            total_price:
              Number(
                metadata.totalPrice
              ),

            payment_status:
              "paid",

            status:
              "confirmed",

            stripe_session_id:
              session.id,

            paid_at:
              new Date()
                .toISOString(),
          })
          .select()
          .single();

      if (
        bookingError
      ) {

        console.log(
          "BOOKING CREATE ERROR:",
          bookingError
        );

        return NextResponse.json(

          {
            error:
              "Booking Create Fehler",
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
            metadata.ownerId,

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
            metadata.renterId,

          title:
            "Buchung bestätigt",

          description:
            "Deine Zahlung war erfolgreich.",
        });

      console.log(
        "BOOKING CREATED:",
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

      console.log(
        "CHECKOUT EXPIRED:",
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