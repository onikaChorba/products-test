// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ7mFvduwFt8MN2aJCNh2hN2_lvOkOWBE",
  authDomain: "test-product-d3789.firebaseapp.com",
  projectId: "test-product-d3789",
  storageBucket: "test-product-d3789.firebasestorage.app",
  messagingSenderId: "439196001111",
  appId: "1:439196001111:web:c2f671d57d69fc343dd412",
  measurementId: "G-R5N3567ZY8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const db = getFirestore(app);
export default db;
