/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#80b5c7",
      },
      fontFamily: {
        arabic: ["Almarai", "serif"],
      },
    },
  },
  plugins: [],
};
