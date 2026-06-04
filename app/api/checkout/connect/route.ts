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

    const {
      userId,
      email,
    } = body;

    /*
      VALIDATION
    */

    if (
      !userId ||
      !email
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
      CHECK EXISTING PROFILE
    */

    const {
      data: profile,
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          userId
        )
        .maybeSingle();

    if (!profile) {

      return NextResponse.json(

        {
          error:
            "Profil nicht gefunden",
        },

        {
          status: 404,
        }
      );
    }

    /*
      EXISTING ACCOUNT
    */

    let stripeAccountId =
      profile.stripe_account_id;

    /*
      CREATE ACCOUNT
    */

    if (!stripeAccountId) {

      const account =
        await stripe.accounts.create({

          type:
            "express",

          country:
            "DE",

          email,

          business_type:
            "individual",

          capabilities: {

            transfers: {

              requested: true,
            },

            card_payments: {

              requested: true,
            },
          },
        });

      stripeAccountId =
        account.id;

      /*
        SAVE ACCOUNT ID
      */

      const { data, error } =
  await supabase
    .from("profiles")
    .update({
      stripe_account_id:
        stripeAccountId,
    })
    .eq(
      "id",
      userId
    )
    .select();

console.log(
  "USER ID:",
  userId
);

console.log(
  "STRIPE ACCOUNT:",
  stripeAccountId
);

console.log(
  "UPDATE DATA:",
  data
);

console.log(
  "UPDATE ERROR:",
  error
);
    }

    /*
      CREATE ACCOUNT LINK
    */

    const accountLink =
      await stripe.accountLinks.create({

        account:
          stripeAccountId,

        refresh_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,

        return_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,

        type:
          "account_onboarding",
      });

    return NextResponse.json({

      url:
        accountLink.url,
    });

  } catch (error: any) {

    console.log(
      "STRIPE CONNECT ERROR:",
      error
    );

    return NextResponse.json(

      {
        error:
          error.message ||
          "Stripe Connect Fehler",
      },

      {
        status: 500,
      }
    );
  }
}