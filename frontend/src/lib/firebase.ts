import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnhXMbPREQP4R8jY7X3lSnIrYusHpUQHQ",
  authDomain: "quickconcessionchat.firebaseapp.com",
  projectId: "quickconcessionchat",
  storageBucket: "quickconcessionchat.firebasestorage.app",
  messagingSenderId: "69473628589",
  appId: "1:69473628589:web:12de49536319c82f243124",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
