import { doc, getDoc, where, query, getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

class UserAuthentication {
    constructor(db) {
        this.db = db;
        this.auth = getAuth();
    }

    async login(username, password) {
        try {
            // Find the user document based on username
            const q = query(collection(this.db, "users"), where("userid", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const storedPassword = doc.data().passwd;

                // Compare the entered password with the stored password
                if (password === storedPassword) {
                    // If passwords match, log in the user
                    const userCredential = await signInWithEmailAndPassword(this.auth, username, password);
                    const user = userCredential.user;
                    console.log("User signed in with email:", user.email);
                    return user;
                } else {
                    console.log("Incorrect password");
                    return null;
                }
            } else {
                console.log("User not found");
                return null;
            }
        } catch (error) {
            console.error("Error signing in:", error);
            return null;
        }
    }

    async getUserDocumentId(userId) {
        try {
            const q = query(collection(this.db, "users"), where("userid", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return doc.id;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error getting document ID:", error);
            return null;
        }
    }
}