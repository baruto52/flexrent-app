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
  title: z.string().min(2).max(200),

  category:
    z.string().min(2).max(100),
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
    } = parsed.data;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du schreibst hochwertige Marketplace Beschreibungen für LOQARO.

Die Beschreibung soll:
- professionell wirken
- vertrauenswürdig wirken
- SEO optimiert sein
- natürlich wirken
- maximal 120 Wörter haben
- keine Emojis enthalten
- modern formuliert sein
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

        temperature: 0.7,
      });

    const description =
      completion.choices?.[0]
        ?.message?.content;

    return NextResponse.json({
      success: true,
      description,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Beschreibung konnte nicht generiert werden",
      },
      {
        status: 500,
      }
    );

  }
}