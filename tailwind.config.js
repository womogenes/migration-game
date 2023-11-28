/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.svelte', './src/*.{html,css}'],
  theme: {
    fontSize: {
      base: '16pt',
      lg: '17pt',
    },
    fontFamily: {
      sans: ['Times New Roman'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
