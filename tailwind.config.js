module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['GeneralSans'],
      },
      colors: {
        "swapify-purple": "#8247e5",
        "swapify-gray": "#101418"
      }
    },
  },
  plugins: [],
}