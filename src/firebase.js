// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
//Huyên: cái này là cấu hình firebase của tùy tài khoản gg, khi tạo firebase nó sẽ cho mình
const firebaseConfig = {
    apiKey: "AIzaSyC1mGW4Js8wApTY51ts4823xAYPop2ySw8",
    authDomain: "bookingcare-e18db.firebaseapp.com",
    projectId: "bookingcare-e18db",
    storageBucket: "bookingcare-e18db.appspot.com",
    messagingSenderId: "380714119262",
    appId: "1:380714119262:web:1f802215800ffa80a084cf",
    measurementId: "G-3XJKZPP16T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);