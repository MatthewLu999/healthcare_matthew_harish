import { Connection } from './connection.js';
import { Patient } from './classes/patientClass.js';

// Initialize Firestore connection
const instanceConnectionFireBase = new Connection();
const db = instanceConnectionFireBase.getDBConnection();
const patientInstance = new Patient(db);

var current_username = getCookieforArray("username");
let userID = ""
if (current_username) {
    userID = current_username
} else {
    userID = "admin@gmail.com"
}

let prescriptionItems = [];  // Array to hold prescription items

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('patientForm');
    const prescriptionList = document.getElementById('prescriptionList');
    const addPrescriptionItemButton = document.getElementById('addPrescriptionItemButton');

    // Add item to prescription list
    addPrescriptionItemButton.addEventListener('click', () => {
        const item = document.getElementById('prescriptionItem').value;
        if (item) {
            prescriptionItems.push(item);
            updatePrescriptionList();
            document.getElementById('prescriptionItem').value = '';
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect patient data from the form
        const patientData = {
            patientName: document.getElementById('patientName').value,
            patientAge: document.getElementById('patientAge').value,
            illnessDescription: document.getElementById('illnessDescription').value,
            prescription: prescriptionItems,
            doctorID: userID  // Replace with actual logged-in doctor ID
        };

        // Console the data before sending it to Firestore
        console.log("Patient Data:", patientData);

        try {
            // Push patient data to Firestore
            const patientID = await patientInstance.createPatient(patientData);
            console.log("Patient record created with ID:", patientID);

            // Optionally, generate a report or update the UI
            generateReport(patientData);
        } catch (error) {
            console.error("Error submitting patient form:", error);
        }
    });

    // Update prescription list in the DOM
    function updatePrescriptionList() {
        prescriptionList.innerHTML = '';
        prescriptionItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item;
            const removeButton = document.createElement('button');
            removeButton.textContent = "Remove";
            removeButton.addEventListener('click', () => {
                prescriptionItems.splice(index, 1);
                updatePrescriptionList();
            });
            li.appendChild(removeButton);
            prescriptionList.appendChild(li);
        });
    }

    // Generate a report after submission
    function generateReport(data) {
        document.getElementById('reportPatientName').textContent = data.patientName;
        document.getElementById('reportPatientAge').textContent = data.patientAge;
        document.getElementById('reportIllnessDescription').textContent = data.illnessDescription;

        const reportPrescriptionList = document.getElementById('reportPrescriptionList');
        reportPrescriptionList.innerHTML = '';
        data.prescription.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            reportPrescriptionList.appendChild(li);
        });

        document.getElementById('patientReport').style.display = 'block';
    }
});

var current_username = getCookieforArray("username");
let welcomelogo = document.getElementById("welcometxt")

if (current_username !== null) {
    welcomelogo.innerText = "Welcome, " + current_username
} else {
    // window.location.href = "login.html"
    welcomelogo.innerText = "Welcome, guest"
}