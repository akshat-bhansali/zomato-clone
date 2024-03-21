import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore, addDoc, collection, getDocs, CollectionReference } from "firebase/firestore";
import {db} from "./firebase" 
const colletionRef = collection(db, 'user');
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
const saveDataToFirestore = async (email,name) => {
  const data = await fetchDataFromFirestore();
  const existingUser = data?.find(user => user.email == email);
  if(!existingUser){
    try {
      const docRef = await addDoc(colletionRef, {
        email: email,
        name: name,
        role: "user"
      });
    } catch (error) {
      console.error("Error writing document: ", error);
      alert("Error writing document to Database");
    }
  }
};

const fetchDataFromFirestore = async () => {
  const querySnapshot = await getDocs(colletionRef);
  const temporaryArr = [];
  querySnapshot.forEach((doc) => {
      temporaryArr.push(doc.data());
  });
    return temporaryArr;
  };

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  saveDataToFirestore(user.email,user.displayName);
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
