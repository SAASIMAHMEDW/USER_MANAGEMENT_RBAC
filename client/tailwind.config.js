/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velvet: {
          black: '#000000',
          DEFAULT: '#000000',
        },
        showroom: {
          white: '#ffffff',
          DEFAULT: '#ffffff',
        },
        silver: {
          mist: '#999999',
          DEFAULT: '#999999',
        },
      },
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        body: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['18rem', { lineHeight: '1', letterSpacing: '0' }],
        'display': ['3.75rem', { lineHeight: '1', letterSpacing: '1.4px' }],
        'section': ['2.25rem', { lineHeight: '1.11', letterSpacing: '0' }],
        'lead': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'compact': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0' }],
        'ui': ['0.875rem', { lineHeight: '1.43', letterSpacing: '1.4px' }],
        'button': ['0.875rem', { lineHeight: '1.43', letterSpacing: '1.4px' }],
        'button-sm': ['0.75rem', { lineHeight: '1.33', letterSpacing: '1.2px' }],
        'caption': ['0.875rem', { lineHeight: '1.43', letterSpacing: '1.4px' }],
        'micro': ['0.75rem', { lineHeight: '1.33', letterSpacing: '1.2px' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'pill': '9999px',
        'sm': '6px',
      },
      maxWidth: {
        'bugatti': '1720px',
      },
    },
  },
  plugins: [],
}
