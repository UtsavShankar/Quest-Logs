const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDVWeHOPZmiafX-rSF0IidTTS8gF3HNfqM",
  authDomain: "quest-logs.firebaseapp.com",
  projectId: "quest-logs",
  storageBucket: "quest-logs.firebasestorage.app",
  messagingSenderId: "1003983787311",
  appId: "1:1003983787311:web:5fd7b177d289e392377dda"
};

const app = initializeApp(firebaseConfig);

module.exports = {
  auth: getAuth(app),
  db: getFirestore(app)
};
