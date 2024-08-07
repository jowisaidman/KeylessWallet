/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,tsx, ts}"],
    theme: {
      extend: {
        colors: {
          layer: "#2B2D42",
          default: "#8D99AE",
          card: "#EDF2F4",
          highlight: "#EF233C",
          "on-highlight": "#D90429",
          safe: "#8AC926",
          unsafe: "#FF595E",
          middle: "#FFCA3A",
          unknown: "#1982C4",
  
          "default-dark": "#343A40",
          secondary: "#6C757D",
          "secondary-paragraph": "#495057",
          "secondary-title": "#F77F00",
          "on-secondary-highlight": "#003049",
          "secondary-highlight": "#EAE2B7",
          "on-tertiary-highlight": "#D62828",
          "tertiary-highlight": "#F4A261",
          footer: "#14213D",
        },
        textColor: {
          default: "#FAFAFA",
          secondary: "#6C757D",
        },
        outlineColor: {
          default: "#6C757D",
        },
      },
    },
    plugins: [],
};
  