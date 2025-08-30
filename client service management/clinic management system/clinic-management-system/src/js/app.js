import { auth } from '../firebase/firebase-config.js';
import { checkAuth } from './auth.js';
import { 
    registerPatient, 
    createAppointment, 
    addPrescription, 
    generateBill 
} from './database.js';

// Application State
const state = {
    currentUser: null,
    userType: null,
    activeSection: 'dashboard'
};

// Initialize Application
const initApp = () => {
    // Check authentication status
    auth.onAuthStateChanged((user) => {
        if (user) {
            state.currentUser = user;
            state.userType = localStorage.getItem('userType');
            setupDashboard();
        } else {
            window.location.href = '/index.html';
        }
    });

    // Add event listeners
    setupEventListeners();
};

// Setup Dashboard Based on User Type
const setupDashboard = () => {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    if (state.userType === 'doctor') {
        setupDoctorDashboard();
    } else {
        setupReceptionistDashboard();
    }
};

// Event Listeners Setup
const setupEventListeners = () => {
    // Patient Registration Form
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', handlePatientRegistration);
    }

    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentCreation);
    }

    // Section Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.dataset.section);
        });
    });

    // Password Toggle
    const togglePasswordBtn = document.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePassword);
    }
};

// Handle Patient Registration
const handlePatientRegistration = async (e) => {
    e.preventDefault();
    
    try {
        showLoader();
        
        const patientData = {
            name: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            phone: document.getElementById('patientPhone').value,
            address: document.getElementById('patientAddress').value,
            registeredBy: state.currentUser.uid,
            registeredAt: new Date()
        };

        const patientId = await registerPatient(patientData);
        showAlert('Patient registered successfully!', 'success');
        e.target.reset();
        
    } catch (error) {
        console.error('Error registering patient:', error);
        showAlert('Failed to register patient', 'error');
    } finally {
        hideLoader();
    }
};

// Show/Hide Sections
const showSection = (sectionId) => {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        state.activeSection = sectionId;
    }
};

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Utility Functions
const showLoader = () => {
    const loader = document.querySelector('.spinner');
    if (loader) loader.classList.remove('hidden');
};

const hideLoader = () => {
    const loader = document.querySelector('.spinner');
    if (loader) loader.classList.add('hidden');
};

const showAlert = (message, type = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
};

// Initialize the application
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for use in other modules
export {
    showSection,
    showAlert,
    showLoader,
    hideLoader
};