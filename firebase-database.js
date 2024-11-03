const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
require('dotenv').config(); 

const firebaseConfig = {
    apiKey: process.env.FIREBASEAPIKEY,
    authDomain: "all-in-tracker.firebaseapp.com",
    projectId: "all-in-tracker",
    storageBucket: "all-in-tracker.appspot.com",
    messagingSenderId: "11345766684",
    appId: "1:11345766684:web:5241d2637a55eaf20c72d9",
    measurementId: "G-9ZXF5QTS16"
};

const firebaseApp = initializeApp(firebaseConfig);
const fdb = getFirestore(firebaseApp);

module.exports = fdb;