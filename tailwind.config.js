/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.svelte', './src/*.{html,css}'],
  theme: {
    fontSize: {
      sm: '14pt',
      base: '16pt',
      lg: '18pt',
    },
    fontFamily: {
      sans: ['Times New Roman'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
