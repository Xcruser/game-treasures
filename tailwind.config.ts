import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
          light: '#60A5FA',   // blue-400
        },
        secondary: {
          DEFAULT: '#1E293B', // slate-800
          dark: '#0F172A',    // slate-900
          light: '#334155',   // slate-700
        },
        background: {
          DEFAULT: '#0B1120',    // Sehr dunkles Blauschwarz
          secondary: '#1A2642',  // Etwas mehr Blau
        },
        navbar: {
          glass: 'rgba(0, 240, 255, 0.03)',  // Sehr transparentes Türkis
          border: 'rgba(0, 240, 255, 0.1)',  // Etwas sichtbareres Türkis für den Border
        }
      },
      backgroundImage: {
        'gradient-game': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'grid-pattern': `
          linear-gradient(to right, rgba(0, 149, 255, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 149, 255, 0.15) 1px, transparent 1px),
          radial-gradient(rgba(0, 149, 255, 0.1) 1px, transparent 1px)
        `,
        'radial-gradient': 'radial-gradient(circle at center, rgba(26, 38, 66, 0.8) 0%, rgba(11, 17, 32, 0.8) 100%)',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '8px', // Stärkerer Blur-Effekt
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 240, 255, 0.05), 0 2px 4px -1px rgba(0, 240, 255, 0.03)',
      },
      backgroundSize: {
        'grid': '40px 40px, 40px 40px, 4px 4px',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        float: {
          '0%': {
            transform: 'translateY(100vh) rotate(0deg)',
            opacity: '0.05'
          },
          '50%': {
            opacity: '0.08',
            transform: 'translateY(50vh) rotate(180deg)'
          },
          '100%': {
            transform: 'translateY(-100px) rotate(360deg)',
            opacity: '0.05'
          }
        },
        'float-diagonal': {
          '0%': {
            transform: 'translate(-50%, -50%) translate(-20px, -20px) rotate(0deg)',
            opacity: '0.15'
          },
          '50%': {
            transform: 'translate(-50%, -50%) translate(20px, 20px) rotate(180deg)',
            opacity: '0.2'
          },
          '100%': {
            transform: 'translate(-50%, -50%) translate(-20px, -20px) rotate(360deg)',
            opacity: '0.15'
          }
        },
        'float-smooth': {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) translate(0, 0) rotate(0deg)',
          },
          '25%': {
            transform: 'translate(-50%, -50%) translate(10px, -10px) rotate(90deg)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) translate(0, 0) rotate(180deg)',
          },
          '75%': {
            transform: 'translate(-50%, -50%) translate(-10px, 10px) rotate(270deg)',
          }
        }
      },
      animation: {
        gradient: 'gradient 8s ease infinite',
        float: 'float 30s linear infinite',
        'float-diagonal': 'float-diagonal 15s ease-in-out infinite',
        'float-smooth': 'float-smooth 20s infinite ease-in-out'
      }
    },
  },
  plugins: [],
} satisfies Config;
