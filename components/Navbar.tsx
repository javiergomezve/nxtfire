import Link from 'next/link';

const Navbar = () => {
    const {user, username} = {user: null, username: null};

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">NXT</button>
                    </Link>
                </li>

                {username && (
                    <>
                        <li className="push-left">
                            <Link href={'/admin'}>
                                <button className="btn-blue">Write a post</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} alt={username} />
                            </Link>
                        </li>
                    </>
                )}

                {!username && (
                    <li>
                        <Link href={'/enter'}>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
