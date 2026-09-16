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
        tactical: {
          bg: "#050711",
          panel: "#0A0F1D",
          surface: "#0F1626",
          hover: "#141D30",
          border: "#1E293B",
          borderLight: "#334155",
          muted: "#64748B",
          dim: "#94A3B8",
          text: "#CBD5E1",
          highlight: "#F8FAFC",
        },
        govtech: {
          navy: "#0F172A",
          navyLight: "#1E3A8A",
          canvas: "#F8FAFC",
          surface: "#FFFFFF",
          muted: "#F1F5F9",
          border: "#E2E8F0",
          borderDark: "#CBD5E1",
          text: "#0F172A",
          textMuted: "#475569",
          textDim: "#94A3B8",
        },
        crime: {
          kingpin: "#EF4444",
          kingpinGlow: "rgba(239, 68, 68, 0.35)",
          mule: "#F59E0B",
          muleGlow: "rgba(245, 158, 11, 0.35)",
          telecom: "#06B6D4",
          telecomGlow: "rgba(6, 182, 212, 0.35)",
          shell: "#A855F7",
          shellGlow: "rgba(168, 85, 247, 0.35)",
          enforcer: "#F97316",
          enforcerGlow: "rgba(249, 115, 22, 0.35)",
          victim: "#64748B",
          flow: "#10B981",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
