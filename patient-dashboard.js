
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in and is a patient
  auth.onAuthStateChanged(user => {
    if (user) {
      database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          
          if (!userData || userData.userType !== 'patient') {
            // Redirect if not a patient
            window.location.href = 'login.html';
            return;
          }
          
          // Initialize patient dashboard
          initPatientDashboard(user.uid, userData);
        });
    } else {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
    }
  });
});

function initPatientDashboard(userId, userData) {
  // Setup user profile section
  setupUserProfile(userData);
  
  // Setup tab navigation
  setupTabs();
  
  // Setup health problem form
  setupHealthProblemForm(userId, userData);
  
  // Load patient's health records
  loadPatientRecords(userId);
}

function setupUserProfile(userData) {
  const userProfile = document.getElementById('userProfile');
  if (userProfile) {
    userProfile.innerHTML = `
      <div class="profile-avatar">${userData.name.charAt(0)}</div>
      <div class="profile-info">
        <h3>${userData.name}</h3>
        <p>${userData.email}</p>
      </div>
    `;
  }
}

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all tabs and buttons
      document.querySelectorAll('.tab-pane').forEach(tab => {
        tab.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Activate the selected tab and button
      document.getElementById(tabId).classList.add('active');
      this.classList.add('active');
    });
  });
}

function setupHealthProblemForm(userId, userData) {
  const healthProblemForm = document.getElementById('healthProblemForm');
  
  if (healthProblemForm) {
    healthProblemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const healthProblem = document.getElementById('healthProblem').value;
      const submitBtn = document.getElementById('submitProblemBtn');
      
      if (!healthProblem.trim()) {
        showToast('Please describe your health problem', 'error');
        return;
      }
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
      
      // Create a new record in the database
      const newRecord = {
        patientId: userId,
        patientName: userData.name,
        problem: healthProblem,
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      // Push the new record to the database
      database.ref('healthRecords').push(newRecord)
        .then(() => {
          showToast('Your health problem has been submitted', 'success');
          
          // Reset form
          healthProblemForm.reset();
          
          // Enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
          
          // Reload records
          loadPatientRecords(userId);
        })
        .catch(error => {
          console.error("Error submitting health problem:", error);
          showToast('Failed to submit: ' + error.message, 'error');
          
          // Enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        });
    });
  }
}

function loadPatientRecords(patientId) {
  const recordsList = document.getElementById('recordsList');
  const loadingRecords = document.getElementById('loadingRecords');
  
  if (!recordsList) return;
  
  // Show loading indicator
  if (loadingRecords) {
    loadingRecords.style.display = 'flex';
  }
  
  // Query records for this patient
  database.ref('healthRecords')
    .orderByChild('patientId')
    .equalTo(patientId)
    .once('value')
    .then(snapshot => {
      // Hide loading indicator
      if (loadingRecords) {
        loadingRecords.style.display = 'none';
      }
      
      if (!snapshot.exists()) {
        recordsList.innerHTML = '<div class="empty-state">You have no health records yet.</div>';
        return;
      }
      
      let html = '';
      const records = [];
      
      // Convert snapshot to array and sort by date (newest first)
      snapshot.forEach(childSnapshot => {
        records.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      records.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
      
      // Generate HTML for each record
      records.forEach(record => {
        html += `
          <div class="record-item ${record.status === 'pending' ? 'pending' : ''}">
            <div class="record-header">
              <h3 class="record-title">Health Problem</h3>
              <span class="record-date">${record.dateSubmitted}</span>
            </div>
            <div class="record-problem">
              <p>${record.problem}</p>
            </div>
            
            ${record.status === 'pending' ? 
              `<div class="status-badge pending">Awaiting doctor's response</div>` : 
              `<div class="record-response">
                <h4 class="response-header">Doctor's Response</h4>
                <p>${record.prescription}</p>
                <p class="response-doctor">Response from ${record.doctorName}</p>
              </div>`
            }
          </div>
        `;
      });
      
      recordsList.innerHTML = html;
    })
    .catch(error => {
      console.error("Error loading records:", error);
      
      // Hide loading indicator
      if (loadingRecords) {
        loadingRecords.style.display = 'none';
      }
      
      recordsList.innerHTML = '<div class="error-state">Failed to load records. Please try again.</div>';
      showToast('Failed to load records: ' + error.message, 'error');
    });
}
