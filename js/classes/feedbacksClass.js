class Feedback {
    constructor(content, datecreated, deleted, stars, userid, db, documentID) {
        this.content = content;
        this.datecreated = datecreated;
        this.deleted = deleted;
        this.stars = stars;
        this.userid = userid;
        this.db = db;
        this.documentID = documentID
    }

    insertToDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "feedbacks", this.documentID); // Assuming "feedbacks" is your collection name

            setDoc(docRef, {
                content: this.content,
                datecreated: this.datecreated,
                deleted: this.deleted,
                stars: this.stars,
                userid: this.userid
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

    deleteFromDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "feedbacks", this.documentID);

            updateDoc(docRef, {
                deleted: 1
            })
                .then(() => {
                    console.log("Document deleted successfully");
                    resolve();
                })
                .catch((error) => {
                    console.error("Error deleting document:", error);
                    reject(error);
                });
        });
    }
}