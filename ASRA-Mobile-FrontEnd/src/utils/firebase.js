// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVDB2flRU_zF9jBclDUdH9mxalj6oy5TM",
  authDomain: "uploadingfile-56401.firebaseapp.com",
  projectId: "uploadingfile-56401",
  storageBucket: "uploadingfile-56401.appspot.com",
  messagingSenderId: "121714502734",
  appId: "1:121714502734:web:135c6bb406ebb01890271f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
