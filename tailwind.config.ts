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
        panel: "#12100d",
        border: "#302820",
        accent: "#fbbf24",
        highlight: "#f59e0b",
        success: "#34d399",
        danger: "#f87171"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245, 158, 11, 0.12), 0 14px 42px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
