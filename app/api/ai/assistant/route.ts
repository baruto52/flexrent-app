import { NextResponse }
from "next/server";

import OpenAI
from "openai";

export const runtime =
  "nodejs";

const openai =
  new OpenAI({

    apiKey:
      process.env.OPENAI_API_KEY,
  });

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const message =
      body.message;

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
      OPENAI
    */

    const completion =
      await openai.chat.completions.create({

        model:
          "gpt-4o-mini",

        messages: [

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

Antworte modern, freundlich und hilfreich auf Deutsch.
            `,
          },

          {

            role: "user",

            content:
              message,
          },
        ],

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