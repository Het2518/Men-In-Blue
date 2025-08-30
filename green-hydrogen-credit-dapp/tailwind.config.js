/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hydrogen-teal': '#2DD4BF',
        'hydrogen-blue': '#0891B2',
        'eco-green': '#10B981',
        'producer-green': '#059669',
        'buyer-blue': '#0284C7',
        'cert-purple': '#7C3AED'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bubble': 'bubble 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #2DD4BF' },
          '50%': { boxShadow: '0 0 20px #2DD4BF' }
        },
        bubble: {
          '0%': { transform: 'translateY(100vh) scale(0)' },
          '100%': { transform: 'translateY(-100vh) scale(1)' }
        },
        glow: {
          '0%': { textShadow: '0 0 10px #2DD4BF' },
          '100%': { textShadow: '0 0 20px #2DD4BF, 0 0 30px #2DD4BF' }
        }
      }
    },
  },
  plugins: [],
}
