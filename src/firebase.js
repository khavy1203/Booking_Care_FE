// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
//Huyên: cái này là cấu hình firebase của tùy tài khoản gg, khi tạo firebase nó sẽ cho mình
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "datn-b2c94.firebaseapp.com",
  projectId: "datn-b2c94",
  storageBucket: "datn-b2c94.appspot.com",
  messagingSenderId: "120775637730",
  appId: "1:120775637730:web:f5b65c0d6c731210523cbb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
