import { Fragment } from 'react'

export default (props) => {
  if (!props.packages || !props.packages.length) { return <p>Nothing here.</p> }
  const x = props.packages.map(({ id, description, date, doc }) => {
    const keywords = doc && doc.keywords && doc.keywords
      .map((y) => <span className='tag is-info is-rounded'>{y}</span>)
    return <Fragment key={id}>
      <dt className='title is-4'>{id}</dt>
      <dd className='subtitle is-6'>{new Date(date).toString()}</dd>
      <dd>{description}</dd>
      <dd className='tags'>{keywords}</dd>
    </Fragment>
  })
  const loading = props.processing ? <p><img style={{marginRight: '1em'}} src='/static/imgs/loading.gif' />Processing...</p> : ''
  return <div>
    <h2 className='title'>Author {props.author}</h2>
    <h3 className='subtitle'>{props.packages.length} modules</h3>
    {loading}
    <dl>{x}</dl>
  </div>
}
