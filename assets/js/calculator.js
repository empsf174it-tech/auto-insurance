document.addEventListener('DOMContentLoaded', () => {
  const calcForm = document.getElementById('premium-calculator-form');
  const resultContainer = document.getElementById('calculator-result');
  const premiumAmountEl = document.getElementById('estimated-premium');
  
  if (!calcForm) return;

  // Real-time validation for numeric inputs
  const vehicleAgeInput = document.getElementById('vehicle-age');
  const idvInput = document.getElementById('vehicle-idv');

  function validateNumericInput(input, min, max, errorMsgId) {
    input.addEventListener('input', () => {
      // Remove non-numeric chars
      input.value = input.value.replace(/[^0-9]/g, '');
      const val = parseInt(input.value);
      const errorEl = document.getElementById(errorMsgId);
      
      if (isNaN(val) || val < min || val > max) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });
  }

  validateNumericInput(vehicleAgeInput, 0, 20, 'age-error');
  validateNumericInput(idvInput, 10000, 10000000, 'idv-error');

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check validation states
    const ageVal = parseInt(vehicleAgeInput.value);
    const idvVal = parseInt(idvInput.value);
    let isValid = true;
    
    if (isNaN(ageVal) || ageVal < 0 || ageVal > 20) {
      vehicleAgeInput.classList.add('is-invalid');
      isValid = false;
    }
    
    if (isNaN(idvVal) || idvVal < 10000 || idvVal > 10000000) {
      idvInput.classList.add('is-invalid');
      isValid = false;
    }
    
    if (!isValid) return;

    // Calculate mock premium
    const type = document.getElementById('calc-vehicle-type').value;
    const city = document.getElementById('calc-city').value;
    
    const addonZeroDep = document.getElementById('addon-zero-dep').checked;
    const addonEngine = document.getElementById('addon-engine').checked;
    const addonRsa = document.getElementById('addon-rsa').checked;

    let baseRate = type === 'car' ? 0.025 : 0.045; // Base percentage of IDV
    
    // Age penalty (older vehicles slightly riskier, though usually IDV drops so premium drops... keep it simple mock)
    let ageFactor = 1 + (ageVal * 0.015);
    
    // City risk factor
    let cityFactor = (city === 'mumbai' || city === 'delhi' || city === 'bangalore') ? 1.15 : 1.0;
    
    let basePremium = idvVal * baseRate * ageFactor * cityFactor;
    
    // Addons flat cost (mock)
    let addonsCost = 0;
    if (addonZeroDep) addonsCost += (type === 'car' ? 2500 : 800);
    if (addonEngine) addonsCost += (type === 'car' ? 1200 : 400);
    if (addonRsa) addonsCost += (type === 'car' ? 500 : 250);
    
    let totalPremium = Math.round(basePremium + addonsCost);
    
    // Add 18% GST mock
    totalPremium = Math.round(totalPremium * 1.18);
    
    // Format output
    premiumAmountEl.textContent = '₹' + totalPremium.toLocaleString('en-IN');
    
    // Show result block with smooth animation
    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  
  // Set default form values based on URL params (if navigated from plans)
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  if (plan) {
    if (plan.includes('bike')) {
      document.getElementById('calc-vehicle-type').value = 'bike';
    }
    if (plan.includes('zero')) {
      document.getElementById('addon-zero-dep').checked = true;
      document.getElementById('addon-engine').checked = true;
      document.getElementById('addon-rsa').checked = true;
    } else if (plan.includes('comp')) {
      document.getElementById('addon-rsa').checked = true;
    }
  }
});
