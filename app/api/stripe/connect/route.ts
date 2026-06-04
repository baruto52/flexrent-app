import { supabase }
from "@/lib/supabase";

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
    const body =
  await request.json();

const {
  userId,
} = body;

    const account =
      await stripe.accounts.create({

        type: "express",
      });

      const { data, error } =
  await supabase
    .from("profiles")
    .update({
      stripe_account_id:
        account.id,
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
  "ACCOUNT ID:",
  account.id
);

console.log(
  "UPDATE DATA:",
  data
);

console.log(
  "UPDATE ERROR:",
  error
);

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