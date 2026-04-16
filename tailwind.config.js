/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#3b82f6',
        'blue-secondary': '#2563eb',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        'chat': '768px',
      },
    },
  },
  plugins: [],
}
