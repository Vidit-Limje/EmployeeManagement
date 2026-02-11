/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      /* Fade animation (used across cards) */
      animation: {
        fade: "fadeIn 0.4s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          from: {
            opacity: 0,
            transform: "translateY(6px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
    },
  },

  plugins: [
    /* 🪩 Animation Delay Utilities */
    function ({ addUtilities }) {
      addUtilities({
        ".animation-delay-200": {
          animationDelay: "200ms",
        },
        ".animation-delay-500": {
          animationDelay: "500ms",
        },
        ".animation-delay-700": {
          animationDelay: "700ms",
        },
      });
    },
  ],
};
