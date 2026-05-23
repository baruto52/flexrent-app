"use client";

import DatePicker from "react-datepicker";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: any;
  setEndDate: any;
};

export default function BookingCalendar({

  startDate,

  endDate,

  setStartDate,

  setEndDate,

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