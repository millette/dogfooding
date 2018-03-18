// next.config.js
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  sassLoaderOptions: {
    includePaths: [
      'node_modules/bulmaswatch',
      'node_modules/bulma'
    ]
  }
})
