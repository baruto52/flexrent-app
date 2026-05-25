import { NextResponse }
from "next/server";

import { resend }
from "@/lib/resend";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      email,
      title,
      startDate,
      endDate,
      totalPrice,
    } = body;

    await resend.emails.send({

      from:
        "Loqaro <onboarding@resend.dev>",

      to:
        email,

      subject:
        "Buchung bestätigt",

      html: `

        <div style="font-family:sans-serif;padding:40px;max-width:600px;margin:auto">

          <h1 style="font-size:32px;font-weight:900;margin-bottom:20px">

            Buchung bestätigt 🎉

          </h1>

          <p style="font-size:18px;line-height:32px">

            Deine Buchung wurde erfolgreich bestätigt.

          </p>

          <div style="margin-top:30px;padding:30px;border-radius:20px;background:#f5f7fb">

            <h2>${title}</h2>

            <p>
              Zeitraum:
              ${startDate}
              bis
              ${endDate}
            </p>

            <p>
              Gesamtpreis:
              €${totalPrice}
            </p>

          </div>

        </div>
      `,
    });

    return NextResponse.json({

      success: true,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json(

      {
        error:
          error.message,
      },

      {
        status: 500,
      }
    );
  }
}