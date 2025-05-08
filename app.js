
// General app functionality
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
      }
    });
  }
  
  // Check if user is logged in to update navigation
  auth.onAuthStateChanged(user => {
    updateNav(user);
  });
});

// Update navigation based on auth state
function updateNav(user) {
  const loginLinks = document.querySelectorAll('.auth-link');
  const dashboardLink = document.getElementById('dashboardLink');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (user) {
    // User is signed in
    // Hide login/signup links
    loginLinks.forEach(link => {
      link.style.display = 'none';
    });
    
    // Show dashboard and logout
    if (dashboardLink) dashboardLink.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    
    // Get user data to determine dashboard link
    database.ref('users/' + user.uid).once('value')
      .then(snapshot => {
        const userData = snapshot.val();
        if (userData && dashboardLink) {
          dashboardLink.href = userData.userType + '-dashboard.html';
        }
      });
  } else {
    // User is signed out
    // Show login/signup links
    loginLinks.forEach(link => {
      link.style.display = 'inline-block';
    });
    
    // Hide dashboard and logout
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}
