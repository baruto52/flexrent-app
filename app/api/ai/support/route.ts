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
- antworte kurz und modern
- maximal 2-4 Sätze
- keine langen Wikipedia Texte
- antworte wie ein echter Support Chat
- freundlich aber kurz
- fokus auf Vermietung und Marketplace
- Scam erkennen
- Nutzer schützen
- keine falschen Informationen erfinden
- niemals halluzinieren

WICHTIG:
Wenn Nutzer nur ein Wort schreiben wie:
"Bohrmaschine"
"BMW"
"Werkzeug"

Dann erkläre NICHT allgemein das Produkt.

Sondern frage:
- ob sie mieten möchten
- kaufen möchten
- verkaufen möchten
- Hilfe bei Auswahl brauchen

Antworten sollen kurz sein.

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

        max_tokens: 120,
      });

    const answer =
      completion.choices?.[0]
        ?.message?.content;

    return NextResponse.json({
      success: true,
      answer,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "AI Fehler",
      },
      {
        status: 500,
      }
    );

  }
}