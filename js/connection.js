// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEZ-PM0Blt0njHuMVTfWbVDpYUDDWq2Ds",
  authDomain: "healthcaregroupproject-74051.firebaseapp.com",
  projectId: "healthcaregroupproject-74051",
  storageBucket: "healthcaregroupproject-74051.appspot.com",
  messagingSenderId: "516607280511",
  appId: "1:516607280511:web:cc551c6992ec1f7c96464a",
  measurementId: "G-HDK9ZF34FG",
};

// Define and export the Connection class
export class Connection {
  constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  getDBConnection() {
    return this.db;
  }

  async getCollectionData(collectionName) {
    const collectionRef = collection(this.db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => doc.data());
  }

  async getDocumentData(collectionName, docId) {
    const docRef = doc(this.db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("No such document!");
    }
  }
}
