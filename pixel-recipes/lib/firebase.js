// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'; // For Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // For Cloud Firestore
import { getStorage } from 'firebase/storage'; // For Cloud Storage for Firebase

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5QWEIs_qq5K1MtpJ7oxOvWy1sZde9vIs",
  authDomain: "pixe1-r3cipe.firebaseapp.com",
  projectId: "pixe1-r3cipe",
  storageBucket: "pixe1-r3cipe.firebasestorage.app",
  messagingSenderId: "388581358353",
  appId: "1:388581358353:web:b5c831c7dee56f7361eab0",
  measurementId: "G-34RNXVB758"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export default app
export { app, auth, db, storage };