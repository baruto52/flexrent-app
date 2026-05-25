import { NextResponse }
from "next/server";

import OpenAI
from "openai";

import { z }
from "zod";

import { ratelimit }
from "@/lib/rate-limit";

export const runtime =
  "edge";

const openai =
  new OpenAI({
    apiKey:
      process.env.OPENAI_API_KEY,
  });

const schema =
  z.object({
    message:
      z.string()
        .min(1)
        .max(5000),
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
            "Ungültige Nachricht",
        },
        {
          status: 400,
        }
      );
    }

    const { message } =
      parsed.data;

    const completion =
      await openai.chat.completions.create({
        model:
          "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du bist das Sicherheitssystem von LOQARO.

Prüfe Chat Nachrichten auf:
- Scam
- Betrug
- Telegram Betrug
- WhatsApp Betrug
- Vorauszahlung
- Fake Versand
- externe Zahlung
- verdächtige Links

Antwort nur als JSON.

Format:
{
  "risk": "low" | "medium" | "high",
  "safe": true | false,
  "reason": ""
}
`,
          },

          {
            role: "user",

            content:
              message,
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

    return NextResponse.json({

      success: true,

      moderation:
        result,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Chat Moderation Fehler",
      },
      {
        status: 500,
      }
    );

  }
}