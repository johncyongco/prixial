/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#FCFCFC',
        foreground: '#111111',
        muted: '#F2F2EE',
        card: '#FFFFFF',
        border: '#E6E6E2',
        secondary: '#707070',
        accent: '#111111',
        success: '#28C76F',
        warning: '#FFB547',
      },
      borderRadius: {
        xl: '20px',
        '2xl': '28px',
        '3xl': '40px',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(0,0,0,.04)',
        card: '0 15px 60px rgba(0,0,0,.05)',
        phone: '0 40px 120px rgba(0,0,0,.12)',
      },
      fontFamily: {
        heading: ['Geist', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      maxWidth: {
        content: '1280px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.22,.61,.36,1)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseSlow: 'pulseSlow 5s infinite',
        fadeUp: 'fadeUp .8s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '.4' },
          '50%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
