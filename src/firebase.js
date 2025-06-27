import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVWeHOPZmiafX-rSF0IidTTS8gF3HNfqM",
  authDomain: "quest-logs.firebaseapp.com",
  projectId: "quest-logs",
  storageBucket: "quest-logs.firebasestorage.app",
  messagingSenderId: "1003983787311",
  appId: "1:1003983787311:web:5fd7b177d289e392377dda"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);