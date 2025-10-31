// tailwind.config.ts
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
        primary: "#FFD643", // Brand Yellow (replaces #FFD93D)
        secondary: "#FF4C0A", // Accent Orange

        // Neutral and grayscale palette
        dark: "#161616",
        gray1: "#2D2D2D",
        gray2: "#5B5B5B",
        gray3: "#6C6C6C",
        gray4: "#7F7F7F",
        gray5: "#838383",
        gray6: "#BDBDBD",
        gray7: "#C4C4C4",
        gray8: "#C9C9C9",
        gray9: "#CCCCCC",
        gray10: "#D6D6D6",
        gray11: "#D7D7D7",
        gray12: "#D9D9D9",
        gray13: "#DDDDDD",
        gray14: "#E3E3E3",
        gray15: "#EDEDED",
        gray16: "#EFEFEF",
        gray17: "#EEEEEE",
        gray18: "#F0F0F0",
        light: "#F9F9F9",

        // Functional colors
        success: "#24AC39", // Green
        black: "#000000",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
export default config;
