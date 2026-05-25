"use client";

import {
  ShieldCheck,
  BadgeCheck,
  Zap,
  MessagesSquare,
} from "lucide-react";

const features = [
  {
    title: "Sicheres Mieten",
    description:
      "Verifizierte Nutzer, sichere Zahlungen und modernes Trust-System.",
    icon: ShieldCheck,
  },

  {
    title: "Geprüfte Anbieter",
    description:
      "Bewertungen, Profile und Community-Schutz für maximale Sicherheit.",
    icon: BadgeCheck,
  },

  {
    title: "Schnelle Buchungen",
    description:
      "In Sekunden mieten oder vermieten — ohne komplizierte Prozesse.",
    icon: Zap,
  },

  {
    title: "Direkter Chat",
    description:
      "Kommuniziere direkt mit Vermietern und Mietern in Echtzeit.",
    icon: MessagesSquare,
  },
];

export default function FeaturesSection() {

  return (
    <section className="px-4 lg:px-8 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-16">

          <h2
            className="
              text-5xl
              lg:text-6xl
              font-black
              tracking-[-3px]
            "
          >
            Warum Loqaro?
          </h2>

          <p
            className="
              text-gray-500
              text-xl
              mt-6
              max-w-3xl
              mx-auto
              leading-9
            "
          >
            Die moderne Plattform für
            sichere Vermietungen,
            flexible Mietmodelle
            und einfache Kommunikation.
          </p>

        </div>

        {/* GRID */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-4
            gap-8
          "
        >

          {features.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="
                  bg-white
                  rounded-[36px]
                  p-8
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >

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

                <h3
                  className="
                    text-3xl
                    font-black
                    leading-tight
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    text-gray-500
                    mt-5
                    leading-8
                    text-lg
                  "
                >
                  {item.description}
                </p>

              </div>

            );
          })}

        </div>

      </div>

    </section>
  );
}