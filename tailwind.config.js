/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B60B0',
          50: '#E6F0FA',
          100: '#CCE0F5',
          200: '#99C2EB',
          300: '#66A3E0',
          400: '#3385D6',
          500: '#0B60B0',
          600: '#094E90',
          700: '#073A6B',
          800: '#052747',
          900: '#021324'
        },
        accent: {
          DEFAULT: '#FF7C1F',
          50: '#FFF1E6',
          100: '#FFE3CC',
          200: '#FFC799',
          300: '#FFAB66',
          400: '#FF8F33',
          500: '#FF7C1F',
          600: '#E86C10',
          700: '#B0510B',
          800: '#783607',
          900: '#3F1C04'
        }
      },
      animation: {
        'pulse-once': 'pulse 1s ease-in-out 1'
      }
    },
  },
  plugins: [],
};