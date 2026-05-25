import { NextResponse }
from "next/server";

import Stripe
from "stripe";

import { supabase }
from "@/lib/supabase";

export const runtime =
  "nodejs";

const stripe =
  new Stripe(
    process.env
      .STRIPE_SECRET_KEY!
  );

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    /*
      VALIDATION
    */

    if (

      !body.title ||

      !body.totalPrice ||

      !body.listingId ||

      !body.renterId ||

      !body.ownerId ||

      !body.startDate ||

      !body.endDate
    ) {

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

    /*
      DATES
    */

    const startDate =
      new Date(
        body.startDate
      );

    const endDate =
      new Date(
        body.endDate
      );

    /*
      INVALID DATES
    */

    if (

      isNaN(
        startDate.getTime()
      ) ||

      isNaN(
        endDate.getTime()
      )
    ) {

      return NextResponse.json(

        {
          error:
            "Ungültige Datumswerte",
        },

        {
          status: 400,
        }
      );
    }

    /*
      SAME USER
    */

    if (
      body.renterId ===
      body.ownerId
    ) {

      return NextResponse.json(

        {
          error:
            "Eigenes Listing kann nicht gebucht werden",
        },

        {
          status: 400,
        }
      );
    }

    /*
      LISTING
    */

    const {
      data: listing,
      error: listingError,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "id",
          body.listingId
        )
        .single();

    if (
      listingError ||
      !listing
    ) {

      return NextResponse.json(

        {
          error:
            "Listing nicht gefunden",
        },

        {
          status: 404,
        }
      );
    }

    /*
      INACTIVE
    */

    if (
      listing.active === false
    ) {

      return NextResponse.json(

        {
          error:
            "Listing nicht aktiv",
        },

        {
          status: 400,
        }
      );
    }

    /*
      OVERLAP CHECK
    */

    const {
      data: overlappingBookings,
    } =
      await supabase
        .from("bookings")
        .select("*")
        .eq(
          "listing_id",
          body.listingId
        )
        .neq(
          "status",
          "cancelled"
        )
        .lte(
          "start_date",
          body.endDate
        )
        .gte(
          "end_date",
          body.startDate
        );

    if (
      overlappingBookings &&
      overlappingBookings.length > 0
    ) {

      return NextResponse.json(

        {
          error:
            "Zeitraum bereits gebucht",
        },

        {
          status: 409,
        }
      );
    }

    /*
      TOTAL DAYS
    */

    const totalDays =
      Math.max(

        1,

        Math.ceil(

          (
            endDate.getTime() -
            startDate.getTime()
          ) /

          (
            1000 *
            60 *
            60 *
            24
          )
        ) + 1
      );

    /*
      PRICES
    */

    const listingPrice =
      Number(
        listing.price || 0
      );

    const subtotal =
      listingPrice *
      totalDays;

    const serviceFee =
      Math.round(
        subtotal * 0.12
      );

    const cleaningFee =
      25;

    const calculatedTotal =

      subtotal +
      serviceFee +
      cleaningFee;

    /*
      MANIPULATION CHECK
    */

    if (

      Number(
        body.totalPrice
      ) !== calculatedTotal
    ) {

      return NextResponse.json(

        {
          error:
            "Preis Manipulation erkannt",
        },

        {
          status: 400,
        }
      );
    }

    /*
      OWNER PROFILE
    */

    const {
      data: ownerProfile,
      error: ownerError,
    } =
      await supabase
        .from("profiles")
        .select(
          "stripe_account_id"
        )
        .eq(
          "id",
          body.ownerId
        )
        .single();

    if (

      ownerError ||

      !ownerProfile
    ) {

      return NextResponse.json(

        {
          error:
            "Vermieter Profil nicht gefunden",
        },

        {
          status: 404,
        }
      );
    }

    /*
      STRIPE CONNECT
    */

    if (
      !ownerProfile
        .stripe_account_id
    ) {

      return NextResponse.json(

        {
          error:
            "Vermieter hat Stripe Connect nicht eingerichtet",
        },

        {
          status: 400,
        }
      );
    }

    /*
      STRIPE AMOUNT
    */

    const totalAmount =
      Math.round(
        calculatedTotal * 100
      );

    /*
      PLATFORM FEE
    */

    const applicationFee =
      Math.round(
        totalAmount * 0.1
      );

    /*
      CHECKOUT SESSION
    */

    const session =
      await stripe.checkout.sessions.create({

        mode:
          "payment",

        payment_method_types: [

          "card",
        ],

        billing_address_collection:
          "required",

        customer_creation:
          "always",

        line_items: [

          {

            quantity: 1,

            price_data: {

              currency:
                "eur",

              product_data: {

                name:
                  listing.title,

                description:
                  `${totalDays} Tage Buchung`,
              },

              unit_amount:
                totalAmount,
            },
          },
        ],

        /*
          MARKETPLACE
        */

        payment_intent_data: {

          application_fee_amount:
            applicationFee,

          transfer_data: {

            destination:
              ownerProfile
                .stripe_account_id,
          },
        },

        metadata: {

          listingId:
            body.listingId,

          renterId:
            body.renterId,

          ownerId:
            body.ownerId,

          title:
            listing.title,

          startDate:
            body.startDate,

          endDate:
            body.endDate,

          subtotal:
            String(
              subtotal
            ),

          serviceFee:
            String(
              serviceFee
            ),

          cleaningFee:
            String(
              cleaningFee
            ),

          totalPrice:
            String(
              calculatedTotal
            ),
        },

        success_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      });

    /*
      CREATE PENDING BOOKING
    */

    await supabase
      .from("bookings")
      .insert({

        listing_id:
          body.listingId,

        renter_id:
          body.renterId,

        owner_id:
          body.ownerId,

        start_date:
          body.startDate,

        end_date:
          body.endDate,

        total_price:
          calculatedTotal,

        payment_status:
          "Pending",

        status:
          "pending",

        stripe_session_id:
          session.id,
      });

    return NextResponse.json({

      url:
        session.url,
    });

  } catch (error: any) {

    console.log(
      "CHECKOUT ERROR:",
      error
    );

    return NextResponse.json(

      {
        error:
          error.message ||
          "Checkout Fehler",
      },

      {
        status: 500,
      }
    );
  }
}