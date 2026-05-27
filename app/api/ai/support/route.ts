import { NextResponse } from "next/server";

import OpenAI from "openai";

import { ratelimit }
from "@/lib/rate-limit";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const message =
      body.message;

    if (!message) {

      return NextResponse.json(
        {
          error:
            "Nachricht fehlt",
        },
        {
          status: 400,
        }
      );

    }

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Du bist der offizielle KI-Support von LOQARO.

LOQARO ist ein Premium Marketplace für:
- Werkzeuge
- Fahrzeuge
- Immobilien
- Elektronik
- Vermietung
- Sharing Economy

Deine Aufgaben:
- professioneller Support
- Scam erkennen
- Nutzer schützen
- hilfreich bleiben
- kurz antworten
- keine falschen Informationen erfinden
- niemals halluzinieren

Wenn Betrug erkannt wird:
- Nutzer warnen
- Sicherheitsmaßnahmen empfehlen
`,
          },

          {
            role: "user",

            content: message,
          },
        ],

        temperature: 0.7,
      });

    const answer =
      completion.choices?.[0]
        ?.message?.content;

    return NextResponse.json({
      success: true,
      answer,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI Fehler",
      },
      {
        status: 500,
      }
    );

  }
}