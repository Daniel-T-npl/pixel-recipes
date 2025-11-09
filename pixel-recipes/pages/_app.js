import '../styles/globals.css';
import MouseGlow from '../components/MouseGlow'; // Import it

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MouseGlow />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;