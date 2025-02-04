/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,svelte}'],
  theme: {
    extend: {
      colors: {
        light: '#f6f4f1',
        dark: {
          500: '#202020',
          600: '#2a2a2a',
          800: '#404040',
        },
        red: '#f14e3c'
      },
      fontSize: {
        '2xs': '.5rem',
        '3xs': '.375rem',
        '4xs': '.25rem',
      }
    },
  },
  plugins: [],
}

