import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slack-purple': '#611f69',
        'slack-pink': '#e01e5a',
        'slack-black': '#1a1d21',
        'slack-gray': '#b5b5b5',
        'slack-white': '#ffffff',
        'slack-lightGray': '#f8f8f8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config 