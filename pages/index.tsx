import Link from 'next/link';
import {toast} from 'react-hot-toast';
import Loader from '../components/Loader';

export default function Home() {
    return (
        <div>
            <Loader show />

            <Link prefetch={false} href={{
                pathname: '/[username]',
                query: { username: 'javiergomezve'}
            }}>
                <a>Javier's profile</a>
            </Link>

            <button onClick={() => toast.success('Hello toast!')}>
                Toast me
            </button>
        </div>
    );
}
