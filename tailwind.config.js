module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}', 
    './index.html',
    './src/App.vue',
    './src/components/test.vue',
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderWidth: ['group-hover'], 
    },
  },
  plugins: [],
}
