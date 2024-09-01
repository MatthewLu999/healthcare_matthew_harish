// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// ============================================= IMAGE CLASS ========================================================
// Definiton for Connection Class
export class Connection {
    getDBConnection() {
        const firebaseConfig = {
            apiKey: "AIzaSyCEZ-PM0Blt0njHuMVTfWbVDpYUDDWq2Ds",
            authDomain: "healthcaregroupproject-74051.firebaseapp.com",
            projectId: "healthcaregroupproject-74051",
            storageBucket: "healthcaregroupproject-74051.appspot.com",
            messagingSenderId: "516607280511",
            appId: "1:516607280511:web:cc551c6992ec1f7c96464a",
            measurementId: "G-HDK9ZF34FG",
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Get a reference to the Firestore database
        const db = getFirestore(app);
        return db
    }

    testConnection(db) {
        // Get a reference to the collection you want to query
        const collectionRef = collection(db, "articles");

        // Retrieve the documents from the collection
        console.log("\n print data from database:");
        getDocs(collectionRef)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    console.log(doc.data());
                });
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    }
}



