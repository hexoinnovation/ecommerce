/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#fea928",
        secondary: "#ed8900",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
      spacing: {
        '40': '7.5rem',  // Custom spacing for ml-30
      },
      fontFamily: {
        sans: ['Verdana', 'Geneva', 'Tahoma', 'sans-serif'], // Set Verdana as the primary sans-serif font
      },
      animation: {
        drift: 'driftEffect 4s linear infinite',
        dr: 'dr 2s infinite',
        neon: 'neon 1.5s ease-in-out infinite',
      },
      keyframes: {
        driftEffect: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(50px)' },
          '100%': { transform: 'translateX(0)' },
        },
        neon: {
          '0%, 100%': { 
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff0080, 0 0 20px #ff0080, 0 0 25px #ff0080, 0 0 30px #ff0080' 
          },
          '50%': {
            textShadow: '0 0 10px #fff, 0 0 20px #ff0080, 0 0 30px #ff0080, 0 0 40px #ff0080, 0 0 50px #ff0080, 0 0 60px #ff0080',
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
  plugins: [],
};
