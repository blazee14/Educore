// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <-- esto es lo que probablemente falta
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D6CDF',
        'primary-dark': '#1A3F8B',
      },
    },
  },
  plugins: [],
};