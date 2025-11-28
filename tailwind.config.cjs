/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(135deg, #0f172a 0%, #0b1223 35%, #0f172a 100%)",
        "header-gradient": "linear-gradient(120deg, #1d4ed8 0%, #6366f1 50%, #22d3ee 100%)",
      },
    },
  },
  plugins: [],
};
