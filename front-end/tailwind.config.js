/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lora: ["Lora", "serif"],
        ballet: ["Ballet", "cursive"],
        "libre-baskerville": ['"Libre Baskerville"', "serif"],
        playfair: ['"Playfair Display"', "serif"],
        arapey: ["Arapey", "serif"],
        viaoda: ['"Viaoda Libre"', "cursive"],
        chivo: ["Chivo Mono", "monospace"],
      },
      fontWeight: {
        400: 400,
        700: 700,
        900: 900,
      },
      fontStyle: {
        italic: "italic",
      },
      colors: {
        "citrine-white": "#FCF8D6",
        espresso: "#5E2217",
      },
      animation: {
        spin: "spin 10s linear infinite",
      },
      clipPath: {
        star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      },
      backgroundImage: {
        "custom-radial":
          "radial-gradient(circle, rgba(58,114,180,1) 0%, rgba(253,29,29,1) 59%, rgba(252,176,69,1) 100%)",
        "radial-bluered":
          "radial-gradient(circle, rgba(63,94,251,1) 21%, rgba(235,34,75,1) 93%)",
        "sun-overdose": "linear-gradient(315deg, #ff1a1a 0%, #ffff00 74%)",
      },
    },
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        ".clip-star": {
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  daisyui: {
    themes: ["garden", "cupcake"],
  },
};
