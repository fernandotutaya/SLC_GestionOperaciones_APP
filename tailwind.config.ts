/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('tailwindcss-primeui')
    ],
    darkMode: 'class'
  };