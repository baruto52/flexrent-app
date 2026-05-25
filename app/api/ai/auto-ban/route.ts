import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

export const runtime =
  "edge";

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST() {

  try {

    /*
      LOAD USERS
    */

    const {
      data: users,
    } =
      await supabase
        .from("profiles")
        .select("*");

    if (!users) {

      return NextResponse.json({

        success: true,

        processed: 0,
      });
    }

    let bannedCount = 0;

    /*
      LOOP USERS
    */

    for (const user of users) {

      const risk =
        user.risk_score || 0;

      /*
        HARD BAN
      */

      if (risk >= 90) {

        await supabase
          .from("profiles")
          .update({

            banned: true,

            ban_reason:
              "AI Scam Detection",

          })
          .eq(
            "id",
            user.id
          );

        /*
          DISABLE LISTINGS
        */

        await supabase
          .from("listings")
          .update({

            active: false,
          })
          .eq(
            "user_id",
            user.id
          );

        bannedCount++;

        continue;
      }

      /*
        SHADOW BAN
      */

      if (
        risk >= 70 &&
        risk < 90
      ) {

        await supabase
          .from("profiles")
          .update({

            shadow_banned: true,
          })
          .eq(
            "id",
            user.id
          );
      }
    }

    return NextResponse.json({

      success: true,

      banned:
        bannedCount,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Auto Ban Fehler",
      },
      {
        status: 500,
      }
    );

  }
}