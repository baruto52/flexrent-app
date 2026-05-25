import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

import { z }
from "zod";

export const runtime =
  "edge";

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

const schema =
  z.object({

    userId:
      z.string(),

    reason:
      z.string()
        .min(10)
        .max(5000),
  });

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {

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

    const {

      userId,

      reason,

    } = parsed.data;

    /*
      CREATE APPEAL
    */

    const {
      error,
    } =
      await supabase
        .from("appeals")
        .insert({

          user_id:
            userId,

          reason,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Appeal Fehler",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Server Fehler",
      },
      {
        status: 500,
      }
    );

  }
}