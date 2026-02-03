/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5', // Indigo-600 (Main)
          DEFAULT: '#4F46E5', 
          dark: '#3730A3',  // Indigo-800
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue-500
        },
        accent: {
          DEFAULT: '#22D3EE', // Cyan-400
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC', // Slate-50
        },
        text: {
          primary: '#0F172A', // Slate-900
          muted: '#64748B',   // Slate-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
