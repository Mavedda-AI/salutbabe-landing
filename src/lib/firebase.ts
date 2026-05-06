import {getApp, getApps, initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
