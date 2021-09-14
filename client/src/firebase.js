import firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/analytics";

const firebaseConfig = process.env.firebaseConfig;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();