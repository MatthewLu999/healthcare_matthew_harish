import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

export class Patient {
    constructor(db) {
        this.db = db;
    }

    // Create a new patient document in Firestore
    async createPatient(patientData) {
        try {
            const patientDocRef = doc(collection(this.db, "patients"), `patient_${Date.now()}`);
            await setDoc(patientDocRef, patientData);
            console.log("Patient data stored successfully with ID: ", patientDocRef.id);
            return patientDocRef.id;
        } catch (error) {
            console.error("Error storing patient data:", error);
            throw error;
        }
    }

    // Retrieve a patient document by ID
    async getPatientById(patientID) {
        try {
            const patientDocRef = doc(this.db, "patients", patientID);
            const patientDoc = await getDoc(patientDocRef);
            if (patientDoc.exists()) {
                return patientDoc.data();
            } else {
                console.error("No such patient document!");
                return null;
            }
        } catch (error) {
            console.error("Error retrieving patient data:", error);
            throw error;
        }
    }

    // Update an existing patient document
    async updatePatient(patientID, updatedData) {
        try {
            const patientDocRef = doc(this.db, "patients", patientID);
            await updateDoc(patientDocRef, updatedData);
            console.log("Patient data updated successfully for ID:", patientID);
        } catch (error) {
            console.error("Error updating patient data:", error);
            throw error;
        }
    }

    // Delete a patient document
    async deletePatient(patientID) {
        try {
            const patientDocRef = doc(this.db, "patients", patientID);
            await deleteDoc(patientDocRef);
            console.log("Patient data deleted successfully for ID:", patientID);
        } catch (error) {
            console.error("Error deleting patient data:", error);
            throw error;
        }
    }
}
