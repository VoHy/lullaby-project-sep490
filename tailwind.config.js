/* eslint-disable @next/next/no-page-custom-font */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      colors: {
        'soft-mint-green':'#C2F5E9',
        'warm-white': '#F8F9FA',
        'mint-green': '#aed9a7',
        'sky-blue': '#B3E5FC',
        'charcoal': '#333333',	
        'blue-pink':'#FFD9E6',		
      },
    }
  },
  plugins: [],
}
  