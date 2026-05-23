"use client";

import {
  Users,
  MapPin,
  Star,
  Briefcase,
} from "lucide-react";

const stats = [
  {
    title: "Aktive Nutzer",
    value: "25K+",
    icon: Users,
  },

  {
    title: "Anzeigen",
    value: "120K+",
    icon: Briefcase,
  },

  {
    title: "Städte",
    value: "850+",
    icon: MapPin,
  },

  {
    title: "Bewertung",
    value: "4.9",
    icon: Star,
  },
];

export default function StatsSection() {

  return (
    <section className="px-4 lg:px-8 py-14">

      <div className="max-w-7xl mx-auto">

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="
                  bg-white
                  rounded-[36px]
                  border
                  border-gray-100
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  p-8
                "
              >

                {/* ICON */}

                <div
                  className="
                    w-20
                    h-20
                    rounded-[26px]
                    bg-[#00e01a]/10
                    flex
                    items-center
                    justify-center
                    mb-8
                  "
                >

                  <Icon
                    size={38}
                    className="text-[#00e01a]"
                  />

                </div>

                {/* VALUE */}

                <div
                  className="
                    text-5xl
                    font-black
                    tracking-[-2px]
                    text-gray-900
                  "
                >
                  {item.value}
                </div>

                {/* TITLE */}

                <div
                  className="
                    text-gray-500
                    text-lg
                    mt-4
                  "
                >
                  {item.title}
                </div>

              </div>

            );
          })}

        </div>

      </div>

    </section>
  );
}