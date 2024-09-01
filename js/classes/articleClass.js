import { doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// ============================================= ARTICLE CLASS ========================================================

// ----------- Definition for article Class
export class Article {
    constructor(articleID, userID, mainheading, subheading, content, topic, isdeleted, db, documentID) {
        this.articleID = articleID
        this.userID = userID
        this.mainheading = mainheading
        this.subheading = subheading
        this.content = content
        this.topic = topic
        this.isdeleted = isdeleted
        this.db = db
        this.documentID = documentID
    }


    //add img to database
    async inserttoDatabase() {
        //check img info befire inserting to database
        if (this.userID !== null && this.articleID !== null && this.mainheading !== null && this.subheading !== null && this.content !== null && this.topic !== null && this.isdeleted !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "articles", this.documentID);
                const timestamp = new Date().toISOString();

                setDoc(docRef, {
                    articleid: this.articleID,
                    content: this.content,
                    createddate: timestamp,
                    deleted: 0,
                    maintitle: this.mainheading,
                    subtitle: this.subheading,
                    topic: this.topic,
                    userid: this.userID
                })
                    .then(() => {
                        console.log("Document written with ID: ", docRef.id);
                        resolve(docRef.id);
                        let resulttxt = document.getElementById("resultofquiz")
                        resulttxt.style.display = "block"
                        resulttxt.innerText = "The News was created successfully!"
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        reject(error);

                    });
            });
        } else {
            alert("Some errors in inserting this article!")
        }
    }


    // update image
    async updatetoDatabase() {
        //check img info befire inserting to database
        if (this.articleID !== null && this.userID !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "articles", this.documentID);

                updateDoc(docRef, {
                    articleid: this.articleID,
                    content: this.content,
                    maintitle: this.mainheading,
                    subtitle: this.subheading
                })
                    .then(() => {
                        console.log("Document updated successfully");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                        reject(error);
                    });
            });
        } else {
            alert("Some errors in updating this article!")
        }
    }


    // delete image 
    async deletetoDatabase() {
        //check img info befire inserting to database
        if (this.articleID !== null && this.userID !== null && this.isdeleted !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "articles", this.documentID);

                updateDoc(docRef, {
                    articleid: this.articleID,
                    userid: this.userID,
                    deleted: 1
                })
                    .then(() => {
                        console.log("Document updated successfully");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                        reject(error);
                    });
            });
        } else {
            alert("Some errors wiin the process of deleting this article!")
        }
    }

}
