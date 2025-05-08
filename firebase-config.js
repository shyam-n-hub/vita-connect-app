
// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Function to show toast messages
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.className = 'toast';
    if (type) {
      toast.classList.add(type);
    }
    toast.style.display = 'block';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
});
