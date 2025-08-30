import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const showLoading = () => {
    document.querySelector('.loading-overlay').classList.remove('hidden');
};

const hideLoading = () => {
    document.querySelector('.loading-overlay').classList.add('hidden');
};

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    const loginButton = document.getElementById('loginButton');

    try {
        showLoading();
        loginButton.disabled = true;
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCredential.user);
        
        // Store user info
        localStorage.setItem('userEmail', userCredential.user.email);
        
        // Redirect to dashboard
        window.location.href = '../src/pages/dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Invalid email or password';
        loginError.style.display = 'block';
        loginButton.disabled = false;
    } finally {
        hideLoading();
    }
};

// Check authentication status
const checkAuth = () => {
    showLoading();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (window.location.href.includes('index.html')) {
                window.location.href = '../src/pages/dashboard.html';
            }
        } else {
            // No user is signed in
            if (!window.location.href.includes('index.html')) {
                window.location.href = '../../public/index.html';
            }
        }
        hideLoading();
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    checkAuth();
});

export { handleLogin, checkAuth };