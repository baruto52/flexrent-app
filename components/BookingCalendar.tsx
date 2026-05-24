"use client";

import DatePicker
from "react-datepicker";

import {

  CalendarDays,

  Sparkles,

  Lock,

} from "lucide-react";

type Props = {

  startDate: Date | null;

  endDate: Date | null;

  setStartDate: any;

  setEndDate: any;

  excludedDates?: Date[];
};

export default function BookingCalendar({

  startDate,

  endDate,

  setStartDate,

  setEndDate,

  excludedDates = [],

}: Props) {

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

            Wähle verfügbare Tage
            für deine Buchung.

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

          <CalendarDays
            size={38}
          />

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

            Bereits gebuchte Tage
            sind automatisch blockiert,
            damit keine Doppelbuchungen
            entstehen.

          </p>

        </div>

      </div>

      {/* CALENDARS */}

      <div
        className="
          grid
          md:grid-cols-2
          gap-6
        "
      >

        {/* START */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-6
            shadow-sm
            border
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-[#16d64d]
                text-white
                flex
                items-center
                justify-center
              "
            >

              <CalendarDays
                size={20}
              />

            </div>

            <div>

              <p
                className="
                  text-gray-400
                  text-sm
                  mb-1
                "
              >

                Check-In

              </p>

              <h3
                className="
                  text-2xl
                  font-black
                "
              >

                Startdatum

              </h3>

            </div>

          </div>

          <DatePicker
            selected={startDate}
            onChange={(date) =>
              setStartDate(date)
            }
            minDate={new Date()}
            excludeDates={
              excludedDates
            }
            monthsShown={1}
            inline
            calendarClassName="
              premium-calendar
            "
          />

        </div>

        {/* END */}

        <div
          className="
            bg-white
            rounded-[32px]
            p-6
            shadow-sm
            border
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-black
                text-white
                flex
                items-center
                justify-center
              "
            >

              <CalendarDays
                size={20}
              />

            </div>

            <div>

              <p
                className="
                  text-gray-400
                  text-sm
                  mb-1
                "
              >

                Check-Out

              </p>

              <h3
                className="
                  text-2xl
                  font-black
                "
              >

                Enddatum

              </h3>

            </div>

          </div>

          <DatePicker
            selected={endDate}
            onChange={(date) =>
              setEndDate(date)
            }
            minDate={
              startDate ||
              new Date()
            }
            excludeDates={
              excludedDates
            }
            monthsShown={1}
            inline
            calendarClassName="
              premium-calendar
            "
          />

        </div>

      </div>

      {/* BLOCKED INFO */}

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

              Bereits gebuchte Zeiträume

            </h3>

            <p
              className="
                text-gray-600
                leading-7
              "
            >

              Einige Tage sind bereits
              reserviert und deshalb
              nicht mehr verfügbar.

            </p>

          </div>

        </div>

      )}

    </div>

  );
}