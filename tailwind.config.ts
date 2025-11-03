import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mii-sky": {
          50: "#f1f8ff",
          100: "#dbefff",
          200: "#b8e1fa",
          300: "#8ccff3",
          400: "#5ab6e9",
          500: "#34a0de",
          600: "#1f87c0",
          700: "#186c98",
          800: "#145675",
          900: "#103d52",
          950: "#0b2735",
        },
        "mii-foam": "#f7fbff",
        "mii-silver": "#e2e9f3",
        "mii-ink": "#12263a",
        "mii-lime": "#34d399",
        "mii-slate": "#5f6c7b",
      },
      boxShadow: {
        mii: "0 20px 40px -28px rgba(30, 64, 175, 0.55)",
      },
      keyframes: {
        "achievement-pop": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "ripple-check": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "50%": { transform: "scale(1.3)", opacity: "0.15" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "check-bounce": {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "60%": { transform: "scale(1.4) rotate(20deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "confetti-1": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(-30px, 60px) rotate(360deg) scale(1)", opacity: "0" },
        },
        "confetti-2": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(30px, 70px) rotate(-360deg) scale(1)", opacity: "0" },
        },
        "confetti-3": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(-40px, 80px) rotate(180deg) scale(0.8)", opacity: "0" },
        },
        "confetti-4": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(40px, 75px) rotate(-180deg) scale(0.8)", opacity: "0" },
        },
        "confetti-5": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(-15px, 90px) rotate(270deg) scale(1.2)", opacity: "0" },
        },
        "confetti-6": {
          "0%": { transform: "translate(0, -20px) rotate(0deg) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(15px, 85px) rotate(-270deg) scale(1.2)", opacity: "0" },
        },
        "shine": {
          "0%": { transform: "translateX(-150%) translateY(-150%) rotate(45deg)", opacity: "0" },
          "50%": { opacity: "0.4" },
          "100%": { transform: "translateX(150%) translateY(150%) rotate(45deg)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(34, 197, 94, 0.6)" },
        },
      },
      animation: {
        "achievement-pop": "achievement-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ripple-check": "ripple-check 800ms cubic-bezier(0.4, 0, 0.2, 1)",
        "check-bounce": "check-bounce 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "confetti-1": "confetti-1 1000ms ease-out forwards",
        "confetti-2": "confetti-2 1100ms ease-out forwards",
        "confetti-3": "confetti-3 1000ms ease-out forwards",
        "confetti-4": "confetti-4 1100ms ease-out forwards",
        "confetti-5": "confetti-5 1200ms ease-out forwards",
        "confetti-6": "confetti-6 1200ms ease-out forwards",
        "shine": "shine 800ms ease-out",
        "pulse-glow": "pulse-glow 600ms ease-in-out",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        gloss: "14px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
