import { NextResponse }
from "next/server";

import webpush
from "@/lib/push";

import { supabase }
from "@/lib/supabase";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      userId,
      title,
      message,
    } = body;

    /*
      GET SUBS
    */

    const {
      data: subscriptions,
    } =
      await supabase
        .from(
          "push_subscriptions"
        )
        .select("*")
        .eq(
          "user_id",
          userId
        );

    if (!subscriptions)
      return NextResponse.json({

        success: true,
      });

    /*
      SEND PUSH
    */

    await Promise.all(

      subscriptions.map(
        async (sub) => {

          try {

            await webpush
              .sendNotification(

                sub.subscription,

                JSON.stringify({

                  title,

                  body:
                    message,
                })
              );

          } catch (error) {

            console.log(error);
          }
        }
      )
    );

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