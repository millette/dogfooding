import '../styles.scss'
import NameForm from '../components/name-form'

let author
if (typeof window === 'object') { author = new URLSearchParams(window.location.search).get('author') }

export default () => <div>
  <section className='hero is-primary'>
    <div className='hero-body'>
      <div className='container'>
        <h1 className='title'>Dog Fooding</h1>
      </div>
    </div>
  </section>
  <NameForm author={author} />
</div>
