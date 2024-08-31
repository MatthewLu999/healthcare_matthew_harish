
// ============================================= IMAGE CLASS ========================================================
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
// ----------- Definition for images Class
class images {
    constructor(userid, imgcontent, isdeleted, db, documentID) {
        this.userid = userid
        this.imgcontent = imgcontent
        this.isdeleted = isdeleted
        this.db = db
        this.documentID = documentID
    }
}


// ------------------- Definition article's image
class articleImage extends images {

    //initial method
    constructor(articleID, userID, imgContent, isMainPhoto, isDeleted, db, documentID) {
        //call parent class
        super(userID, imgContent, isMainPhoto, isDeleted, db, documentID)
        //set value for child class
        this.articleID = articleID
        this.isMainPhoto = isMainPhoto
    }

    // add images to article
    async addimgtoDatabase() {
        if (this.articleID !== null && this.isMainPhoto !== null && this.imgcontent !== null) {
            return new Promise(async (resolve, reject) => {
                const storage = getStorage();
                const storageRef = ref(storage, `images/${this.imgcontent.name}`);

                const uploadTask = uploadBytesResumable(storageRef, this.imgcontent);

                uploadTask.on(

                    'state_changed',
                    (snapshot) => {
                        // Progress in percent
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        // Handle unsuccessful uploads   

                        console.error('Error uploading image:', error);
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                // Create a document in the Firebase database
                                const docRef = doc(this.db, 'images', this.documentID);
                                setDoc(docRef, {
                                    articleid: this.articleID,
                                    deleted: 0,
                                    imgcontent: downloadURL,
                                    mainphoto: this.mainphoto,
                                    userID: this.userid // Replace with the actual user ID
                                })
                                    .then(() => {
                                        console.log('Image uploaded and document created successfully');
                                        resolve(downloadURL);
                                    })
                                    .catch((error) => {
                                        console.error('Error adding document:', error);
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error getting download URL:', error);
                                reject(error);
                            });
                    }
                );
            });
        } else {
            alert("\n Some error occured during the period of adding the photo to article!")
        }
    }


    // add images to article
    async deleteimgtoDatabase() {
        if (this.articleID !== null && this.isMainPhoto !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "images", this.documentID);

                updateDoc(docRef, {
                    deleted: 1,
                    userID: this.userid // Ensure the user ID matches the current user
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
            alert("\n Some error occured during the period of adding the photo to article!")
        }
    }
}

// ----------------- defintion of personal image
class personalImage extends images {
    //initial method
    constructor(userID, imgContent, isDeleted, isAvatar, documentID) {
        //call parent class
        super(userID, imgContent, isDeleted, documentID)
        this.isAvatar = isAvatar
    }

    //add img to database
    async addimgtoDatabase() {
        //check img info befire inserting to database
        if (this.userid !== null && this.imgcontent !== null && this.isdeleted !== null) {
            return new Promise(async (resolve, reject) => {
                const storage = getStorage();
                const storageRef = ref(storage, `images/${this.imgcontent.name}`);

                const uploadTask = uploadBytesResumable(storageRef, this.imgcontent);

                uploadTask.on(

                    'state_changed',
                    (snapshot) => {
                        // Progress in percent
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        // Handle unsuccessful uploads   

                        console.error('Error uploading image:', error);
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                // Create a document in the Firebase database
                                const docRef = doc(this.db, 'images', this.documentID);
                                setDoc(docRef, {
                                    articleid: '',
                                    deleted: 0,
                                    imgcontent: downloadURL,
                                    mainphoto: 0,
                                    isavatar: 1,
                                    userID: this.userid // Replace with the actual user ID
                                })
                                    .then(() => {
                                        console.log('Image uploaded and document created successfully');
                                        resolve(downloadURL);
                                    })
                                    .catch((error) => {
                                        console.error('Error adding document:', error);
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error getting download URL:', error);
                                reject(error);
                            });
                    }
                );
            });

        } else {
            alert("!Some errors with this image")
        }
    }


    // delete image 
    async deleteimgtoDatabase() {
        //check img info befire inserting to database
        if (this.userid !== null && this.imgcontent !== null && this.isdeleted !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "images", this.documentID);

                updateDoc(docRef, {
                    isavatar: 0,
                    deleted: 1,
                    userID: this.userid // Ensure the user ID matches the current user
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
            alert("!Some errors with this image")
        }
    }

}




