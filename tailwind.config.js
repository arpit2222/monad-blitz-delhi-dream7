/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        main: 'hsl(var(--main))',
        'main-foreground': 'hsl(var(--main-foreground))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        d7: {
          base: '#050A1A',
          card: '#0A1628',
          'card-hover': '#0F1E38',
          border: '#1A2E50',
          primary: '#19388A',
          'primary-light': '#2756D6',
          yellow: '#F9C80E',
          red: '#D71921',
          green: '#00C853',
          cyan: '#00B4D8',
          'text-primary': '#FFFFFF',
          'text-secondary': '#8BA3CC',
          'text-muted': '#4A6080',
        },
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      animation: {
        'live-pulse': 'livePulse 2s ease-in-out infinite',
        'cricket-spin': 'cricketSpin 3s ease-in-out infinite',
        'slide-in': 'slideInRight 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 200, 83, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0, 200, 83, 0)' },
        },
        cricketSpin: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
