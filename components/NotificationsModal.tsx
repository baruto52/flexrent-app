"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  FaBell,
} from "react-icons/fa";

import { supabase } from "@/lib/supabase";

type Props = {

  user: any;

  onClose: () => void;
};

export default function NotificationsModal({

  user,

  onClose,
}: Props) {

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadNotifications();

  }, []);

  async function loadNotifications() {

    setLoading(true);

    const { data } =
      await supabase
        .from("notifications")
        .select("*")
        .eq(
          "user_id",
          user?.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {

      setNotifications(data);

      await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq(
          "user_id",
          user?.id
        );
    }

    setLoading(false);
  }

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white rounded-[30px] max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <FaBell className="text-yellow-500 text-2xl" />

            <h2 className="text-4xl font-black">

              Benachrichtigungen

            </h2>

          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >

            ×

          </button>

        </div>

        {/* CONTENT */}

        <div className="p-8">

          {loading ? (

            <div className="text-center py-20">

              Lädt...

            </div>

          ) : notifications.length === 0 ? (

            <div className="text-center py-20">

              <h3 className="text-3xl font-black mb-4">

                Keine Benachrichtigungen

              </h3>

              <p className="text-gray-500">

                Neue Aktivitäten erscheinen hier.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {notifications.map(
                (notification) => (

                <div
                  key={notification.id}
                  className="border rounded-3xl p-6"
                >

                  <h3 className="font-black text-xl mb-3">

                    {notification.title}

                  </h3>

                  <p className="text-gray-600 leading-8 mb-4">

                    {notification.message}

                  </p>

                  <p className="text-sm text-gray-400">

                    {new Date(
                      notification.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}