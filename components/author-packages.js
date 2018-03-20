export default (props) => {
  if (!props.packages || !props.packages.length) {
    return <div className='message'>
      <p className='message-body'>Nothing here.</p>
    </div>
  }
  let nOwnDeps = 0
  let nOthersDeps = 0

  const onlyUnique = (value, index, self) => self.indexOf(value) === index

  const x = props.packages.map(({ id, description, date, doc }) => {
    const keywords = doc && doc.keywords && doc.keywords
      .filter(onlyUnique)
      .map((y) => <span key={y} className='tag is-primary is-rounded'>{y}</span>)
    const keywords2 = keywords ? <dd className='tags'>{keywords}</dd> : ''

    const othersDependencies = []
    let othersDependencies2
    let r
    if (doc && doc.othersDependencies && Object.keys(doc.othersDependencies).length) {
      for (r in doc.othersDependencies) {
        othersDependencies.push(r)
      }
      othersDependencies2 = othersDependencies
        .map((y) => <span key={y} className='tag is-info'>{y}</span>)
    }
    nOthersDeps += othersDependencies.length
    othersDependencies2 = othersDependencies2 ? <dd className='tags'>{othersDependencies2}</dd> : ''

    const ownDependencies = []
    let ownDependencies2
    if (doc && doc.ownDependencies && Object.keys(doc.ownDependencies).length) {
      for (r in doc.ownDependencies) {
        ownDependencies.push(r)
      }
      ownDependencies2 = ownDependencies
        .map((y) => <a href={`#${y}`} key={y} className='tag is-danger'>{y}</a>)
    }
    nOwnDeps += ownDependencies.length
    ownDependencies2 = ownDependencies2 ? <dd className='tags'>{ownDependencies2}</dd> : ''

    return <dl id={id} className='box' key={id}>
      <dt className='title is-4'>{id}</dt>
      <dd className='subtitle is-6'>{new Date(date).toString()}</dd>
      <dd>{description}</dd>
      {keywords2}
      {othersDependencies2}
      {ownDependencies2}
    </dl>
  })

  const nTotalDeps = nOthersDeps + nOwnDeps

  let loading = null
  if (props.processing) {
    loading = <div className='message is-warning'>
      <p className='message-body'>
        <img style={{marginRight: '1em'}} src='/static/imgs/loading.gif' />
        Processing...
      </p>
    </div>
  }

  let stats = null
  if (!props.processing && nTotalDeps && nOwnDeps) {
    stats = <div className='message is-info'>
      <p className='message-body'>
        {Math.round(100 * nOwnDeps / nTotalDeps)} % of dependencies are by the author.
      </p>
    </div>
  }

  return <div>
    <h2 className='title'>Author {props.author}</h2>
    <h3 className='subtitle'>{props.packages.length} packages</h3>
    {loading}
    {stats}
    {x}
  </div>
}
