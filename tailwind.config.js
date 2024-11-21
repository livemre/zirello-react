/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins: "Poppins",
    },
    extend: {
      boxShadow: {
        "inner-lg": "inset 0 4px 6px rgba(0, 0, 0, 0.5)", // Özel iç gölge
      },
      brightness: {
        10: ".1", // Özel parlaklık değeri (10%)
        20: ".2", // Özel parlaklık değeri (10%)
        30: ".3", // Özel parlaklık değeri (10%)
        40: ".4", // Özel parlaklık değeri (10%)
        60: ".6", // Özel parlaklık değeri (10%)
      },
    },
  },
  plugins: [],
};
