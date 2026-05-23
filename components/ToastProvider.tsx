"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3500,

        style: {
          background: "#ffffff",
          color: "#111827",
          borderRadius: "24px",
          padding: "16px 20px",
          fontWeight: "600",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.08)",
          border:
            "1px solid #f3f4f6",
        },

        success: {
          iconTheme: {
            primary: "#12d64f",
            secondary: "#ffffff",
          },
        },

        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}