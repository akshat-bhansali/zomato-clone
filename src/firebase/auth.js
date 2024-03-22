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

export const doSignInWithEmailAndPassword = async(email, password,role) => {
  const data = await fetchDataFromFirestore();
  const existingUser = data?.find(user => user.email == email);
  if(existingUser){
    if(role!=existingUser.role){
      return signInWithEmailAndPassword(auth, "email", password);
    }
    else{
      localStorage.setItem("user",JSON.stringify(existingUser));
      return signInWithEmailAndPassword(auth, email, password);
    }
  }
  return signInWithEmailAndPassword(auth, email, password);
};
export const saveDataToFirestore = async (email,name,role) => {
  const data = await fetchDataFromFirestore();
  const existingUser = data?.find(user => user.email == email);
  if(!existingUser){
    try {
      const docRef = await addDoc(colletionRef, {
        email: email,
        name: name,
        role: role
      });
      localStorage.setItem("user",JSON.stringify({name:name,role:role,email:email}));
    } catch (error) {
      console.error("Error writing document: ", error);
      alert("Error writing document to Database");
    }
  }
  else{
    if(role!=existingUser.role){
      auth.signOut();
      alert("access denied");
      window.location.reload();
    }
    else{
      localStorage.setItem("user",JSON.stringify(existingUser));
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

export const doSignInWithGoogle = async (role) => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  saveDataToFirestore(user.email,user.displayName,role);
};

export const doSignOut = () => {
  localStorage.removeItem("user"); 
  return auth.signOut();
};


export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
