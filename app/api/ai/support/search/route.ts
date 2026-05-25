import { NextResponse } from "next/server";

import OpenAI from "openai";

import { z } from "zod";

import { ratelimit }
from "@/lib/rate-limit";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    return NextResponse.json({
      success: true,
      search: result,
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