/* global URL */

// TODO: add own cors-anywhere instance running on now
import proxies from '../lib/corsed-proxies.json'

const corsed = typeof URL === 'undefined'
  ? () => null
  : (() => {
    let nProxy

    const nextProxy = () => {
      if (!nProxy) { nProxy = 0 }
      const np = nProxy
      const ret = proxies[np]
      if (++nProxy === proxies.length) { nProxy = 0 }
      return ret
    }

    return () => {
      const [proxy, fix] = nextProxy()
      return fix
        ? new URL(`${proxy}https://skimdb.npmjs.com/registry/_design/app/_view/browseAuthors`)
        : new URL('skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors', proxy)
    }
  })()

export default corsed
