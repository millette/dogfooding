/* global URLSearchParams */

import { Component } from 'react'
import AuthorPackages from './author-packages'
import corsed from '../lib/corsed'

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

const ErrorSection = ({ error, form }) => {
  let ret = null
  if (error) {
    ret = <section className='section'>
      <div className='container'>
        <article className='message is-danger'>
          <div className='message-header'>
            <p>Error</p>
            <button className='delete' aria-label='delete' />
          </div>
          <div className='message-body'>
            <p>{error.toString()}</p>
            <button className='button is-primary' onClick={form.handleSubmit.bind(form)}>Try again?</button>
          </div>
        </article>
      </div>
    </section>
  }
  return ret
}

class NameForm extends Component {
  constructor (props) {
    super(props)

    this.state = { packages: false, author: props.author }
    this.nameid = `nameform-nameid-${++cnt}`
    this.handleSubmit = this.handleSubmit.bind(this)
    this.u = corsed()
    if (props.author) {
      this.input = { value: props.author }
      this.handleSubmit()
    }
  }

  handleSubmit (event) {
    if (event) { event.preventDefault() }
    if (!this.input.value) { return this.setState({ error: false, packages: false }) }
    this.u.search = new URLSearchParams({
      reduce: false,
      startkey: JSON.stringify([this.input.value]),
      endkey: JSON.stringify([this.input.value, '\ufff0'])
    })

    window.fetch(this.u, { mode: 'cors' })
      .then((res) => res.ok && res.json())
      .then((json) => {
        const packages = json && json.rows && json.rows.length && json.rows
          .map(mapper)
          .sort(sorter)

        this.setState({
          error: false,
          processing: Boolean(packages),
          author: this.input.value,
          packages
        })
        return packages && packages.map((x) => x.id)
      })
      .then((packageIDs) => {
        if (!this.state.packages) { return [false, []] }
        this.u.search = new URLSearchParams({
          reduce: false,
          include_docs: true,
          startkey: JSON.stringify([this.state.author]),
          endkey: JSON.stringify([this.state.author, '\ufff0'])
        })
        return Promise.all([window.fetch(this.u, { mode: 'cors' }), packageIDs])
      })
      .then(([res, packageIDs]) => Promise.all([res && res.ok && res.json(), packageIDs]))
      .then(([json, packageIDs]) => {
        const packages = json && json.rows
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

        if (!packages) { this.u = corsed() }
        this.setState({
          error: !packages && new Error('No packages found.'),
          processing: false,
          packages
        })
      })
      .catch((error) => {
        this.setState({ error })
        this.u = corsed()
      })
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
                    <input id={this.nameid} type='text' ref={(input) => { this.input = input }} defaultValue={this.props.author} />
                  </div>
                  <p className='help'>Enter your <code>npm username</code></p>
                </div>
                <div className='field'>
                  <div className='control'>
                    <button className='button' type='submit'>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <ErrorSection form={this} error={this.state.error} />
      <section className='section'>
        <div className='container'>
          <AuthorPackages processing={this.state.processing} author={this.state.author} packages={this.state.packages} />
        </div>
      </section>
    </div>
  }
}

export default NameForm
