import React from 'react';

import {getUserWithUsername, postToJSON} from '../../lib/firebase';
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';

export async function getServerSideProps({query}) {
    // url
    const {username} = query;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = userDoc.ref
            .collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5);

        posts = (await postsQuery.get()).docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}

const UserPage = ({user, posts}) => {

    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} admin={false} />
        </main>
    );
};

export default UserPage;
