"use strict";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
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
var app_1 = require("firebase-admin/app");
var auth_1 = require("firebase-admin/auth");
var firestore_1 = require("firebase-admin/firestore");
var serviceAccount = require("../planner-7388f-firebase-adminsdk-4qosx-72294b909b.json");
var admin = require("firebase-admin");
var app = (0, app_1.initializeApp)({
    credential: admin.credential.cert(serviceAccount),
    // credential: applicationDefault(), export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
});
var auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
var db = (0, firestore_1.getFirestore)(app);
exports.db = db;
