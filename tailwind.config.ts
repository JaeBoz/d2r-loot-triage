import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        panel: "#111318",
        border: "#232833",
        accent: "#7dd3fc",
        highlight: "#f59e0b",
        success: "#34d399",
        danger: "#f87171"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.15), 0 18px 50px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
