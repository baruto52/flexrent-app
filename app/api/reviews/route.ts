import { NextResponse }
from "next/server";

import { createClient }
from "@supabase/supabase-js";

import { z }
from "zod";

export const runtime =
  "edge";

const supabase =
  createClient(

    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

const schema =
  z.object({

    bookingId:
      z.string(),

    listingId:
      z.string(),

    reviewerId:
      z.string(),

    reviewedUserId:
      z.string(),

    rating:
      z.number()
        .min(1)
        .max(5),

    comment:
      z.string()
        .min(3)
        .max(2000),
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

    const data =
      parsed.data;

    /*
      CREATE REVIEW
    */

    const {
      error,
    } =
      await supabase
        .from("reviews")
        .insert({

          booking_id:
            data.bookingId,

          listing_id:
            data.listingId,

          reviewer_id:
            data.reviewerId,

          reviewed_user_id:
            data.reviewedUserId,

          rating:
            data.rating,

          comment:
            data.comment,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Review Fehler",
        },
        {
          status: 500,
        }
      );
    }

    /*
      LOAD REVIEWS
    */

    const {
      data: reviews,
    } =
      await supabase
        .from("reviews")
        .select("*")
        .eq(
          "reviewed_user_id",
          data.reviewedUserId
        );

    const total =
      reviews?.length || 0;

    const average =
      total > 0

        ? reviews.reduce(

            (
              acc,
              review
            ) =>

              acc +
              Number(
                review.rating
              ),

            0
          ) / total

        : 0;

    /*
      UPDATE PROFILE
    */

    await supabase
      .from("profiles")
      .update({

        average_rating:
          average,

        total_reviews:
          total,
      })
      .eq(
        "id",
        data.reviewedUserId
      );

    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Server Fehler",
      },
      {
        status: 500,
      }
    );

  }
}