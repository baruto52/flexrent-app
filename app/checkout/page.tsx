"use client";

import { useState } from "react";

import {
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutPage() {

  const [cardNumber, setCardNumber] =
    useState("");

  const [name, setName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvc, setCvc] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* PAY */

  const handlePayment =
    async () => {

      setLoading(true);

      /*
        HIER STRIPE IMPLEMENTIEREN
      */

      setTimeout(() => {

        alert(
          "Zahlung erfolgreich"
        );

        setLoading(false);

      }, 2000);
    };

  return (
    <main
      className="
        min-h-screen
        bg-[#f4f7fb]
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          bg-white
          rounded-[40px]
          shadow-xl
          overflow-hidden
        "
      >

        {/* TOP */}

        <div
          className="
            p-10
            border-b
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#00e01a]
                flex
                items-center
                justify-center
              "
            >

              <CreditCard
                size={30}
              />

            </div>

            <div>

              <h1
                className="
                  text-5xl
                  font-black
                  tracking-[-2px]
                "
              >
                Checkout
              </h1>

              <p
                className="
                  text-gray-500
                  mt-2
                "
              >
                Sichere Zahlung
                über Stripe.
              </p>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-10">

          {/* SUMMARY */}

          <div
            className="
              bg-gray-100
              rounded-[30px]
              p-8
              mb-10
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <span className="text-gray-500">
                Mietpreis
              </span>

              <span className="font-black">
                €250
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <span className="text-gray-500">
                Servicegebühr
              </span>

              <span className="font-black">
                €25
              </span>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                text-3xl
                font-black
                pt-5
                border-t
                border-gray-300
              "
            >

              <span>Gesamt</span>

              <span>€275</span>

            </div>

          </div>

          {/* CARD FORM */}

          <div className="grid gap-6">

            {/* NAME */}

            <div>

              <label className="font-bold">
                Karteninhaber
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Max Mustermann"
                className="
                  w-full
                  mt-3
                  h-16
                  px-6
                  rounded-2xl
                  bg-gray-100
                "
              />

            </div>

            {/* CARD */}

            <div>

              <label className="font-bold">
                Kartennummer
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(
                    e.target.value
                  )
                }
                placeholder="4242 4242 4242 4242"
                className="
                  w-full
                  mt-3
                  h-16
                  px-6
                  rounded-2xl
                  bg-gray-100
                "
              />

            </div>

            {/* ROW */}

            <div className="grid grid-cols-2 gap-5">

              <div>

                <label className="font-bold">
                  Ablaufdatum
                </label>

                <input
                  type="text"
                  value={expiry}
                  onChange={(e) =>
                    setExpiry(
                      e.target.value
                    )
                  }
                  placeholder="12/30"
                  className="
                    w-full
                    mt-3
                    h-16
                    px-6
                    rounded-2xl
                    bg-gray-100
                  "
                />

              </div>

              <div>

                <label className="font-bold">
                  CVC
                </label>

                <input
                  type="text"
                  value={cvc}
                  onChange={(e) =>
                    setCvc(
                      e.target.value
                    )
                  }
                  placeholder="123"
                  className="
                    w-full
                    mt-3
                    h-16
                    px-6
                    rounded-2xl
                    bg-gray-100
                  "
                />

              </div>

            </div>

          </div>

          {/* SECURITY */}

          <div
            className="
              flex
              items-center
              gap-4
              mt-10
              bg-green-50
              rounded-2xl
              p-5
            "
          >

            <ShieldCheck
              size={28}
            />

            <div>

              <div className="font-black">
                Sichere Zahlung
              </div>

              <div className="text-gray-600">
                SSL verschlüsselt
                & Stripe geschützt.
              </div>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={
              handlePayment
            }
            disabled={loading}
            className="
              w-full
              h-16
              rounded-2xl
              bg-[#00e01a]
              text-black
              font-black
              text-lg
              mt-10
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <Lock size={22} />

            {loading
              ? "Wird verarbeitet..."
              : "Jetzt bezahlen"}

          </button>

        </div>

      </div>

    </main>
  );
}