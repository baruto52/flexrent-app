import { NextResponse } from "next/server";

import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const message =
      body.message;

    const history =
      body.history || [];

    if (!message) {

      return NextResponse.json(
        {
          error:
            "Keine Nachricht",
        },
        {
          status: 400,
        }
      );
    }

    /*
      HISTORY AUFBAUEN
    */

    const messages = [

      {
        role: "system",

        content: `

Du bist der intelligente AI-Assistent von LOQARO.

Du hilfst Nutzern bei:

- Vermietung
- Buchungen
- Sicherheit
- Listings
- Marketplace Hilfe
- Zahlungen
- Support

WICHTIG:

- Merke dir den bisherigen Chatverlauf
- Antworte immer passend zum Kontext
- Vergiss vorherige Nachrichten nicht
- Stelle Rückfragen passend zum Verlauf
- Sei modern, hilfreich und natürlich
- Antworte nur auf Deutsch
        `,
      },

      ...history,

      {
        role: "user",

        content: message,
      },
    ];

    /*
      OPENAI
    */

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages,

        temperature: 0.7,

        max_tokens: 500,
      });

    const answer =
      completion.choices?.[0]
        ?.message?.content;

    return NextResponse.json({

      success: true,

      answer:
        answer ||
        "Keine Antwort",
    });

  } catch (error: any) {

    console.log(
      "AI ASSISTANT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "AI Fehler",
      },
      {
        status: 500,
      }
    );
  }
}