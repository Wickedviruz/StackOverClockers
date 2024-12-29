/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Lägg till denna rad för att aktivera class-baserad dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5', // Indigo-600
          DEFAULT: '#4338CA', // Indigo-600
          dark: '#3730A3', // Indigo-700
        },
        secondary: {
          light: '#EC4899', // Pink-500
          DEFAULT: '#DB2777', // Pink-600
          dark: '#BE185D', // Pink-700
        },
      },
    },
  },
  plugins: [],
}
