/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pendulum': 'pendulum 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'banner-scroll': 'bannerScroll 20s linear infinite',
        'logo-rotate': 'logoRotate 3s ease-in-out infinite',
      },
      keyframes: {
        pendulum: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
        logoRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bannerScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        asurwears: {
          "primary": "#ffffff",
          "secondary": "#666666",
          "accent": "#333333",
          "neutral": "#1a1a1a",
          "base-100": "#0a0a0a",
          "base-200": "#1a1a1a",
          "base-300": "#2a2a2a",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
} 