/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slack-purple': '#4A154B',
        'slack-pink': '#E01E5A',
      },
    },
  },
  plugins: [],
} 