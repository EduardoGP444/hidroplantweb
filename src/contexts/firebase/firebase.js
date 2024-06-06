import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCWcKV79zc-N_RZV16ssO_-i4C1usAmORU",
  authDomain: "hidroplant-22ea4.firebaseapp.com",
  databaseURL: "https://hidroplant-22ea4-default-rtdb.firebaseio.com",
  projectId: "hidroplant-22ea4",
  storageBucket: "hidroplant-22ea4.appspot.com",
  messagingSenderId: "909612750706",
  appId: "1:909612750706:web:e322689225bea932d02feb",
  measurementId: "G-M7HZJKVTPZ"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const database = getDatabase(app);
  
  export { app, auth, db , database};