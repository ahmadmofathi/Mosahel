/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#80B5C7",
      },
      fontFamily: {
        arabic: ["Almarai", "serif"],
      },
    },
  },
  plugins: [],
};
