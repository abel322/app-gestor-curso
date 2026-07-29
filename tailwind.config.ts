import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        card: "#111319",
        brand: {
          teal: "#2dd4bf",
          cyan: "#06b6d4",
          purple: "#a855f7",
        },
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(45, 212, 191, 0.35)",
        "glow-lg": "0 0 35px -2px rgba(45, 212, 191, 0.45)",
        "glow-purple": "0 0 20px -3px rgba(168, 85, 247, 0.35)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        waveform: {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s infinite ease-in-out",
        waveform: "waveform 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
