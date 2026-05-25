import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

import OpenAI
from "openai";

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

    title:
      z.string(),

    category:
      z.string(),

    listingId:
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

    const {

      title,

      category,

      listingId,

    } = parsed.data;

    /*
      AI KEYWORDS
    */

    const completion =
      await openai.chat.completions.create({
        model:
          "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Extrahiere ähnliche Marketplace Keywords.

Maximal 5 Keywords.

Antwort nur als JSON.

Format:
{
  "keywords": []
}
`,
          },

          {
            role: "user",

            content: `
Titel:
${title}

Kategorie:
${category}
`,
          },
        ],

        temperature: 0.3,

        response_format: {
          type:
            "json_object",
        },
      });

    const content =
      completion.choices?.[0]
        ?.message?.content;

    if (!content) {

      return NextResponse.json({
        recommendations: [],
      });
    }

    const parsedAI =
      JSON.parse(content);

    const keywords =
      parsedAI.keywords || [];

    /*
      DB SEARCH
    */

    let query =
      supabase
        .from("listings")
        .select("*")
        .neq(
          "id",
          listingId
        )
        .eq(
          "active",
          true
        )
        .limit(12);

    if (category) {

      query =
        query.eq(
          "category",
          category
        );
    }

    const {
      data,
    } =
      await query;

    if (!data) {

      return NextResponse.json({
        recommendations: [],
      });
    }

    /*
      SIMPLE SCORING
    */

    const scored =
      data.map((item) => {

        let score = 0;

        keywords.forEach(
          (keyword: string) => {

            if (

              item.title
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                )

            ) {

              score += 10;
            }

            if (

              item.description
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                )

            ) {

              score += 5;
            }
          }
        );

        return {

          ...item,

          aiScore:
            score,
        };
      });

    const sorted =
      scored.sort(

        (a, b) =>

          b.aiScore -
          a.aiScore
      );

    return NextResponse.json({

      success: true,

      recommendations:
        sorted.slice(0, 6),
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "AI Empfehlungen Fehler",
      },
      {
        status: 500,
      }
    );

  }
}