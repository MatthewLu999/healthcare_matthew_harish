class BloodTest {
    constructor(createddate, deleted, name, testid, db, documentID) {
        this.createddate = createddate;
        this.deleted = deleted;
        this.name = name;
        this.testid = testid;
        this.db = db;
        this.documentID = documentID;
    }

    async insertToDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "bloodtest", this.documentID); // Assuming "articles" is your collection name

            setDoc(docRef, {
                createddate: this.createddate,
                deleted: this.deleted,
                name: this.name,
                testid: this.testid

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

    async deleteFromDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "bloodtest", this.documentID);

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