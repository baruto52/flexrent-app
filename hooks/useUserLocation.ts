"use client";

import {
  useEffect,
  useState,
} from "react";

export default function useUserLocation() {

  const [location, setLocation] =
    useState<{

      lat: number;

      lng: number;
    } | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (
      !navigator.geolocation
    ) {

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLocation({

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,
        });

        setLoading(false);
      },

      () => {

        setLoading(false);
      }
    );

  }, []);

  return {

    location,

    loading,
  };
}