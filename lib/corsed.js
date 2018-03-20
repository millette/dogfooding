/* global URL */

import proxies from '../lib/corsed-proxies.json'

const corsed = typeof URL === 'undefined' ? () => null : (() => {
  let nProxy

  const nextProxy = () => {
    if (!nProxy) { nProxy = 0 }
    const ret = proxies[nProxy]
    if (++nProxy === proxies.length) { nProxy = 0 }
    return ret
  }

  return () => new URL('/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors', nextProxy())
})()

export default corsed
