import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Config de firebase
const firebaseConfig = {
    apiKey: "AIzaSyCErRXnzy03uPnnY8lLbxLnjUJ01XdMYVY",
    authDomain: "pwa-ucr.firebaseapp.com",
    projectId: "pwa-ucr",
    storageBucket: "pwa-ucr.firebasestorage.app",
    messagingSenderId: "170802675846",
    appId: "1:170802675846:web:af518f4bf77bbb59b8d107",
    measurementId: "G-2FKKNLV9HH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
};