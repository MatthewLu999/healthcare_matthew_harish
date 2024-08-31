class BloodTestResult {
    constructor(createddate, deleted, disease, testid, unit, userid, value, db, documentID) {
        this.createddate = createddate;
        this.deleted = deleted;
        this.disease = disease;
        this.testid = testid;
        this.unit = unit;
        this.userid = userid;
        this.value = value;
        this.db = db;
        this.documentID = documentID;
    }

    insertToDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "bloodtestresults", this.documentID); // Assuming "bloodtestresults" is your collection name

            setDoc(docRef, {
                createddate: this.createddate,
                deleted: this.deleted,
                disease: this.disease,
                testid: this.testid,
                unit: this.unit,
                userid: this.userid,
                value: this.value
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

    updateToDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "bloodtestresults", this.documentID);

            updateDoc(docRef, {
                unit: this.unit,
                disease: this.disease,
                value: this.value
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
    }

    deleteFromDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "bloodtestresults", this.documentID);

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