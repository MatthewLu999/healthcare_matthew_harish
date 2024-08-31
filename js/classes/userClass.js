class User {
    constructor(
        address,
        birthdate,
        deleted,
        description,
        disabled,
        firstname,
        governmentid,
        lastname,
        role,
        sexorientation,
        userid,
        passwd,
        db,
        documentID
    ) {
        this.address = address;
        this.birthdate = birthdate;
        this.deleted = deleted;
        this.description = description;
        this.disabled = disabled;
        this.firstname = firstname;
        this.governmentid = governmentid;
        this.lastname = lastname;
        this.role = role;
        this.sexorientation = sexorientation;
        this.userid = userid;
        this.passwd = passwd
        this.db = db
        this.documentID = documentID
    }

    // Method to insert a new user to the Firebase database
    async insertToDatabase() {
        return new Promise((resolve, reject) => {
            const docRef = doc(this.db, "users", this.documentID);

            setDoc(docRef, {
                address: this.address,
                birthdate: this.birthdate,
                deleted: 0,
                description: this.description,
                disabled: this.disabled,
                firstname: this.firstname,
                governmentid: this.governmentid,
                lastname: this.lastname,
                role: this.role,
                sexorientation: this.sexorientation,
                userid: this.userid,
                passwd: this.passwd

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

    // Method to update an existing user in the Firebase database
    async updateToDatabase() {
        try {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "users", this.documentID);

                updateDoc(docRef, {
                    address: this.address,
                    birthdate: this.birthdate,
                    description: this.description,
                    disabled: this.disabled,
                    firstname: this.firstname,
                    governmentid: this.governmentid,
                    lastname: this.lastname,
                    role: this.role,
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
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    }

    // Method to delete a user from the Firebase database
    async deleteToDatabase(db, userId) {
        try {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "users", this.documentID);

                updateDoc(docRef, {
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
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    }
}