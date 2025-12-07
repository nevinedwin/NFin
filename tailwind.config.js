/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode via class e.g. 'dark:bg-color-background-dark'
  theme: {
    extend: {
      colors: {
        // Light mode colors
        color: {
          primary: "#008080", // income
          secondary: "#9fb834",
          accent: "#ff7f50", // expense
          background: "#f5f5dc",
          surface: "#fefefe",
          "primary-text": "#121212",
          "secondary-text": "#2c2c2c",
          "accent-text": "#008080",

          // Dark mode colors
          "primary-dark": "#c7f464", // income
          "secondary-dark": "#008080",
          "accent-dark": "#ff7f50", // expense
          "background-dark": "#121212",
          "surface-dark": "#2c2c2c",
          "primary-text-dark": "#f5f5dc",
          "secondary-text-dark": "#b8b8a0",
          "accent-text-dark": "#c7f464",

          // Status colors
          "error-text": "#dc3545",
          "success-text": "#28a745",
          "neutral-text": "#6c757d",
        },
      },
      keyframes: {
        'text-explode': {
          '0%': {
            letterSpacing: '0',
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            letterSpacing: '2rem',
            opacity: '0',
            transform: 'scale(1.3)',
          },
        },
      },
      animation: {
        'text-explode': 'text-explode 1.5s ease-in forwards',
      },
    },
  },
  plugins: [require('tailwindcss-motion')]
};
