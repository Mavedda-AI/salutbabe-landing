import {getApp, getApps, initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyAacL6RBs6r9wo-u0kIQnK0a8ppleBsBG8",
  authDomain:        "salutbabe-4f7fd.firebaseapp.com",
  projectId:         "salutbabe-4f7fd",
  storageBucket:     "salutbabe-4f7fd.firebasestorage.app",
  messagingSenderId: "110228573031",
  appId:             "1:110228573031:web:ca7035d9f39786763c3dc2",
  measurementId:     "G-0TGNKDK59J",
};

// Prevent duplicate Firebase app initialization (hot-reload safe)
const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── Providers ────────────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Returns the Firebase idToken after a Google popup sign-in */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/** Returns the Firebase idToken after an Apple popup sign-in */
export async function signInWithApple() {
  const result = await signInWithPopup(auth, appleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

export { auth, signOut };
