import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkHLWIO7g7h9eXdudiG4HAzSf4f3hcLgc",
  authDomain: "booking-2405a.firebaseapp.com",
  projectId: "booking-2405a",
  storageBucket: "booking-2405a.firebasestorage.app",
  messagingSenderId: "751437019626",
  appId: "1:751437019626:web:ee2cdc161b40ce76735a93",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
