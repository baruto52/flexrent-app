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

    fullName:
      z.string()
        .min(3)
        .max(100),

    phone:
      z.string()
        .min(5)
        .max(30),

    documentUrl:
      z.string(),
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

    const data =
      parsed.data;

    /*
      CREATE REQUEST
    */

    const {
      error,
    } =
      await supabase
        .from(
          "verification_requests"
        )
        .insert({

          user_id:
            data.userId,

          full_name:
            data.fullName,

          phone:
            data.phone,

          document_url:
            data.documentUrl,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Verification Fehler",
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