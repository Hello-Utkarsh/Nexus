import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB", // Primary Blue
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        entity: {
          person: "#2563EB",
          phone: "#0284C7",
          account: "#059669",
          organization: "#7C3AED",
          location: "#D97706",
          vehicle: "#E11D48",
        },
        severity: {
          high: "#DC2626",
          medium: "#D97706",
          low: "#2563EB",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
