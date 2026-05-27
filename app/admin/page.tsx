"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {

  Shield,

  Trash2,

  Users,

  Package,

  BadgeEuro,

  CalendarDays,

  AlertTriangle,

  ShieldCheck,

  Ban,

  Search,

  Flag,

  Eye,

} from "lucide-react";

import toast
from "react-hot-toast";

import { supabase }
from "@/lib/supabase";

export default function AdminPage() {

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [users, setUsers] =
    useState<any[]>([]);

  const [listings, setListings] =
    useState<any[]>([]);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [reports, setReports] =
    useState<any[]>([]);

  const [revenue, setRevenue] =
    useState(0);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    init();

  }, []);

  async function init() {

    try {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

        window.location.href =
          "/login";

        return;
      }

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

      await Promise.all([

        loadUsers(),

        loadListings(),

        loadBookings(),

        loadReports(),
      ]);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  async function loadUsers() {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setUsers(
      data || []
    );
  }

  async function loadListings() {

    const { data } =
      await supabase
        .from("listings")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setListings(
      data || []
    );
  }

  async function loadBookings() {

    const { data } =
      await supabase
        .from("bookings")
        .select("*");

    const bookingsData =
      data || [];

    setBookings(
      bookingsData
    );

    const totalRevenue =
      bookingsData.reduce(

        (
          acc,
          booking
        ) =>

          acc +
          (
            Number(
              booking.total_price
            ) || 0
          ),

        0
      );

    setRevenue(
      totalRevenue
    );
  }

  async function loadReports() {

    const { data } =
      await supabase
        .from("reports")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setReports(
      data || []
    );
  }

  async function deleteListing(
    id: string
  ) {

    const confirmed =
      confirm(
        "Listing löschen?"
      );

    if (!confirmed)
      return;

    const { error } =
      await supabase
        .from("listings")
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {

      toast.error(
        "Fehler beim Löschen"
      );

      return;
    }

    toast.success(
      "Listing gelöscht"
    );

    loadListings();
  }

  async function banUser(
    id: string
  ) {

    const confirmed =
      confirm(
        "Nutzer bannen?"
      );

    if (!confirmed)
      return;

    const { error } =
      await supabase
        .from("profiles")
        .update({

          banned: true,
        })
        .eq(
          "id",
          id
        );

    if (error) {

      toast.error(
        "Ban Fehler"
      );

      return;
    }

    toast.success(
      "Nutzer gebannt"
    );

    loadUsers();
  }

  async function resolveReport(
    id: string
  ) {

    await supabase
      .from("reports")
      .update({

        resolved: true,
      })
      .eq(
        "id",
        id
      );

    toast.success(
      "Report erledigt"
    );

    loadReports();
  }

  const filteredListings =
    listings.filter(
      (listing) =>

        listing.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-black">

        Admin Panel wird geladen...

      </div>

    );
  }

  if (!authorized) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black">

        Kein Zugriff

      </div>

    );
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">

          <div>

            <h1 className="text-5xl md:text-6xl font-black mb-3">

              LOQARO Admin

            </h1>

            <p className="text-gray-500 text-xl">

              Marketplace Moderation Dashboard

            </p>

          </div>

          {/* SEARCH */}

          <div className="relative">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Listings suchen..."
              className="
                h-14
                w-full
                md:w-[320px]
                rounded-2xl
                border
                border-gray-200
                bg-white
                pl-12
                pr-5
                outline-none
                font-medium
              "
            />

          </div>

        </div>

        {/* KPI */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">

          <div className="bg-white rounded-[36px] p-8 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 mb-2">

                  Nutzer

                </p>

                <h2 className="text-5xl font-black">

                  {users.length}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#16d64d] text-white flex items-center justify-center">

                <Users size={30} />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-[36px] p-8 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 mb-2">

                  Listings

                </p>

                <h2 className="text-5xl font-black">

                  {listings.length}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center">

                <Package size={30} />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-[36px] p-8 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 mb-2">

                  Reports

                </p>

                <h2 className="text-5xl font-black">

                  {reports.length}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-red-500 text-white flex items-center justify-center">

                <Flag size={30} />

              </div>

            </div>

          </div>

          <div className="bg-white rounded-[36px] p-8 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 mb-2">

                  Umsatz

                </p>

                <h2 className="text-5xl font-black">

                  €
                  {revenue}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-yellow-500 text-white flex items-center justify-center">

                <BadgeEuro size={30} />

              </div>

            </div>

          </div>

        </div>

        {/* REPORTS */}

        <div className="mb-16">

          <div className="flex items-center gap-4 mb-8">

            <AlertTriangle
              className="text-red-500"
              size={32}
            />

            <h2 className="text-4xl font-black">

              Reports

            </h2>

          </div>

          <div className="space-y-5">

            {reports.map((report) => (

              <div
                key={report.id}
                className="bg-white rounded-[32px] p-7 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              >

                <div>

                  <h3 className="text-2xl font-black mb-3">

                    {report.reason}

                  </h3>

                  <p className="text-gray-600 leading-7">

                    {report.message || "Keine Nachricht"}
                  </p>

                </div>

                <button
                  onClick={() =>
                    resolveReport(
                      report.id
                    )
                  }
                  className="h-14 px-7 rounded-2xl bg-[#16d64d] text-white font-bold"
                >

                  Report lösen

                </button>

              </div>

            ))}

          </div>

        </div>

        {/* USERS */}

        <div className="mb-16">

          <h2 className="text-4xl font-black mb-8">

            Nutzer

          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {users.map((user) => (

              <div
                key={user.id}
                className="bg-white rounded-[32px] p-7 shadow-sm"
              >

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h3 className="text-2xl font-black">

                      {user.full_name || "Unbekannt"}

                    </h3>

                    <p className="text-gray-500 mt-2">

                      {user.email || "Keine Email"}

                    </p>

                  </div>

                  {user.banned ? (

                    <div className="px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-black">

                      GEBANNT

                    </div>

                  ) : (

                    <div className="px-4 py-2 rounded-full bg-[#16d64d]/10 text-[#16d64d] text-xs font-black">

                      AKTIV

                    </div>

                  )}

                </div>

                {!user.banned && (

                  <button
                    onClick={() =>
                      banUser(
                        user.id
                      )
                    }
                    className="h-14 w-full rounded-2xl bg-red-500 text-white flex items-center justify-center gap-3 font-bold"
                  >

                    <Ban size={20} />

                    Nutzer bannen

                  </button>

                )}

              </div>

            ))}

          </div>

        </div>

        {/* LISTINGS */}

        <div>

          <h2 className="text-4xl font-black mb-8">

            Listings

          </h2>

          <div className="space-y-8">

            {filteredListings.map(
              (listing) => (

                <div
                  key={listing.id}
                  className="bg-white rounded-[36px] overflow-hidden shadow-sm"
                >

                  <div className="grid lg:grid-cols-4">

                    {/* IMAGE */}

                    <div className="relative h-[260px]">

                      <Image
                        src={
                          listing?.images?.[0] ||
                          "https://placehold.co/1200x900/png"
                        }
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="lg:col-span-3 p-8 flex flex-col justify-between">

                      <div>

                        <div className="flex items-start justify-between gap-5 mb-5">

                          <div>

                            <h3 className="text-4xl font-black mb-3">

                              {listing.title}

                            </h3>

                            <p className="text-gray-500">

                              {listing.location || "Unbekannt"}

                            </p>

                          </div>

                          <h4 className="text-5xl font-black">

                            €
                            {listing.price}

                          </h4>

                        </div>

                        <p className="text-gray-600 leading-8 line-clamp-3">

                          {listing.description || "Keine Beschreibung"}

                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap gap-4 mt-8">

                        <a
                          href={`/listing/${listing.id}`}
                          className="h-14 px-7 rounded-2xl bg-black text-white flex items-center justify-center gap-3 font-bold"
                        >

                          <Eye size={20} />

                          Öffnen

                        </a>

                        <button
                          onClick={() =>
                            deleteListing(
                              listing.id
                            )
                          }
                          className="h-14 px-7 rounded-2xl bg-red-500 text-white flex items-center justify-center gap-3 font-bold"
                        >

                          <Trash2 size={20} />

                          Löschen

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      <Footer />

    </main>
  );
}