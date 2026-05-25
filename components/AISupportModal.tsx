"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function AISupportModal({
  onClose,
}: Props) {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [answer, setAnswer] =
    useState("");

  async function askAI() {
    if (!message) return;

    try {
      setLoading(true);

      const res = await fetch(
        "/api/ai/support",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data =
        await res.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);

      setAnswer(
        "AI Fehler aufgetreten."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] p-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black">
            LOQARO AI
          </h1>

          <button
            onClick={onClose}
            className="text-3xl"
          >
            ×
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Beschreibe dein Problem..."
          className="w-full border border-gray-200 rounded-3xl p-5 h-40 outline-none"
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="mt-5 w-full h-16 rounded-3xl bg-[#16d64d] text-white font-black"
        >
          {loading
            ? "AI antwortet..."
            : "AI fragen"}
        </button>

        {answer && (
          <div className="mt-6 bg-[#f5f7fb] rounded-3xl p-6">
            <p className="whitespace-pre-wrap leading-8 text-black">
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}