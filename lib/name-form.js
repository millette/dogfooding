/* global URL, URLSearchParams */

import { Component } from 'react'
import AuthorPackages from './author-packages'

let cnt = 0

const mapper = (x) => ({
  doc: x.doc,
  id: x.id,
  description: x.key[2],
  date: Date.parse(x.key[3])
})

const sorter = (a, b) => {
  const ca = a.date
  const cb = b.date
  if (ca > cb) { return -1 }
  if (ca < cb) { return 1 }
  return 0
}

class NameForm extends Component {
  constructor (props) {
    super(props)
    // this.state = { value: '', packages: false, author: '' }
    this.state = { packages: false, author: '' }
    this.nameid = `nameform-nameid-${++cnt}`
    // this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /*
  handleChange (event) {
    const value = event.target.value.trim()
    this.setState({ value })
  }
  */

  handleSubmit (event) {
    event.preventDefault()
    // console.log('A name was submitted: ' + this.state.value)
    // if (!this.state.value) { return this.setState({ packages: false }) }
    console.log('A name was submitted: ' + this.input.value)
    if (!this.input.value) { return this.setState({ packages: false }) }
    const u = new URL('http://localhost:8080/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors')
    // const u = new URL('https://cors-anywhere.herokuapp.com/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors')
    // https://cors-anywhere.herokuapp.com/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors
    // https://skimdb.npmjs.com/registry/_design/app/_view/browseAuthors
    u.search = new URLSearchParams({
      reduce: false,
      // include_docs: true,
      // startkey: JSON.stringify([this.state.value]),
      // endkey: JSON.stringify([this.state.value, '\ufff0'])
      startkey: JSON.stringify([this.input.value]),
      endkey: JSON.stringify([this.input.value, '\ufff0'])
    })

    window.fetch(u, { mode: 'cors' })
      .then((res) => res.ok && res.json())
      .then((json) => {
        const packages = json && json.rows && json.rows.length && json.rows
          .map(mapper)
          .sort(sorter)

        this.setState({
          processing: Boolean(packages),
          // author: this.state.value,
          author: this.input.value,
          packages
        })
        return packages.map((x) => x.id)
      })
      .then((packageIDs) => {
        if (!this.state.packages) { return false }
        u.search = new URLSearchParams({
          reduce: false,
          include_docs: true,
          startkey: JSON.stringify([this.state.author]),
          endkey: JSON.stringify([this.state.author, '\ufff0'])
        })
        return Promise.all([window.fetch(u, { mode: 'cors' }), packageIDs])
      })
      .then(([res, packageIDs]) => Promise.all([res && res.ok && res.json(), packageIDs]))
      .then(([json, packageIDs]) => {
        const packages = json.rows
          .map((row) => {
            if (!row.doc || !row.doc['dist-tags'] || !row.doc['dist-tags'].latest) { return false }
            const latest = row.doc.versions[row.doc['dist-tags'].latest]
            if (Object.keys(latest.dependencies || {}).length) {
              latest.ownDependencies = {}
              latest.othersDependencies = {}
              let r
              for (r in latest.dependencies) {
                if (packageIDs.indexOf(r) === -1) {
                  latest.othersDependencies[r] = latest.dependencies[r]
                } else {
                  latest.ownDependencies[r] = latest.dependencies[r]
                }
              }
            }
            return { ...row, doc: latest }
          })
          .filter(Boolean)
          .map(mapper)
          .sort(sorter)

        this.setState({
          processing: false,
          packages
        })
      })
      .catch(console.error)
  }

  render () {
    return <div>
      <section className='section'>
        <div className='container'>
          <form onSubmit={this.handleSubmit}>
            <div className='field is-horizontal'>
              <div className='field-label'>
                <label htmlFor={this.nameid} className='label'>Username</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <div className='control'>
                    <input id={this.nameid} type='text' ref={(input) => { this.input = input }} />
                  </div>
                  <p className='help'>Enter your <code>npm username</code></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <section className='section'>
        <div className='container'>
          <AuthorPackages processing={this.state.processing} author={this.state.author} packages={this.state.packages} />
        </div>
      </section>
    </div>
  }
}

export default NameForm
