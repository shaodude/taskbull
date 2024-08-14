// Import the functions you need from the SDKs you need
// compat packages are API compatible with namespaced code
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe_KQwStkMKaK7dFs5Xn-PIWugIzANCfU",
  authDomain: "taskbull-base.firebaseapp.com",
  projectId: "taskbull-base",
  storageBucket: "taskbull-base.appspot.com",
  messagingSenderId: "1082544000351",
  appId: "1:1082544000351:web:c98ed3b86536d875113aea",
  measurementId: "G-76HWLYRHFJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
