import { supabase } from "./supabase";

export async function toggleFavorite(
  listingId: string
) {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session) {

    window.location.href =
      "/login";

    return false;
  }

  const userId =
    session.user.id;

  const { data: existing } =
    await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("listing_id", listingId)
      .single();

  if (existing) {

    await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    return false;
  }

  await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      listing_id: listingId,
    });

  return true;
}

export async function checkFavorite(
  listingId: string
) {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const { data } =
    await supabase
      .from("favorites")
      .select("*")
      .eq(
        "user_id",
        session.user.id
      )
      .eq(
        "listing_id",
        listingId
      )
      .single();

  return !!data;
}