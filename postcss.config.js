// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }
// const purgecss = require('@fullhuman/postcss-purgecss')({
//   content: [
//     './index.html',
//     './src/components/test.vue',
//     './src/App.vue',
//     './src/main.js',
//     './src/**/*.html',
//     './src/**/*.vue'
//   ],
//   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
// })
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // ...process.env.NODE_ENV === 'production'
    // ? [purgecss]
    // : []
  ]
}
