/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#060608',
        cream: '#F0EDE6',
        gold: '#C9A84C',
        muted: '#3A3835',
        surface: '#0F0F12',
        accent: '#00B98E',
        'accent-light': '#00D9A6',
        'accent-dark': '#009F7A',
        charcoal: '#0D0D0D',
        'soft-dark': '#1A1A1A',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
