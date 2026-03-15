// exact values taken from brandbook: https://www.canva.com/design/DAG2lmWCloU/_7yJXSMJ5ExP9NkFsRjgdQ/edit?utm_content=DAG2lmWCloU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
// webdev onboarding slides: https://www.canva.com/design/DAG-qFFEGTc/ibGCOyZs_Q-9_R4ufsfqxw/edit?utm_content=DAG-qFFEGTc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CORE BRAND COLORS
        'tedx-red': '#eb0028',
        'tedx-black': '#000000',
        'tedx-white': '#ffffff',
        'tedx-gray': '#f5f5f5',
        'tedx-dark': '#1a1a1a',
        
        // UI STATES (Standard across all apps)
        destructive: '#dc2626', // Error red (different from brand red!)
        success: '#16a34a',     // Success green
        warning: '#f59e0b',     // Warning yellow
        muted: '#6b7280',       // Muted text
        border: '#e5e7eb',      // Border gray
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        bold: ['Helvetica Bold', 'Helvetica Neue Bold', 'Arial Bold', 'sans-serif'],
        display: ['var(--font-league-gothic)', 'Impact', 'sans-serif'],
      },
      fontSize: {
        'heading': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 24pt ≈ 1.5rem
        'subheading': ['1rem', { lineHeight: '1.3', fontWeight: '400' }], // 16pt ≈ 1rem
        'body': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }], // 12pt ≈ 0.875rem
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 11pt ≈ 0.75rem
      },
      lineHeight: {
        'wide': '1.8',
      },
    },
  },
  plugins: [],
}
export default config