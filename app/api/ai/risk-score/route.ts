import { NextResponse }
from "next/server";

import OpenAI
from "openai";

import { createClient }
from "@supabase/supabase-js";

import { z }
from "zod";

export const runtime =
  "edge";

const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY,
  });

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
            "Ungültige Anfrage",
        },
        {
          status: 400,
        }
      );
    }

    const {
      userId,
    } = parsed.data;

    /*
      REPORTS
    */

    const {
      data: reports,
    } =
      await supabase
        .from("reports")
        .select("*")
        .eq(
          "reported_user_id",
          userId
        );

    /*
      LISTINGS
    */

    const {
      data: listings,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "user_id",
          userId
        );

    /*
      AI ANALYSIS
    */

    const completion =
      await openai.chat.completions.create({
        model:
          "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du analysierst Marketplace Nutzer.

Bewerte:
- Scam Risiko
- Spam Risiko
- Betrugsmuster
- auffällige Listings
- viele Reports

Antwort nur als JSON.

Format:
{
  "riskScore": 0-100,
  "flagged": true | false,
  "reason": ""
}
`,
          },

          {
            role: "user",

            content: `
REPORTS:
${JSON.stringify(reports)}

LISTINGS:
${JSON.stringify(listings)}
`,
          },
        ],

        temperature: 0.1,

        response_format: {
          type:
            "json_object",
        },
      });

    const content =
      completion.choices?.[0]
        ?.message?.content;

    if (!content) {

      return NextResponse.json(
        {
          error:
            "Keine AI Antwort",
        },
        {
          status: 500,
        }
      );
    }

    const result =
      JSON.parse(content);

    /*
      UPDATE PROFILE
    */

    await supabase
      .from("profiles")
      .update({

        risk_score:
          result.riskScore || 0,

        flagged:
          result.flagged || false,
      })
      .eq(
        "id",
        userId
      );

    return NextResponse.json({

      success: true,

      risk:
        result,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Risk Analyse Fehler",
      },
      {
        status: 500,
      }
    );

  }
}