
// Check authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  auth.onAuthStateChanged(user => {
    const dashboardLink = document.getElementById('dashboardLink');
    const loginLinks = document.querySelectorAll('.auth-link');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user) {
      console.log("User is signed in:", user.uid);
      
      // Get user data from database
      database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (userData) {
            // Update UI based on user type
            if (dashboardLink) {
              dashboardLink.classList.remove('hidden');
              dashboardLink.href = userData.userType + '-dashboard.html';
            }
            
            // Hide login/signup links
            loginLinks.forEach(link => {
              link.classList.add('hidden');
            });
            
            // Show logout button
            if (logoutBtn) {
              logoutBtn.classList.remove('hidden');
              logoutBtn.addEventListener('click', logout);
            }
            
            // Redirect if on login/signup page
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('signup.html')) {
              window.location.href = userData.userType + '-dashboard.html';
            }
          }
        })
        .catch(error => {
          console.error("Error getting user data:", error);
        });
    } else {
      console.log("No user is signed in");
      
      // Show login/signup links
      loginLinks.forEach(link => {
        link.classList.remove('hidden');
      });
      
      // Hide dashboard link and logout button
      if (dashboardLink) dashboardLink.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      
      // Redirect if on protected pages
      if (window.location.pathname.includes('patient-dashboard.html') || 
          window.location.pathname.includes('doctor-dashboard.html')) {
        window.location.href = 'login.html';
      }
    }
  });
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});

// Login handler
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  
  // Validate inputs
  if (!email || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  // Disable button and show loading state
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
  
  // Sign in with email and password
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      showToast('Login successful', 'success');
      
      // Get user data to determine redirect
      database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (userData) {
            window.location.href = userData.userType + '-dashboard.html';
          }
        });
    })
    .catch(error => {
      console.error("Login error:", error);
      showToast('Login failed: ' + error.message, 'error');
      
      // Reset button
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    });
}

// Signup handler
function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const userType = document.getElementById('userType').value;
  const signupBtn = document.getElementById('signupBtn');
  
  // Validate inputs
  if (!name || !email || !password || !confirmPassword) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  // Disable button and show loading state
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
  
  // Create user with email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      
      // Store additional user data in database
      return database.ref('users/' + user.uid).set({
        name: name,
        email: email,
        userType: userType
      });
    })
    .then(() => {
      showToast('Account created successfully', 'success');
      window.location.href = userType + '-dashboard.html';
    })
    .catch(error => {
      console.error("Signup error:", error);
      showToast('Signup failed: ' + error.message, 'error');
      
      // Reset button
      signupBtn.disabled = false;
      signupBtn.textContent = 'Sign Up';
    });
}

// Logout handler
function logout() {
  auth.signOut()
    .then(() => {
      showToast('Logged out successfully');
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error("Logout error:", error);
      showToast('Logout failed: ' + error.message, 'error');
    });
}
