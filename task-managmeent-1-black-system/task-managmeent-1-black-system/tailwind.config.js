/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#24383F",
      },
      fontFamily: {
        arabic: ["Almarai", "serif"],
      },
    },
  },
  plugins: [],
};
