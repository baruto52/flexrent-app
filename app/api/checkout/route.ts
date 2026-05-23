import { NextResponse }
from "next/server";

import Stripe from "stripe";

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
      !body.price ||
      !body.listingId
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
      STRIPE SESSION
    */

    const session =
      await stripe.checkout.sessions.create({

        mode: "payment",

        payment_method_types: [

          "card",
        ],

        line_items: [

          {
            quantity: 1,

            price_data: {

              currency: "eur",

              product_data: {

                name:
                  body.title,
              },

              unit_amount:
                Math.round(
                  Number(
                    body.price
                  ) * 100
                ),
            },
          },
        ],

        success_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/bookings?success=true`,

        cancel_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/listing/${body.listingId}?canceled=true`,

        metadata: {

          listingId:
            body.listingId,

          renterId:
            body.renterId,

          ownerId:
            body.ownerId,

          title:
            body.title,
        },
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