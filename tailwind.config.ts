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
        slate: {
          midnight: "#152A35",
          deep: "#193948",
        },
        aqua: {
          spotlight: "#2B5A6B",
        },
        cream: {
          paper: "#EAE6DF",
          muted: "#B8B3A8",
        },
        cyan: {
          accent: "#5ED1C9",
          glow: "#8AF0E8",
        },
      },
      fontFamily: {
        display: ["Teko", "Bebas Neue", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-spotlight": "radial-gradient(circle at 50% 45%, #2B5A6B 0%, #193948 65%, #152A35 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(43, 90, 107, 0.3) 0%, rgba(21, 42, 53, 0.7) 100%)",
        "cyan-glow": "radial-gradient(circle at 50% 50%, rgba(94, 209, 201, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(94, 209, 201, 0.3)",
        "card-hover": "0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(94, 209, 201, 0.15)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-cyan": "pulseCyan 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseCyan: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
