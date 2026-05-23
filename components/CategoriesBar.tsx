"use client";

import {
  Car,
  Wrench,
  Warehouse,
  Bike,
  Laptop,
  Home,
  Dumbbell,
  Briefcase,
  Package,
  Gamepad2,
  Tent,
  Calendar,
} from "lucide-react";

const categories = [

  {
    title: "Alle",
    icon: Package,
  },

  {
    title: "Werkzeuge",
    icon: Wrench,
  },

  {
    title: "Fahrzeuge",
    icon: Car,
  },

  {
    title: "Lager",
    icon: Warehouse,
  },

  {
    title: "Bikes",
    icon: Bike,
  },

  {
    title: "Elektronik",
    icon: Laptop,
  },

  {
    title: "Immobilien",
    icon: Home,
  },

  {
    title: "Sport",
    icon: Dumbbell,
  },

  {
    title: "Business",
    icon: Briefcase,
  },

  {
    title: "Gaming",
    icon: Gamepad2,
  },

  {
    title: "Camping",
    icon: Tent,
  },

  {
    title: "Events",
    icon: Calendar,
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
          gap-5
          overflow-x-auto
          scrollbar-hide
          pb-3
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
                  min-w-[150px]
                  h-[150px]
                  rounded-[34px]
                  border
                  shadow-sm
                  transition-all
                  duration-300
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-5
                  hover:-translate-y-2
                  hover:shadow-2xl
                  ${
                    active
                      ? "bg-[#16d64d] text-white border-[#16d64d]"
                      : "bg-white border-gray-100"
                  }
                `}
              >

                <div
                  className={`
                    w-20
                    h-20
                    rounded-[26px]
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
                    size={34}
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
                    text-lg
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