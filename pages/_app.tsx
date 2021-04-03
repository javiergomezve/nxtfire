import {Toaster} from "react-hot-toast";

import '../styles/globals.css';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
        </>
    );
}

export default MyApp;
