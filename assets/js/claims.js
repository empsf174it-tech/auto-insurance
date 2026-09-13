document.addEventListener('DOMContentLoaded', () => {
  // File Claim Form
  const fileClaimForm = document.getElementById('file-claim-form');
  const claimSuccessMsg = document.getElementById('claim-success-msg');
  
  if (fileClaimForm) {
    const policyInput = document.getElementById('claim-policy');
    const vehicleRegInput = document.getElementById('claim-reg-number');
    
    // Simple validation for Policy Number (e.g., APX-123456)
    policyInput.addEventListener('input', () => {
      const val = policyInput.value.trim();
      if (val.length < 5) {
        policyInput.classList.add('is-invalid');
        policyInput.classList.remove('is-valid');
      } else {
        policyInput.classList.remove('is-invalid');
        policyInput.classList.add('is-valid');
      }
    });

    // Simple validation for Vehicle Reg (e.g., MH01AB1234 - letters + digits)
    vehicleRegInput.addEventListener('input', () => {
      const val = vehicleRegInput.value.trim().toUpperCase();
      vehicleRegInput.value = val; // Force uppercase
      
      const regPattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;
      // We'll use a very forgiving pattern just for demo, but must be alphanumeric
      const isAlphanumeric = /^[A-Z0-9]{6,10}$/.test(val);
      
      if (!isAlphanumeric) {
        vehicleRegInput.classList.add('is-invalid');
        vehicleRegInput.classList.remove('is-valid');
      } else {
        vehicleRegInput.classList.remove('is-invalid');
        vehicleRegInput.classList.add('is-valid');
      }
    });

    fileClaimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic check
      let isValid = true;
      if (policyInput.classList.contains('is-invalid')) isValid = false;
      if (vehicleRegInput.classList.contains('is-invalid')) isValid = false;
      
      if (policyInput.value.trim() === '') {
        policyInput.classList.add('is-invalid');
        isValid = false;
      }
      
      if (vehicleRegInput.value.trim() === '') {
        vehicleRegInput.classList.add('is-invalid');
        isValid = false;
      }

      if (isValid) {
        // Show success
        fileClaimForm.style.display = 'none';
        claimSuccessMsg.classList.remove('hidden');
        
        // Mock a reference number
        const refNum = 'APX-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('new-claim-ref').textContent = refNum;
      }
    });
  }

  // Track Claim Form
  const trackClaimForm = document.getElementById('track-claim-form');
  const trackResult = document.getElementById('track-result');
  
  if (trackClaimForm) {
    const refInput = document.getElementById('track-ref');
    
    trackClaimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const val = refInput.value.trim();
      if (val === '') {
        refInput.classList.add('is-invalid');
        return;
      }
      
      refInput.classList.remove('is-invalid');
      
      // Show mock status
      trackResult.classList.remove('hidden');
      
      // We can mock random states based on the reference number length or just show a standard flow
      // Let's just animate the standard flow
      document.getElementById('track-display-ref').textContent = val;
    });
  }
  
  // FAQ Accordion (Simple implementation)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close others (optional, comment out to allow multiple open)
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      
      item.classList.toggle('active');
    });
  });
});
