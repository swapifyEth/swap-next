import "../styles/globals.css";
import "../styles/spinner.css";

import Footer from "../components/Footer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);
    return <Component {...pageProps} />;
}

export default MyApp;
