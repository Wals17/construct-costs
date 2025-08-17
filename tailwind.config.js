/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5a4",
          50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",
          600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63"
        }
      },
      boxShadow: { card: "0 8px 20px rgba(0,0,0,0.08)" }
    },
  },
  plugins: [],
}