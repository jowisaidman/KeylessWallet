/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,tsx, ts}"],
    theme: {
      extend: {
        colors: {
          layer: "#2b3b48",
          default: "#c1c8c3",
          card: "#EDF2F4",
          highlight: "#6dcf79",
          "on-highlight": "#2c3c49",
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
          "on-tertiary-highlight": "#2c3c49",
          "tertiary-highlight": "#F4A261",
          footer: "#6dcf79",
        },
        textColor: {
          default: "#2c3c49",
          secondary: "#6C757D",
        },
        outlineColor: {
          default: "#6C757D",
        },
      },
    },
    plugins: [],
};
  