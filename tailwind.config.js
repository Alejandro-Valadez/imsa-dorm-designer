/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        imsa: {
          blue: '#002B49',
          gold: '#C59B27',
          sky: '#007A87',
          cardinal: '#8B0000',
          sand: '#F7F5F0',
          dark: '#0B131E',
          card: '#162232',
          border: '#22344D'
        }
      }
    },
  },
  plugins: [],
}
