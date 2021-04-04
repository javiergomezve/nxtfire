import {Toaster} from 'react-hot-toast';

import '../styles/globals.css';
import {UserContext} from '../lib/context';
import Navbar from '../components/Navbar';
import {useUserData} from "../lib/hooks";

function MyApp({ Component, pageProps }) {
   const userdata = useUserData();

    return (
        <UserContext.Provider value={userdata}>
            <Navbar />
            <Component {...pageProps} />
            <Toaster />
        </UserContext.Provider>
    );
}

export default MyApp;
