"use client";

import {
  useEffect,
} from "react";

export default function PushNotifications() {

  useEffect(() => {

    registerPush();

  }, []);

  async function registerPush() {

    try {

      if (
        !("serviceWorker" in navigator)
      ) {

        return;
      }

      if (
        !("PushManager" in window)
      ) {

        return;
      }

      /*
        REGISTER SW
      */

      const registration =
        await navigator
          .serviceWorker
          .register("/sw.js");

      /*
        PERMISSION
      */

      const permission =
        await Notification.requestPermission();

      if (
        permission !== "granted"
      ) {

        return;
      }

      /*
        EXISTING SUB
      */

      let subscription =
        await registration
          .pushManager
          .getSubscription();

      /*
        CREATE SUB
      */

      if (!subscription) {

        subscription =
          await registration
            .pushManager
            .subscribe({

              userVisibleOnly:
                true,

              applicationServerKey:
                urlBase64ToUint8Array(

                  process.env
                    .NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });
      }

      /*
        SAVE SUB
      */

      await fetch(
        "/api/push-subscribe",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            subscription
          ),
        }
      );

    } catch (error) {

      console.log(error);
    }
  }

  function urlBase64ToUint8Array(
    base64String: string
  ) {

    const padding =
      "=".repeat(
        (4 -
          (
            base64String.length %
            4
          )) %
          4
      );

    const base64 =
      (
        base64String +
        padding
      )
        .replace(
          /\-/g,
          "+"
        )
        .replace(
          /_/g,
          "/"
        );

    const rawData =
      window.atob(base64);

    const outputArray =
      new Uint8Array(
        rawData.length
      );

    for (
      let i = 0;
      i < rawData.length;
      ++i
    ) {

      outputArray[i] =
        rawData.charCodeAt(i);
    }

    return outputArray;
  }

  return null;
}