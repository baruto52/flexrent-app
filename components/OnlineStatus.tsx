"use client";

import {
  useEffect,
} from "react";

import { supabase }
from "@/lib/supabase";

export default function OnlineStatus() {

  useEffect(() => {

    let interval:
      NodeJS.Timeout;

    let currentUserId = "";

    init();

    async function init() {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session)
        return;

      currentUserId =
        session.user.id;

      /*
        SET ONLINE
      */

      await setOnline();

      /*
        HEARTBEAT
      */

      interval =
        setInterval(
          async () => {

            await setOnline();

          },
          30000
        );

      /*
        PAGE HIDDEN
      */

      document.addEventListener(
        "visibilitychange",
        handleVisibility
      );

      /*
        TAB CLOSE
      */

      window.addEventListener(
        "beforeunload",
        handleOffline
      );
    }

    async function setOnline() {

      if (!currentUserId)
        return;

      await supabase
        .from("profiles")
        .update({

          online: true,

          last_seen:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          currentUserId
        );
    }

    async function handleOffline() {

      if (!currentUserId)
        return;

      await supabase
        .from("profiles")
        .update({

          online: false,

          last_seen:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          currentUserId
        );
    }

    async function handleVisibility() {

      if (
        document.hidden
      ) {

        await handleOffline();

      } else {

        await setOnline();
      }
    }

    return () => {

      clearInterval(
        interval
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "beforeunload",
        handleOffline
      );

      handleOffline();
    };

  }, []);

  return null;
}