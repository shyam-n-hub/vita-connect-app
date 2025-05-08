
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in and is a doctor
  auth.onAuthStateChanged(user => {
    if (user) {
      database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          
          if (!userData || userData.userType !== 'doctor') {
            // Redirect if not a doctor
            window.location.href = 'login.html';
            return;
          }
          
          // Initialize doctor dashboard
          initDoctorDashboard(user.uid, userData);
        });
    } else {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
    }
  });
});

function initDoctorDashboard(doctorId, userData) {
  // Setup user profile section
  setupUserProfile(userData);
  
  // Setup filter buttons
  setupFilterButtons();
  
  // Load all patient records
  loadAllRecords(doctorId, 'pending');
  
  // Setup prescription modal
  setupPrescriptionModal(doctorId, userData);
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

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Reload records with the selected filter
      const doctorId = auth.currentUser.uid;
      loadAllRecords(doctorId, filter);
    });
  });
}

function loadAllRecords(doctorId, filter) {
  const recordsList = document.getElementById('patientRecordsList');
  const loadingRecords = document.getElementById('loadingRecords');
  
  if (!recordsList) return;
  
  // Show loading indicator
  if (loadingRecords) {
    loadingRecords.style.display = 'flex';
  }
  
  // Query all records
  database.ref('healthRecords')
    .once('value')
    .then(snapshot => {
      // Hide loading indicator
      if (loadingRecords) {
        loadingRecords.style.display = 'none';
      }
      
      if (!snapshot.exists()) {
        recordsList.innerHTML = '<div class="empty-state">No patient records found.</div>';
        return;
      }
      
      let html = '';
      const records = [];
      
      // Convert snapshot to array and filter if needed
      snapshot.forEach(childSnapshot => {
        const record = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
        
        // Apply filter if not showing all
        if (filter === 'all' || record.status === filter) {
          records.push(record);
        }
      });
      
      // Sort by date (newest first)
      records.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
      
      if (records.length === 0) {
        recordsList.innerHTML = `<div class="empty-state">No ${filter} records found.</div>`;
        return;
      }
      
      // Generate HTML for each record
      records.forEach(record => {
        html += `
          <div class="patient-record ${record.status === 'pending' ? 'pending' : ''}">
            <div class="record-header">
              <h3 class="patient-name">${record.patientName}</h3>
              <span class="record-date">${record.dateSubmitted}</span>
            </div>
            
            <div class="record-problem">
              <h4 class="problem-label">Health Problem</h4>
              <p>${record.problem}</p>
            </div>
            
            ${record.status === 'pending' ? 
              `<button class="btn btn-primary respond-btn" data-id="${record.id}" data-problem="${record.problem}" data-patient="${record.patientName}">Respond</button>` : 
              `<div class="record-response">
                <h4 class="response-header">Prescribed Treatment</h4>
                <p>${record.prescription}</p>
              </div>`
            }
          </div>
        `;
      });
      
      recordsList.innerHTML = html;
      
      // Add event listeners to respond buttons
      document.querySelectorAll('.respond-btn').forEach(button => {
        button.addEventListener('click', function() {
          const recordId = this.getAttribute('data-id');
          const problem = this.getAttribute('data-problem');
          const patientName = this.getAttribute('data-patient');
          
          openPrescriptionModal(recordId, problem, patientName);
        });
      });
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

function setupPrescriptionModal(doctorId, userData) {
  const modal = document.getElementById('prescriptionModal');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.getElementById('cancelPrescription');
  const prescriptionForm = document.getElementById('prescriptionForm');
  
  // Close modal when clicking the X
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // Close modal when clicking the cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Handle prescription form submission
  if (prescriptionForm) {
    prescriptionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const prescription = document.getElementById('prescription').value;
      const recordId = document.getElementById('recordId').value;
      const submitBtn = document.getElementById('submitPrescription');
      
      if (!prescription.trim()) {
        showToast('Please enter a prescription', 'error');
        return;
      }
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
      
      // Update the health record with the prescription
      database.ref('healthRecords/' + recordId).update({
        prescription: prescription,
        doctorId: doctorId,
        doctorName: userData.name,
        status: 'responded'
      })
        .then(() => {
          showToast('Prescription submitted successfully', 'success');
          
          // Close modal and reset form
          modal.style.display = 'none';
          prescriptionForm.reset();
          
          // Reload records
          loadAllRecords(doctorId, 'pending');
        })
        .catch(error => {
          console.error("Error submitting prescription:", error);
          showToast('Failed to submit prescription: ' + error.message, 'error');
          
          // Enable button
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Prescription';
        });
    });
  }
}

function openPrescriptionModal(recordId, problem, patientName) {
  const modal = document.getElementById('prescriptionModal');
  const patientProblemText = document.getElementById('patientProblemText');
  const recordIdInput = document.getElementById('recordId');
  const modalTitle = document.querySelector('.modal-header h2');
  
  if (modal && patientProblemText && recordIdInput) {
    // Set modal content
    patientProblemText.textContent = problem;
    recordIdInput.value = recordId;
    
    if (modalTitle) {
      modalTitle.textContent = `Prescribe Treatment for ${patientName}`;
    }
    
    // Open modal
    modal.style.display = 'block';
    
    // Focus on prescription textarea
    document.getElementById('prescription').focus();
  }
}
