"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Navbar from "@/components/Navbar";

import Footer from "@/components/Footer";

import {

  ShieldAlert,

  Trash2,

  ExternalLink,

  Flag,

} from "lucide-react";

import { supabase }
from "@/lib/supabase";

export default function AdminReportsPage() {

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [reports, setReports] =
    useState<any[]>([]);

  useEffect(() => {

    init();

    return () => {

      supabase.removeAllChannels();
    };

  }, []);

  const init =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

      /* ADMIN CHECK */

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            session.user.id
          )
          .maybeSingle();

      if (!profile?.is_admin) {

        setLoading(false);

        return;
      }

      setAuthorized(true);

      await loadReports();

      listenRealtime();

      setLoading(false);
    };

  const listenRealtime =
    () => {

      const channel =
        supabase
          .channel(
            "admin-reports"
          )
          .on(

            "postgres_changes",

            {

              event: "*",

              schema: "public",

              table:
                "reports",
            },

            () => {

              loadReports();
            }

          );

      channel.subscribe();
    };

  const loadReports =
    async () => {

      const { data } =
        await supabase
          .from("reports")
          .select(`
            *,
            listings (
              id,
              title
            )
          `)
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      setReports(
        data || []
      );
    };

  const deleteReport =
    async (
      id: string
    ) => {

      const confirmed =
        confirm(
          "Report löschen?"
        );

      if (!confirmed)
        return;

      await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      setReports(
        (prev) =>

          prev.filter(
            (report) =>
              report.id !== id
          )
      );
    };

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-3xl
          font-black
        "
      >
        Reports werden geladen...
      </div>

    );
  }

  if (!authorized) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-4xl
          font-black
        "
      >
        Kein Zugriff
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="mb-12">

          <div
            className="
              flex
              items-center
              gap-5
              mb-5
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-[28px]
                bg-red-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <ShieldAlert
                size={38}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  md:text-6xl
                  font-black
                "
              >
                Reports
              </h1>

              <p
                className="
                  text-gray-500
                  text-xl
                  mt-3
                "
              >
                Gemeldete Listings verwalten
              </p>

            </div>

          </div>

        </div>

        {/* EMPTY */}

        {reports.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[40px]
              p-20
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-24
                h-24
                rounded-full
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
                mx-auto
                mb-8
              "
            >

              <Flag
                size={42}
              />

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-5
              "
            >
              Keine Reports
            </h2>

            <p
              className="
                text-gray-500
                text-2xl
              "
            >
              Aktuell wurden keine Listings gemeldet.
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {reports.map(
              (report) => (

                <div
                  key={report.id}
                  className="
                    bg-white
                    rounded-[36px]
                    p-8
                    shadow-sm
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-8
                    "
                  >

                    {/* LEFT */}

                    <div className="flex-1">

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-4
                          mb-5
                        "
                      >

                        <div
                          className="
                            px-4
                            py-2
                            rounded-full
                            bg-red-100
                            text-red-500
                            font-bold
                          "
                        >

                          {
                            report.reason
                          }

                        </div>

                        <p className="text-gray-500">

                          {new Date(
                            report.created_at
                          ).toLocaleDateString(
                            "de-DE"
                          )}

                        </p>

                      </div>

                      <h2
                        className="
                          text-3xl
                          font-black
                          mb-4
                        "
                      >

                        {
                          report.listings?.title ||
                          "Gelöschtes Listing"
                        }

                      </h2>

                      <p
                        className="
                          text-gray-700
                          leading-8
                          text-lg
                        "
                      >

                        {
                          report.message ||
                          "Keine Nachricht"
                        }

                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-4
                      "
                    >

                      {/* OPEN */}

                      {report.listing_id && (

                        <Link
                          href={`/listing/${report.listing_id}`}
                          className="
                            h-14
                            px-6
                            rounded-2xl
                            bg-black
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-3
                            font-bold
                          "
                        >

                          <ExternalLink
                            size={20}
                          />

                          Öffnen

                        </Link>

                      )}

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteReport(
                            report.id
                          )
                        }
                        className="
                          h-14
                          px-6
                          rounded-2xl
                          bg-red-500
                          text-white
                          flex
                          items-center
                          justify-center
                          gap-3
                          font-bold
                        "
                      >

                        <Trash2
                          size={20}
                        />

                        Löschen

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <Footer />

    </main>
  );
}