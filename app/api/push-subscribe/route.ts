import { NextResponse }
from "next/server";

export async function POST(
  request: Request
) {

  try {

    const subscription =
      await request.json();

    console.log(
      "PUSH SUB:",
      subscription
    );

    return NextResponse.json({

      success: true,
    });

  } catch (error: any) {

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