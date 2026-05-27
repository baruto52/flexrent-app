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

      return NextResponse.json({

        safe: true,
      });
    }

    const completion =
      await openai.chat.completions.create({

        model:
          "gpt-4o-mini",

        temperature: 0,

        messages: [

          {
            role: "system",

            content: `
Du bist ein Anti-Scam Sicherheitssystem.

Prüfe Nachrichten auf:
- Telegram Betrug
- WhatsApp Betrug
- Vorauszahlung
- externe Zahlung
- verdächtige Links
- Fake Versand
- Betrug
- Scam

Wenn Gefahr erkannt wird:
safe = false

Antwort nur JSON:

{
  "safe": true,
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

        response_format: {

          type:
            "json_object",
        },
      });

    const content =
      completion
        .choices?.[0]
        ?.message?.content;

    if (!content) {

      return NextResponse.json({

        safe: true,
      });
    }

    const result =
      JSON.parse(content);

    return NextResponse.json(
      result
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json({

      safe: true,
    });
  }
}