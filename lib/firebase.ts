import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_REACT_APP_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export const getUserWithUsername = async (username) => {
    const usersRef = firestore.collection('users');
    const query = usersRef.where('username', '==', username).limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export const postToJSON = (doc) => {
    const data = doc.data();

    return {
        ...data,
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
    };
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

export const increment = firebase.firestore.FieldValue.increment;
