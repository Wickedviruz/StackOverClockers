// tailwind.config.js
module.exports = {
  darkMode: 'class', // Möjliggör mörkt läge med "class"
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Anpassa efter din filstruktur
  ],
  theme: {
    extend: {
      colors: {
        navbar: '#f9fafb', // Ljus bakgrund för navbar
        'navbar-dark': '#1f2937', // Mörk bakgrund för navbar
      },
    },
  },
  plugins: [],
};
