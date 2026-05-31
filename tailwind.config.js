/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          50:  '#FAFAF9', 100: '#F5F5F4', 200: '#E7E5E4', 300: '#D6D3D1',
          400: '#A8A29E', 500: '#78716C', 600: '#57534E', 700: '#44403C',
          800: '#292524', 900: '#1C1917', 950: '#0C0A09',
        },
        gold: {
          300: '#FDE68A', 400: '#FBBF24', 500: '#EAB308',
          600: '#CA8A04', 700: '#A16207',
        },
      },
      fontFamily: {
        cormorant:  ['var(--font-cormorant)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      transitionDuration: { '400': '400ms' },
      animation: {
        'shimmer':   'shimmer 5s linear infinite',
        'spin-slow': 'spin 22s linear infinite',
        'bounce-sm': 'bounceSm 1.4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '0% center' }, '100%': { backgroundPosition: '200% center' } },
        bounceSm: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
      },
    },
  },
  plugins: [],
}
