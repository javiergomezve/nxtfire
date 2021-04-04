import React, {useContext, useState} from 'react';
import {useCollection} from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/router';

import styles from '../../styles/Home.module.css';
import {auth, firestore, serverTimestamp} from '../../lib/firebase';
import {UserContext} from '../../lib/context';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';

const IndexPage = () => {

    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
};

export default IndexPage;

const PostList = () => {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
};

const CreateNewPost = () => {
    const router = useRouter();
    const {username} = useContext(UserContext);

    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uid = auth.currentUser.uid;
        const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);

        const data = {
            title, slug, uid, username, published: false, content: '# hello world!', heartCount: 0,
            createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        };

        await ref.set(data);

        toast.success('Post created!');

        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="My awesome article!"
                className={styles.input}
            />

            <p>
                <strong>Slug:</strong> {slug}
            </p>

            <button className="btn-green" type="submit" disabled={!isValid}>
                Create new post
            </button>
        </form>
    );
};
