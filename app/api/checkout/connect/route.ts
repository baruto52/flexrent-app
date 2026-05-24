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
      CREATE CONNECT ACCOUNT
    */

    const account =
      await stripe.accounts.create({

        type:
          "express",

        email,

        capabilities: {

          transfers: {

            requested: true,
          },

          card_payments: {

            requested: true,
          },
        },
      });

    /*
      SAVE STRIPE ACCOUNT
    */

    await supabase
      .from("profiles")
      .update({

        stripe_account_id:
          account.id,
      })
      .eq(
        "id",
        userId
      );

    /*
      ACCOUNT LINK
    */

    const accountLink =
      await stripe.accountLinks.create({

        account:
          account.id,

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

    console.log(error);

    return NextResponse.json(

      {
        error:
          error.message,
      },

      {
        status: 500,
      }
    );
  }
}