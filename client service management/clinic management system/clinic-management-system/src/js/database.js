// database.js

import { db } from './firebase-config';

// Function to add a patient record
export const addPatientRecord = async (patientData) => {
    try {
        const docRef = await db.collection('patients').add(patientData);
        console.log('Patient record added with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding patient record: ', error);
    }
};

// Function to get patient records
export const getPatientRecords = async () => {
    try {
        const snapshot = await db.collection('patients').get();
        const patientRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return patientRecords;
    } catch (error) {
        console.error('Error retrieving patient records: ', error);
    }
};

// Function to update a patient record
export const updatePatientRecord = async (id, updatedData) => {
    try {
        await db.collection('patients').doc(id).update(updatedData);
        console.log('Patient record updated with ID: ', id);
    } catch (error) {
        console.error('Error updating patient record: ', error);
    }
};

// Function to delete a patient record
export const deletePatientRecord = async (id) => {
    try {
        await db.collection('patients').doc(id).delete();
        console.log('Patient record deleted with ID: ', id);
    } catch (error) {
        console.error('Error deleting patient record: ', error);
    }
};