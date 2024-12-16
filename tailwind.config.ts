/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#a2aaf5', 
          100: '#747ff0', 
          200: '#4655eb', 
          300: '#192be5', 
          400: '#1423b7', 
          500: '#0f1a89', 
          600: '#0a115b', 
          700: '#05092d', 
          800: '#05092d', 
          900: '#05092d', 
          A100: '#9fa3d0', 
          A200: '#6f76b8', 
          A400: '#3f48a1', 
          A700: '#0c156e'
 
        },
        accent : {
          50: '#fbe9e7',
          100: '#ffccbc',
          200: '#ffab91',
          300: '#ff8a65',
          400: '#ff7043',
          500: '#ff5722',
          600: '#f4511e',
          700: '#e64a19',
          800: '#d84315',
          900: '#bf360c',
          A100: '#ff9e80',
          A200: '#ff6e40',
          A400: '#ff3d00',
          A700: '#dd2c00',
        }
      }
    },
  },
  plugins: [],
}