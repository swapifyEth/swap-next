import '../styles/globals.css'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
  <>
  <Component {...pageProps} />
  </>
  );
}

export default MyApp
