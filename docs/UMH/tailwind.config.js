/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        'pure-black': '#000000',
        'dark-gray': '#0a0a0a',
        'charcoal': '#141414',
        'deep-green': '#1a3d1a',
        'forest': '#2d5a2d',
        'emerald': '#3d7a3d',
        'bright-green': '#4ade80',
        'off-white': '#f5f5f5',
        'muted': '#a3a3a3',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
