import ContainerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "catalina-blue": {
          50: "#F4F5F9",
          100: "#E9EAF2",
          200: "#C8CBDF",
          300: "#A6ACCC",
          400: "#646EA6",
          500: "#213080",
          600: "#1E2B73",
          700: "#141D4D",
          800: "#0F163A",
          900: "#0A0E26",
        },
        "violet-red": {
          50: "#FFF5F9",
          100: "#FFEBF2",
          200: "#FFCEDF",
          300: "#FFB0CC",
          400: "#FF74A5",
          500: "#FF397F",
          600: "#E63372",
          700: "#99224C",
          800: "#731A39",
          900: "#4D1126",
        },
        "chetwode-blue": {
          50: "#F8F9FD",
          100: "#F1F3FB",
          200: "#DCE0F6",
          300: "#C7CEF0",
          400: "#9DA9E4",
          500: "#7384D9",
          600: "#6877C3",
          700: "#454F82",
          800: "#343B62",
          900: "#232841",
        },
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        88: "22rem",
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      inset: {
        "1/2": "50%",
      },
    },
    fontFamily: {
      sans: ["Nunito Sans", "-apple-system", "Tahoma"],
    },
  },
  plugins: [ContainerQueries],
};
