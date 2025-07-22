/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#d40000",
      },
      fontFamily: {
        arabic: ["Almarai", "serif"],
      },
    },
  },
  plugins: [],
};
