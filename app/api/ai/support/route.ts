import { NextResponse } from "next/server";

import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

            content:
              "Du bist der offizielle KI Support von LOQARO.",
          },

          {
            role: "user",

            content:
              message,
          },
        ],
      });

    const answer =
      completion
        .choices?.[0]
        ?.message?.content;

    return NextResponse.json({

      success: true,

      answer:
        answer ||
        "Keine Antwort",
    });

  } catch (error: any) {

    console.log(
      "OPENAI ERROR:",
      error
    );

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