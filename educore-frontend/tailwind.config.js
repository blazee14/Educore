/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E5FA3',
          dark: '#1B2A41',
        },
      },
    },
  },
  plugins: [],
};
