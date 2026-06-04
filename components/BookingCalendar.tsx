"use client";

import {
  useEffect,
  useState,
} from "react";

import DatePicker
from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {

  CalendarDays,

  Sparkles,

  Lock,

  Clock3,

} from "lucide-react";

type Props = {

  startDate: Date | null;

  endDate: Date | null;

  setStartDate: any;

  setEndDate: any;

  excludedDates?: Date[];

  rentalType?: string;
};

export default function BookingCalendar({

  startDate,

  endDate,

  setStartDate,

  setEndDate,

  excludedDates = [],

  rentalType = "day",

}: Props) {

  const isHourly =
    rentalType === "hour";

    const [selectedDate, setSelectedDate] =
  useState<Date | null>(
    startDate
  );

const [startTime, setStartTime] =
  useState("09:00");

const [endTime, setEndTime] =
  useState("10:00");

const hours =
  Array.from(
    { length: 24 },
    (_, i) =>
      `${String(i).padStart(
        2,
        "0"
      )}:00`
  );

useEffect(() => {

  if (
    !isHourly ||
    !selectedDate
  )
    return;

  const start =
    new Date(
      selectedDate
    );

  const end =
    new Date(
      selectedDate
    );

  start.setHours(
    Number(
      startTime.split(":")[0]
    ),
    0,
    0,
    0
  );

  end.setHours(
    Number(
      endTime.split(":")[0]
    ),
    0,
    0,
    0
  );

  setStartDate(start);

  setEndDate(end);

}, [

  selectedDate,

  startTime,

  endTime,

  isHourly,

  setStartDate,

  setEndDate,

]);

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-5
        "
      >

        <div>

          <h2
            className="
              text-4xl
              font-black
              mb-3
            "
          >

            Zeitraum wählen

          </h2>

          <p
            className="
              text-gray-500
              text-lg
            "
          >

            {isHourly

              ? "Wähle Datum und Uhrzeit."

              : "Wähle verfügbare Tage für deine Buchung."
            }

          </p>

        </div>

        <div
          className="
            hidden
            md:flex
            w-20
            h-20
            rounded-[28px]
            bg-[#16d64d]
            text-white
            items-center
            justify-center
            shadow-xl
          "
        >

          {isHourly ? (

            <Clock3
              size={38}
            />

          ) : (

            <CalendarDays
              size={38}
            />

          )}

        </div>

      </div>

      {/* INFO */}

      <div
        className="
          bg-[#16d64d]/10
          border
          border-[#16d64d]/20
          rounded-[28px]
          p-6
          flex
          items-start
          gap-4
        "
      >

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-[#16d64d]
            text-white
            flex
            items-center
            justify-center
            min-w-fit
          "
        >

          <Sparkles
            size={24}
          />

        </div>

        <div>

          <h3
            className="
              text-xl
              font-black
              mb-2
            "
          >

            Live Verfügbarkeit

          </h3>

          <p
            className="
              text-gray-600
              leading-7
            "
          >

            Bereits reservierte Zeiten
            werden automatisch blockiert.

          </p>

        </div>

      </div>

<div className="grid gap-6">

  {isHourly ? (

    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">

      <h3 className="text-2xl font-black mb-6">

        Stundenbuchung

      </h3>

      <div className="grid md:grid-cols-3 gap-5">

        <div>

          <label className="font-bold mb-2 block">

            Datum

          </label>

          <DatePicker
            selected={selectedDate}
            onChange={(date) =>
              setSelectedDate(date)
            }
            minDate={new Date()}
            excludeDates={excludedDates}
            dateFormat="dd.MM.yyyy"
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-4
            "
          />

        </div>

        <div>

          <label className="font-bold mb-2 block">

            Von

          </label>

          <select
            value={startTime}
            onChange={(e) =>
              setStartTime(
                e.target.value
              )
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-4
            "
          >

            {hours.map((hour) => (

              <option
                key={hour}
                value={hour}
              >

                {hour}

              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="font-bold mb-2 block">

            Bis

          </label>

          <select
            value={endTime}
            onChange={(e) =>
              setEndTime(
                e.target.value
              )
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-200
              px-4
            "
          >

            {hours.map((hour) => (

              <option
                key={hour}
                value={hour}
              >

                {hour}

              </option>

            ))}

          </select>

        </div>

      </div>

    </div>

  ) : (

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">

        <label className="font-black block mb-3">

          Startdatum

        </label>

        <DatePicker
          selected={startDate}
          onChange={(date) =>
            setStartDate(date)
          }
          minDate={new Date()}
          excludeDates={excludedDates}
          dateFormat="dd.MM.yyyy"
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-gray-200
            px-4
          "
        />

      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">

        <label className="font-black block mb-3">

          Enddatum

        </label>

        <DatePicker
          selected={endDate}
          onChange={(date) =>
            setEndDate(date)
          }
          minDate={
            startDate ||
            new Date()
          }
          excludeDates={excludedDates}
          dateFormat="dd.MM.yyyy"
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-gray-200
            px-4
          "
        />

      </div>

    </div>

  )}

</div>

      {/* BLOCKED */}

      {excludedDates.length > 0 && (

        <div
          className="
            bg-white
            rounded-[28px]
            p-6
            border
            border-gray-100
            shadow-sm
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-red-100
              text-red-500
              flex
              items-center
              justify-center
              min-w-fit
            "
          >

            <Lock
              size={24}
            />

          </div>

          <div>

            <h3
              className="
                text-xl
                font-black
                mb-2
              "
            >

              Blockierte Zeiten

            </h3>

            <p
              className="
                text-gray-600
                leading-7
              "
            >

              Bereits reservierte
              Zeiträume sind automatisch
              gesperrt.

            </p>

          </div>

        </div>

      )}

    </div>

  );
}