import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRuJq9GxVWkrGJLibIAcB1cavpLOob_SY",
  authDomain: "zomato-clone-417913.firebaseapp.com",
  projectId: "zomato-clone-417913",
  storageBucket: "zomato-clone-417913.appspot.com",
  messagingSenderId: "368236534725",
  appId: "1:368236534725:web:c080d4aa1204ab83f649ac",
  measurementId: "G-M22HS35FT6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);




export { app, auth,db, storage};
