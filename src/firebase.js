// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCE2suHkw-oW19H6yr-CY8rhFPKNA1Urmg",
  authDomain: "instatextweb.firebaseapp.com",
  projectId: "instatextweb",
  storageBucket: "instatextweb.appspot.com",
  messagingSenderId: "943800569219",
  appId: "1:943800569219:web:b1f8902618b9d5dd847ab6",
  measurementId: "G-9WP9SNVPN2"
  });

//   export default debugger;
const db =  firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};