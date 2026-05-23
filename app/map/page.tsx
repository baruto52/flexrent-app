"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreMap from "@/components/ExploreMap";

import { supabase }
from "@/lib/supabase";

export default function MapPage() {

  const [listings, setListings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadListings();

  }, []);

  async function loadListings() {

    const {
      data,
    } =
      await supabase
        .from("listings")
        .select("*")
        .eq(
          "active",
          true
        );

    setListings(
      data || []
    );

    setLoading(false);
  }

  return (

    <main className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              mb-4
            "
          >

            Karte

          </h1>

          <p
            className="
              text-gray-500
              text-xl
            "
          >

            Entdecke Listings in deiner Umgebung

          </p>

        </div>

        {loading ? (

          <div
            className="
              h-[700px]
              rounded-[40px]
              bg-gray-200
              animate-pulse
            "
          />

        ) : (

          <ExploreMap
            listings={listings}
          />

        )}

      </div>

      <Footer />

    </main>
  );
}