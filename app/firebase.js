import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyBU1OTRRfg4LoCC1sWNLiAkkZQ-NjJjiBw",
    authDomain: "flashcard-e2eea.firebaseapp.com",
    projectId: "flashcard-e2eea",
    storageBucket: "flashcard-e2eea.appspot.com",
    messagingSenderId: "930257960102",
    appId: "1:930257960102:web:54aa0ab011cdcf80614867",
    measurementId: "G-Q44ZDLN2LG"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;