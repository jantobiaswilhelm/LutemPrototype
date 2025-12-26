/**
 * Firebase Configuration
 * These are public API keys - safe to expose in client code
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPiWoSxr-e9OO76xY7CRxNNe3CeGLc0hc",
  authDomain: "lutem-68f3a.firebaseapp.com",
  projectId: "lutem-68f3a",
  storageBucket: "lutem-68f3a.firebasestorage.app",
  messagingSenderId: "980654641414",
  appId: "1:980654641414:web:5efe326e3d57c88294ce87",
  measurementId: "G-0TXFY5MV82"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
