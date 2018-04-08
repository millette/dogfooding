import '../styles.scss'
import NameForm from '../components/name-form'

let author
if (typeof window === 'object') { author = new window.URLSearchParams(window.location.search).get('author') }

export default () => <div>
  <section className='hero is-primary'>
    <div className='hero-body'>
      <div className='container'>
        <h1 className='title'>Dog Fooding</h1>
      </div>
    </div>
  </section>
  <NameForm author={author} />
  <footer className='footer'>
    <div className='container'>
      <p>&copy; 2018 <a href='http://robin.millette.info'>Robin Millette</a> AGPL-3.0</p>
      <p>Sources sur github:</p>
      <dl>
        <dt>dogfooding (web front-end)</dt>
        <dd>
          <a href='https://github.com/millette/dogfooding'>
            https://github.com/millette/dogfooding
          </a>
        </dd>
        <dt>corsico (proxy cors)</dt>
        <dd>
          <a href='https://github.com/millette/corsico'>
            https://github.com/millette/corsico
          </a>
        </dd>
      </dl>
    </div>
  </footer>
</div>
