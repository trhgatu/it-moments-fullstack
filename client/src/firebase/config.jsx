// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsZxfaVoRcBlnR3ZAn43o57m3hiLXy73k",
  authDomain: "it-moments.firebaseapp.com",
  projectId: "it-moments",
  storageBucket: "it-moments.appspot.com",
  messagingSenderId: "994736506670",
  appId: "1:994736506670:web:75f914f9d75dbb16969cbf",
  measurementId: "G-LCFVEYDS8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);