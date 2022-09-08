// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfigProduction = {
  apiKey: "AIzaSyCVDB2flRU_zF9jBclDUdH9mxalj6oy5TM",
  authDomain: "uploadingfile-56401.firebaseapp.com",
  projectId: "uploadingfile-56401",
  storageBucket: "uploadingfile-56401.appspot.com",
  messagingSenderId: "121714502734",
  appId: "1:121714502734:web:135c6bb406ebb01890271f",
};

const firebaseConfigDevelopment = {
  apiKey: "AIzaSyD5228vmudIngsUwhUn23IjmHb_QQY8tsU",
  authDomain: "asra-develop.firebaseapp.com",
  projectId: "asra-develop",
  storageBucket: "asra-develop.appspot.com",
  messagingSenderId: "221851411254",
  appId: "1:221851411254:web:7a8df37278c95c76608997",
  measurementId: "G-EW53LWSW6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfigDevelopment);
export const storage = getStorage(app);
