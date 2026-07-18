/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Paleta Vision Code — Negro + Rojo
          red: '#E8001C',
          'red-light': '#FF1A2E',
          'red-dark': '#B8000E',
          'red-glow': 'rgba(232, 0, 28, 0.15)',
          black: '#0a0a0a',
          'dark': '#111111',
          'gray': '#1A1A1A',
          'gray-light': '#2A2A2A',
          'gray-mid': '#404040',
          white: '#FFFFFF',
          'off-white': '#F5F5F5',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Impact', 'sans-serif'],
        body: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'draw-line': 'drawLine 1.5s ease forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(232, 0, 28, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(232, 0, 28, 0.6)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
  },
  plugins: [],
}
