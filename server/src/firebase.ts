// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {

//     apiKey: "AIzaSyBcZssh9CQax8hw-UAzF0QsBV6jV2c0aXc",
  
//     authDomain: "planner-7388f.firebaseapp.com",
  
//     projectId: "planner-7388f",
  
//     storageBucket: "planner-7388f.appspot.com",
  
//     messagingSenderId: "805610466494",
  
//     appId: "1:805610466494:web:a4aa6418dc7c07588002ef"
  
//   };
  
  
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// // Initialize Cloud Firestore and get a reference to the service
// const db = getFirestore(app);
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
var serviceAccount = require("./planner-7388f-firebase-adminsdk-4qosx-72294b909b.json");
var admin = require("firebase-admin");

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // credential: applicationDefault(), export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
});

let auth = getAuth(app);
let db = getFirestore(app);



export { auth, db }
