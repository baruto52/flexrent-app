import type { Config } from "tailwindcss";

const config: Config = {

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {

    extend: {

      colors: {

        premium: {
          green: "#00e01a",
          background: "#f4f7fb",
        },
      },

      boxShadow: {

        premium:
          "0 20px 60px rgba(0,0,0,0.08)",

        card:
          "0 10px 30px rgba(0,0,0,0.06)",

        glow:
          "0 0 40px rgba(0,224,26,0.25)",
      },

      borderRadius: {

        premium: "36px",
      },

      backdropBlur: {

        premium: "24px",
      },

      animation: {

        float:
          "floatAnimation 5s ease-in-out infinite",
      },

      keyframes: {

        floatAnimation: {

          "0%": {
            transform:
              "translateY(0px)",
          },

          "50%": {
            transform:
              "translateY(-12px)",
          },

          "100%": {
            transform:
              "translateY(0px)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;