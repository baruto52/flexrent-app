import { NextResponse } from "next/server";

import OpenAI from "openai";

import { z } from "zod";

import { ratelimit }
from "@/lib/rate-limit";

import { createClient }
from "@supabase/supabase-js";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

const schema = z.object({
  query: z.string().min(2).max(300),
});

export async function POST(
  req: Request
) {

  try {

    const ip =
      req.headers.get(
        "x-forwarded-for"
      ) || "anonymous";

    const { success } =
      await ratelimit.limit(ip);

    if (!success) {

      return NextResponse.json(
        {
          error:
            "Zu viele Anfragen",
        },
        {
          status: 429,
        }
      );

    }

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

    const { query } =
      parsed.data;

    /*
      AI SEARCH ANALYSIS
    */

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du analysierst Marketplace Suchanfragen.

Extrahiere:
- Kategorie
- Preislimit
- Standort
- Suchintention

Antwort ausschließlich als JSON.

Format:
{
  "category": "",
  "maxPrice": "",
  "location": "",
  "intent": ""
}
`,
          },

          {
            role: "user",

            content: query,
          },
        ],

        temperature: 0.1,

        response_format: {
          type: "json_object",
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
      LOAD LISTINGS
    */

    let queryBuilder =
      supabase
        .from("listings")
        .select("*")
        .eq(
          "active",
          true
        )
        .limit(24);

    /*
      CATEGORY
    */

    if (
      result.category
    ) {

      queryBuilder =
        queryBuilder.ilike(
          "category",
          `%${result.category}%`
        );
    }

    /*
      LOCATION
    */

    if (
      result.location
    ) {

      queryBuilder =
        queryBuilder.ilike(
          "location",
          `%${result.location}%`
        );
    }

    /*
      PRICE
    */

    if (
      result.maxPrice &&
      !isNaN(
        Number(
          result.maxPrice
        )
      )
    ) {

      queryBuilder =
        queryBuilder.lte(
          "price",
          Number(
            result.maxPrice
          )
        );
    }

    const {
      data: listings,
      error,
    } =
      await queryBuilder;

    if (error) {

      return NextResponse.json(
        {
          error:
            "Listings Fehler",
        },
        {
          status: 500,
        }
      );
    }

    /*
      AI SORTING
    */

    const sorted =
      (listings || []).sort(

        (a, b) =>

          (b.trust_score || 0) -
          (a.trust_score || 0)
      );

    return NextResponse.json({

      success: true,

      search: result,

      listings:
        sorted,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI Search Fehler",
      },
      {
        status: 500,
      }
    );

  }
}