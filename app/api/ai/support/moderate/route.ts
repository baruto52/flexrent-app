import { NextResponse } from "next/server";

import OpenAI from "openai";

import { z } from "zod";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(5000),
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
      description,
    } = parsed.data;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du bist das Sicherheitssystem von LOQARO.

Analysiere Marketplace Listings.

Prüfe auf:
- Scam
- Betrug
- Spam
- illegale Inhalte
- Fake Versand
- Vorauszahlung
- Telegram Betrug
- WhatsApp Betrug

Antwort nur als JSON.

Format:
{
  "risk": "low" | "medium" | "high",
  "safe": true | false,
  "reason": "kurze Erklärung"
}
`,
          },

          {
            role: "user",

            content: `
TITLE:
${title}

DESCRIPTION:
${description}
`,
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
      moderation: result,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Moderation fehlgeschlagen",
      },
      {
        status: 500,
      }
    );

  }
}