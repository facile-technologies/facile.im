/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F2E86',
          light: '#6a4ba3', // Lighter shade based on base
          dark: '#3a2168',  // Darker shade
        },
        background: {
          light: '#ffffff',
          dark: '#000000', // Black as requested "black and white"
        },
        surface: {
           light: '#f9fafb',
           dark: '#1a1a1a' 
        },
        text: {
            primary: {
               light: '#000000',
               dark: '#ffffff'
            },
            secondary: {
                light: '#4b5563',
                dark: '#9ca3af'
            }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
