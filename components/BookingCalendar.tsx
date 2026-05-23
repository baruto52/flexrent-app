"use client";

import DatePicker from "react-datepicker";

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

    <div className="space-y-5">

      <div>

        <p className="font-bold mb-2">

          Startdatum

        </p>

        <DatePicker
          selected={startDate}
          onChange={(date) =>
            setStartDate(date)
          }
          minDate={new Date()}
          excludeDates={excludedDates}
          className="
            w-full
            h-14
            border
            rounded-2xl
            px-5
          "
        />

      </div>

      <div>

        <p className="font-bold mb-2">

          Enddatum

        </p>

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
          className="
            w-full
            h-14
            border
            rounded-2xl
            px-5
          "
        />

      </div>

    </div>

  );
}