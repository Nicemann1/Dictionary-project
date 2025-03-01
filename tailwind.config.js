/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-soft': 'pulse-soft 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px) scale(0.98)',
            filter: 'blur(4px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        'xl': '20px',
      },
      letterSpacing: {
        'tighter': '-0.04em',
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.02em',
        'wider': '0.04em',
      },
    },
  },
  plugins: [],
};
