import { NextResponse }
from "next/server";

import { supabase }
from "@/lib/supabase";

export async function POST(
  request: Request
) {

  try {

    const subscription =
      await request.json();

    /*
      USER
    */

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json(

        {
          error:
            "Nicht eingeloggt",
        },

        {
          status: 401,
        }
      );
    }

    /*
      SAVE SUB
    */

    await supabase
      .from(
        "push_subscriptions"
      )
      .upsert({

        user_id:
          user.id,

        subscription,
      });

    return NextResponse.json({

      success: true,
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