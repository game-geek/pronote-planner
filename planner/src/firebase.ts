import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {

    apiKey: "AIzaSyBcZssh9CQax8hw-UAzF0QsBV6jV2c0aXc",
  
    authDomain: "planner-7388f.firebaseapp.com",
  
    projectId: "planner-7388f",
  
    storageBucket: "planner-7388f.appspot.com",
  
    messagingSenderId: "805610466494",
  
    appId: "1:805610466494:web:a4aa6418dc7c07588002ef"
  
  };
  
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth(app)


export {db, auth}
