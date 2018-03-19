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
    this.state = { value: '', packages: false, author: '' }
    this.nameid = `nameform-nameid-${++cnt}`
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    const value = event.target.value.trim()
    this.setState({ value })
  }

  handleSubmit (event) {
    event.preventDefault()
    console.log('A name was submitted: ' + this.state.value)
    if (!this.state.value) { return this.setState({ packages: false }) }
    const u = new URL('https://cors-anywhere.herokuapp.com/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors')
    // https://cors-anywhere.herokuapp.com/skimdb.npmjs.com:443/registry/_design/app/_view/browseAuthors
    // https://skimdb.npmjs.com/registry/_design/app/_view/browseAuthors
    u.search = new URLSearchParams({
      reduce: false,
      // include_docs: true,
      startkey: JSON.stringify([this.state.value]),
      endkey: JSON.stringify([this.state.value, '\ufff0'])
    })

    window.fetch(u, { mode: 'cors' })
      .then((res) => res.ok && res.json())
      .then((json) => {
        const packages = json && json.rows && json.rows.length && json.rows
          .map(mapper)
          .sort(sorter)

        this.setState({
          processing: Boolean(packages),
          author: this.state.value,
          packages
        })
      })
      .then(() => {
        if (!this.state.packages) { return false }
        u.search = new URLSearchParams({
          reduce: false,
          include_docs: true,
          startkey: JSON.stringify([this.state.author]),
          endkey: JSON.stringify([this.state.author, '\ufff0'])
        })
        return window.fetch(u, { mode: 'cors' })
      })
      .then((res) => res && res.ok && res.json())
      .then((json) => {
        this.setState({
          processing: false,
          packages: json.rows
            .map(mapper)
            .sort(sorter)
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
                    <input id={this.nameid} type='text' value={this.state.value} onChange={this.handleChange} />
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
