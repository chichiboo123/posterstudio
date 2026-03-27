/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        gold: {
          100: '#FFF9E6',
          300: '#FFE5B3',
          500: '#FFB800',
          600: '#E6A600',
        }
      }
    },
  },
  plugins: [],
}

