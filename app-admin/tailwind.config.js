/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0b1020',
          800: '#101a33'
        },
        accent: '#2b6cb0'
      }
    }
  },
  plugins: []
};
