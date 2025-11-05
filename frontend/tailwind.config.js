/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f7b56d',
          400: '#f38b32',
          500: '#f0700a',
          600: '#e15405',
          700: '#ba3d08',
          800: '#94310e',
          900: '#78290f',
        },
        secondary: {
          50: '#f0f9f4',
          100: '#dcf0e3',
          200: '#bae0cb',
          300: '#8bc9ac',
          400: '#56ab85',
          500: '#338f68',
          600: '#247253',
          700: '#1d5b43',
          800: '#194937',
          900: '#153c2e',
        },
        accent: {
          50: '#fef6ee',
          100: '#fdeacb',
          200: '#fbd397',
          300: '#f9b558',
          400: '#f79527',
          500: '#f1710d',
          600: '#d55208',
          700: '#b1390a',
          800: '#8f2d0f',
          900: '#742710',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f4f4f2',
          200: '#e8e7e3',
          300: '#d3d2cc',
          400: '#a8a79e',
          500: '#87867b',
          600: '#6d6c62',
          700: '#5a5950',
          800: '#4a4944',
          900: '#3d3c38',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08), 0 6px 12px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #fdecd3 0%, #f9b558 100%)',
        'gradient-cool': 'linear-gradient(135deg, #dcf0e3 0%, #56ab85 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
