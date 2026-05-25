import {getApp, getApps, initializeApp} from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "dummy",
};

// Prevent duplicate Firebase app initialization (hot-reload safe)
const app  = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── Providers ────────────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Returns the Firebase idToken after a Google popup sign-in */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

export { auth, signOut };
