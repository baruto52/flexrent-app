import { NextResponse }
from "next/server";

import Stripe from "stripe";

import { supabase }
from "@/lib/supabase";

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
      STRIPE CONNECT CHECK
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
      PRICING
    */

    const totalAmount =
      Math.round(

        Number(
          body.totalPrice
        ) * 100
      );

    /*
      10% PLATFORM FEE
    */

    const applicationFee =
      Math.round(
        totalAmount * 0.1
      );

    /*
      STRIPE SESSION
    */

    const session =
      await stripe.checkout.sessions.create({

        mode: "payment",

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

              currency: "eur",

              product_data: {

                name:
                  body.title,

                description:
                  `Buchung von ${body.startDate} bis ${body.endDate}`,
              },

              unit_amount:
                totalAmount,
            },
          },
        ],

        /*
          MARKETPLACE PAYMENT
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
            body.title,

          startDate:
            body.startDate,

          endDate:
            body.endDate,

          totalPrice:
            body.totalPrice,
        },

        success_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      });

    return NextResponse.json({

      url:
        session.url,
    });

  } catch (error: any) {

    console.log(
      "STRIPE ERROR:",
      error
    );

    return NextResponse.json(

      {

        error:
          error.message ||
          "Stripe Fehler",
      },

      {
        status: 500,
      }
    );
  }
}