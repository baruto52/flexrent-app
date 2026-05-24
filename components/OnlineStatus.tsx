"use client";

import {
  useEffect,
} from "react";

import { supabase }
from "@/lib/supabase";

export default function OnlineStatus() {

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session)
      return;

    const userId =
      session.user.id;

    /*
      ONLINE
    */

    await supabase
      .from("profiles")
      .update({

        online: true,

        last_seen:
          new Date(),
      })
      .eq(
        "id",
        userId
      );

    /*
      OFFLINE
    */

    const handleOffline =
      async () => {

        await supabase
          .from("profiles")
          .update({

            online: false,

            last_seen:
              new Date(),
          })
          .eq(
            "id",
            userId
          );
      };

    window.addEventListener(
      "beforeunload",
      handleOffline
    );

    return () => {

      handleOffline();

      window.removeEventListener(
        "beforeunload",
        handleOffline
      );
    };
  }

  return null;
}