import {
  Grid2X2,
  Wrench,
  Car,
  Warehouse,
  Monitor,
  Dumbbell,
} from "lucide-react";

const categories = [
  {
    icon: Grid2X2,
    name: "Alle",
  },
  {
    icon: Wrench,
    name: "Werkzeuge",
  },
  {
    icon: Car,
    name: "Fahrzeuge",
  },
  {
    icon: Warehouse,
    name: "Parkplätze",
  },
  {
    icon: Monitor,
    name: "Elektronik",
  },
  {
    icon: Dumbbell,
    name: "Sport",
  },
];

export default function CategorySection() {
  return (
    <section className="px-8 mt-6">
      <div className="max-w-[1500px] mx-auto bg-white rounded-[28px] px-8 py-7 flex items-center justify-between shadow-sm">
        
        {categories.map((item, i) => {
          const Icon = item.icon;

          return (
            <button
              key={i}
              className="flex flex-col items-center gap-3"
            >
              <Icon size={28} />

              <span className="font-semibold">
                {item.name}
              </span>
            </button>
          );
        })}

        <button className="h-[56px] px-8 rounded-2xl border font-semibold">
          Alle Kategorien
        </button>
      </div>
    </section>
  );
}