
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
});

function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  const submitBtn = document.getElementById('contactSubmitBtn');
  
  // Validate inputs
  if (!name || !email || !message) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  // Disable button and show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
  
  // Simulate form submission (in a real app, this would send data to a server)
  setTimeout(() => {
    // Enable button and reset form
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    showToast('Message sent successfully! We will get back to you soon.', 'success');
  }, 1500);
}
