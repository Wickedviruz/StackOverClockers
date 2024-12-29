/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navbar: '#0A0A0A',
        footer: '#111111',
        highlight: '#FAFAFA',
        defaultText: '#888888',
        gridLine: '#4B5563', // Anpassad färg för gridlinjer
      },
      keyframes: {
        rotateGrid: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '50%': { transform: 'rotateX(10deg) rotateY(10deg)' },
          '100%': { transform: 'rotateX(0deg) rotateY(0deg)' },
        },
        moveGrid: {
          '0%': { transform: 'translateZ(0px)' },
          '50%': { transform: 'translateZ(20px)' },
          '100%': { transform: 'translateZ(0px)' },
        },
      },
      animation: {
        rotateGrid: 'rotateGrid 30s ease-in-out infinite',
        moveGrid: 'moveGrid 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
