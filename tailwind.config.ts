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
          DEFAULT: '#000008',    // Sehr dunkles Blauschwarz
          secondary: '#00000f',  // Etwas mehr Blau
          tertiary: '#000016',   // Noch etwas mehr Blau, aber immer noch sehr dunkel
        },
        navbar: {
          glass: 'rgba(0, 240, 255, 0.03)',  // Sehr transparentes Türkis
          border: 'rgba(0, 240, 255, 0.1)',  // Etwas sichtbareres Türkis für den Border
        }
      },
      backgroundImage: {
        'gradient-game': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '12px', // Stärkerer Blur-Effekt
      },
      boxShadow: {
        'glass': '0 4px 6px -1px rgba(0, 240, 255, 0.05), 0 2px 4px -1px rgba(0, 240, 255, 0.03)',
      }
    },
  },
  plugins: [],
} satisfies Config;
