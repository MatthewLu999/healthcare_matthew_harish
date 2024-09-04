import { doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";  // Update to match your Firebase version

export class Feedback {
    constructor(content, datecreated, deleted, stars, userid, db, documentID) {
        this.content = content;
        this.datecreated = datecreated;
        this.deleted = deleted;
        this.stars = stars;
        this.userid = userid;
        this.db = db;
        this.documentID = documentID;
    }

    insertToDatabase(articleID) {  // Accept articleID as a parameter
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "feedbacks", this.documentID);

            setDoc(docRef, {
                content: this.content,
                datecreated: this.datecreated,
                deleted: this.deleted,
                stars: this.stars,
                userid: this.userid,
                articleID: articleID  // Use the articleID parameter
            })
            .then(() => {
                console.log("Document written with ID: ", docRef.id);
                resolve(docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                reject(error);
            });
        });
    }
}
