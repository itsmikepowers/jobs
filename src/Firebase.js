import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOs9OOEdxWIvhGt2elNNMmAreJO5nbaIg",
  authDomain: "smartscreen-dev.firebaseapp.com",
  projectId: "smartscreen-dev",
  storageBucket: "smartscreen-dev.appspot.com",
  messagingSenderId: "63888612200",
  appId: "1:63888612200:web:1c41f6ca686e8253b554dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };