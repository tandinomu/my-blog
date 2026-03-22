/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: "#00f5d4", 400: "#00f5d4", 300: "#67fce8" },
        magenta: { DEFAULT: "#e91e8c", 400: "#e91e8c" },
        dark: { DEFAULT: "#050c12", 800: "#0a1628", 700: "#0d1f35" },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
