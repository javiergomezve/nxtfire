import {useCallback, useContext, useEffect, useState} from 'react';
import debounce from 'lodash.debounce';

import {auth, firestore, googleAuthProvider} from '../lib/firebase';
import {UserContext} from '../lib/context';

const EnterPage = (props) => {
    const {user, username} = useContext(UserContext);

    return (
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
        </main>
    );
};

export default EnterPage;

const SignInButton = () => {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} alt="Sign in with Google"/> Sign in with Google
        </button>
    );
};

const SignOutButton = () => {
    return (
        <button onClick={() => auth.signOut()}>
            Sign out
        </button>
    );
};

const UsernameForm = () => {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const {user, username} = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
        batch.set(usernameDoc, {uid: user.uid});

        await batch.commit();
    };

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Wrap in useCallback in order to debounce between state changes
    // Wait for the user stop typing for 500 in order to launch query
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const {exists} = await ref.get();
                console.log('Read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500)
    , []);

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text" name="username" placeholder="username"
                        value={formValue} onChange={onChange}
                    />

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

                    <button className="btn-green" type="submit" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue} <br/>
                        Loading: {loading.toString()} <br/>
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
};

const UsernameMessage = ({username, isValid, loading}) => {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-successor">{username} is available!</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>
    } else {
        return <p />;
    }
};
