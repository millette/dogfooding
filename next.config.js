// next.config.js
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  exportPathMap: () => ({ '/': { page: '/' } }),
  sassLoaderOptions: {
    includePaths: [
      'node_modules/bulmaswatch',
      'node_modules/bulma'
    ]
  }
})
