import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for Fiskestädardagen project
const firebaseConfig = {
  apiKey: "AIzaSyAUQotjmvyRAgaKxet-sm7lfAsA6yROpRc",
  authDomain: "fiskestadardagen.firebaseapp.com",
  projectId: "fiskestadardagen",
  storageBucket: "fiskestadardagen.firebasestorage.app",
  messagingSenderId: "396493618251",
  appId: "1:396493618251:web:a1437fb65e9597a16d61ce"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); 