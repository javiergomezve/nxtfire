import React from "react";
import Link from 'next/link';
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
        </div>
    );
}
