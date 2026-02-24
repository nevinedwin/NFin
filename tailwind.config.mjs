/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode via class e.g. 'dark:bg-color-background-dark'
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",

        background: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        bar: "rgb(var(--color-bar) / <alpha-value>)",

        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          dull: "var(--color-text-dull)"
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
