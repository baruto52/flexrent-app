"use client";

import {
  Wrench,
  Car,
  Warehouse,
  Box,
  Truck,
  Bike,
  Hammer,
  Monitor,
  Grid,
  Building2,
} from "lucide-react";

const categories = [

  {
    title: "Alle",
    icon: Grid,
  },

  {
    title: "Werkzeuge",
    icon: Wrench,
  },

  {
    title: "Parkplätze",
    icon: Car,
  },

  {
    title: "Garagen",
    icon: Warehouse,
  },

  {
    title: "Keller",
    icon: Box,
  },

  {
    title: "Lagerräume",
    icon: Building2,
  },

  {
    title: "Transporter",
    icon: Truck,
  },

  {
    title: "Anhänger",
    icon: Truck,
  },

  {
    title: "Maschinen",
    icon: Hammer,
  },

  {
    title: "Fahrzeuge",
    icon: Bike,
  },

  {
    title: "Baumaschinen",
    icon: Hammer,
  },

  {
    title: "Elektronik",
    icon: Monitor,
  },

  {
    title: "Sonstiges",
    icon: Grid,
  },
];

interface Props {

  selectedCategory: string;

  setSelectedCategory:
    (
      category: string
    ) => void;
}

export default function CategoriesBar({

  selectedCategory,

  setSelectedCategory,

}: Props) {

  return (
    <section className="py-2">

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          scrollbar-hide
          pb-3
          snap-x
          snap-mandatory
        "
      >

        {categories.map(
          (item, index) => {

            const Icon =
              item.icon;

            const active =
              selectedCategory ===
              item.title;

            return (

              <button
                key={index}
                onClick={() =>
                  setSelectedCategory(
                    item.title
                  )
                }
                className={`
                  snap-start
                  min-w-[120px]
                  h-[120px]
                  rounded-[30px]
                  border
                  shadow-sm
                  transition-all
                  duration-300
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  hover:-translate-y-1
                  hover:shadow-xl
                  ${
                    active
                      ? "bg-[#16d64d] text-white border-[#16d64d]"
                      : "bg-white border-gray-100"
                  }
                `}
              >

                <div
                  className={`
                    w-16
                    h-16
                    rounded-[22px]
                    flex
                    items-center
                    justify-center
                    ${
                      active
                        ? "bg-white/20"
                        : "bg-[#16d64d]/10"
                    }
                  `}
                >

                  <Icon
                    size={28}
                    className={
                      active
                        ? "text-white"
                        : "text-[#16d64d]"
                    }
                  />

                </div>

                <span
                  className="
                    font-black
                    text-sm
                    text-center
                    px-2
                  "
                >
                  {item.title}
                </span>

              </button>

            );
          }
        )}

      </div>

    </section>
  );
}