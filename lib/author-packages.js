export default (props) => {
  if (!props.packages || !props.packages.length) { return <p>Nothing here.</p> }
  const x = props.packages.map(({ id, description, date, doc }) => {
    const keywords = doc && doc.keywords && doc.keywords
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
    othersDependencies2 = othersDependencies2 ? <dd className='tags'>{othersDependencies2}</dd> : ''

    const ownDependencies = []
    let ownDependencies2
    if (doc && doc.ownDependencies && Object.keys(doc.ownDependencies).length) {
      for (r in doc.ownDependencies) {
        ownDependencies.push(r)
      }
      ownDependencies2 = ownDependencies
        .map((y) => <span key={y} className='tag is-danger'>{y}</span>)
    }
    ownDependencies2 = ownDependencies2 ? <dd className='tags'>{ownDependencies2}</dd> : ''

    return <dl className='box' key={id}>
      <dt className='title is-4'>{id}</dt>
      <dd className='subtitle is-6'>{new Date(date).toString()}</dd>
      <dd>{description}</dd>
      {keywords2}
      {othersDependencies2}
      {ownDependencies2}
    </dl>
  })
  const loading = props.processing ? <p><img style={{marginRight: '1em'}} src='/static/imgs/loading.gif' />Processing...</p> : ''
  return <div>
    <h2 className='title'>Author {props.author}</h2>
    <h3 className='subtitle'>{props.packages.length} modules</h3>
    {loading}
    {x}
  </div>
}
