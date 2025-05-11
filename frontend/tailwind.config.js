/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        blue: {
          50: '#f0f5ff',
          100: '#e1ebfe',
          200: '#c3d8fd',
          300: '#a4c1fc',
          400: '#86a8f9',
          500: '#638df7',
          600: '#4870f6',
          700: '#2d4ce5',
          800: '#1e3a8a',
          900: '#172554',
        },
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 5px 15px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}