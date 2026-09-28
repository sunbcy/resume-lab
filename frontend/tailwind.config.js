/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        /* A4 纸张宽度断点：小于该宽度时简历退化为单栏 */
        sheet: '794px',
      },
      colors: {
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        tag: 'rgb(var(--tag-rgb) / <alpha-value>)',
      },
      width: {
        a4: '794px',
      },
      minHeight: {
        a4: '942px',
      },
      boxShadow: {
        sheet: '0px 2px 4px 1px rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        sans: ['roboto-regular', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
