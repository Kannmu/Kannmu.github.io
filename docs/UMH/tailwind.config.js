/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        'pure-black': '#0A0A0F',
        'dark-gray': '#0f0f15',
        'charcoal': '#1a1a24',
        'deep-green': '#1a3d1a',
        'forest': '#2d5a2d',
        'emerald': '#3d7a3d',
        'bright-green': '#4ade80',
        'off-white': '#E5E5E5',
        'muted': '#D4D4D8',
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
