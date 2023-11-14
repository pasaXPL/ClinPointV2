/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    './src/**/**/*.{html,ts}'
  ],
  theme: {
    extend: {},
    colors: {
      'alili': '#179182'
    }
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")]
}
