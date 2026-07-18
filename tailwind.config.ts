import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FFFFFF",
        "accent-hover": "#D4D4D4",
        surface: "#0A0A0A",
        line: "#262626",
        ink: "#000000",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
