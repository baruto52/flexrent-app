import { NextResponse }
from "next/server";

import Stripe
from "stripe";

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

    const account =
      await stripe.accounts.create({

        type: "express",
      });

    const accountLink =
      await stripe.accountLinks.create({

        account:
          account.id,

        refresh_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,

        return_url:
          `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,

        type:
          "account_onboarding",
      });

   return NextResponse.json({
  url: accountLink.url,
});

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Stripe Connect Fehler",
      },
      {
        status: 500,
      }
    );

  }
}