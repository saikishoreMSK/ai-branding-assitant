import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeINA_W3TbyIxVZFO47S9mjO0oZ9fMHYM",
  authDomain: "college-projects-435a2.firebaseapp.com",
  projectId: "college-projects-435a2",
  storageBucket: "college-projects-435a2.appspot.com",
  messagingSenderId: "1089349915934",
  appId: "1:1089349915934:web:229ddfb00cb0ff3e31a50f",
  measurementId: "G-MX79MJ8F87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);