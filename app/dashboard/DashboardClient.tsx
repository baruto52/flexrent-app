"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/DashboardStats";

import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function DashboardClient() {

  const [loading, setLoading] =
    useState(true);

  const [listings, setListings] =
    useState<any[]>([]);

  useEffect(() => {

    let realtimeChannel: any;

    init().then(
      (channel) => {

        realtimeChannel =
          channel;
      }
    );

    return () => {

      if (realtimeChannel) {

        supabase.removeChannel(
          realtimeChannel
        );
      }
    };

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      window.location.href =
        "/login";

      return;
    }

    await loadListings(
      session.user.id
    );

    return listenListings(
      session.user.id
    );
  }

  function listenListings(
    userId: string
  ) {

    const channel =
      supabase.channel(
        `dashboard-${userId}`
      );

    channel.on(

      "postgres_changes",

      {

        event: "*",

        schema: "public",

        table:
          "listings",

        filter:
          `user_id=eq.${userId}`,
      },

      () => {

        loadListings(
          userId
        );
      }

    );

    channel.subscribe();

    return channel;
  }

  async function loadListings(
    userId: string
  ) {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("listings")
          .select("*")
          .eq(
            "user_id",
            userId
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      if (error) {

        console.log(error);

        setListings([]);

        return;
      }

      setListings(
        data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
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

    try {

      const { error } =
        await supabase
          .from("listings")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {

        alert(
          "Fehler beim Löschen"
        );

        return;
      }

      setListings(
        (prev) =>

          prev.filter(
            (listing) =>

              listing.id !== id
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  async function toggleActive(
    id: string,
    active: boolean
  ) {

    try {

      const { error } =
        await supabase
          .from("listings")
          .update({

            active:
              !active,
          })
          .eq(
            "id",
            id
          );

      if (error) {

        alert(
          "Fehler beim Aktualisieren"
        );

        return;
      }

      setListings(
        (prev) =>

          prev.map(
            (listing) =>

              listing.id === id

                ? {

                    ...listing,

                    active:
                      !active,
                  }

                : listing
          )
      );

    } catch (error) {

      console.log(error);
    }
  }

  const activeListings =

    listings.filter(
      (listing) =>
        listing.active
    ).length;

  const inactiveListings =

    listings.filter(
      (listing) =>
        !listing.active
    ).length;

  const totalValue =

    listings.reduce(

      (
        acc,
        listing
      ) =>

        acc +
        (
          Number(
            listing.price
          ) || 0
        ),

      0
    );

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
        Dashboard wird geladen...
      </div>

    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">

        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
            mb-12
          "
        >

          <div>

            <h1
              className="
                text-6xl
                font-black
                mb-4
              "
            >
              Dashboard
            </h1>

            <p
              className="
                text-gray-500
                text-2xl
              "
            >
              Verwalte deine Listings
            </p>

          </div>

          <Link
            href="/create"
            className="
              h-16
              px-8
              rounded-2xl
              bg-[#16d64d]
              text-white
              flex
              items-center
              justify-center
              gap-3
              font-black
              text-lg
            "
          >

            <Plus
              size={24}
            />

            Neues Listing

          </Link>

        </div>

        <DashboardStats

          totalListings={
            listings.length
          }

          activeListings={
            activeListings
          }

          inactiveListings={
            inactiveListings
          }

          totalValue={
            totalValue
          }

        />

      </div>

      <Footer />

    </main>
  );
}