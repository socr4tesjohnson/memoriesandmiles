/**
 * Quote Wizard Logic
 * Multi-step form with conditional questions based on trip type
 *
 * SECURITY NOTE: The Web3Forms API key below should have domain restrictions
 * enabled in the Web3Forms dashboard to prevent unauthorized use.
 * Go to https://web3forms.com/ and enable domain restriction for your GitHub Pages domain.
 */

// State
let currentStep = 1;
let tripType = null;
const totalSteps = 3;

// DOM Elements
const form = document.getElementById('quote-wizard');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressFill = document.getElementById('progress-fill');
const successMessage = document.getElementById('success-message');
const confirmEmail = document.getElementById('confirm-email');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    prefillFromURL();
    updateProgress();
    attachEventListeners();
});

// Prefill form from URL parameters
function prefillFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');

    if (destination) {
        // Map destination values to tripType values
        const destinationMap = {
            'wdw': 'disney',
            'disneyland': 'disney',
            'royal-caribbean': 'royal-caribbean',
            'disney-cruise': 'disney-cruise',
            'universal': 'universal',
            'europe': 'europe',
            'river': 'river',
            'other': 'other'
        };

        const mappedTripType = destinationMap[destination];

        if (mappedTripType) {
            // Set the trip type
            tripType = mappedTripType;

            // Check the appropriate radio button
            const radioToCheck = document.querySelector(`input[name="tripType"][value="${mappedTripType}"]`);
            if (radioToCheck) {
                radioToCheck.checked = true;
                radioToCheck.closest('.trip-type-card').classList.add('selected');
            }

            // Pre-fill specific destination if Disney
            if (destination === 'wdw') {
                const wdwSelect = document.getElementById('disney-destination');
                if (wdwSelect) {
                    setTimeout(() => {
                        wdwSelect.value = 'wdw';
                    }, 100);
                }
            } else if (destination === 'disneyland') {
                const disneylandSelect = document.getElementById('disney-destination');
                if (disneylandSelect) {
                    setTimeout(() => {
                        disneylandSelect.value = 'disneyland';
                    }, 100);
                }
            }

            // Automatically advance to step 2 (details)
            currentStep = 2;
            updateWizard();
            updateProgress();
        }
    }
}

// Attach event listeners
function attachEventListeners() {
    // Trip type selection
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            tripType = e.target.value;
            // Add visual selection
            document.querySelectorAll('.trip-type-card').forEach(card => {
                card.classList.remove('selected');
            });
            e.target.closest('.trip-type-card').classList.add('selected');
        });
    });

    // Navigation buttons
    prevBtn.addEventListener('click', previousStep);
    nextBtn.addEventListener('click', nextStep);

    // Form submission
    form.addEventListener('submit', handleSubmit);
}

// Navigate to next step
function nextStep() {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }

    // Move to next step
    if (currentStep < totalSteps) {
        currentStep++;
        updateWizard();
    }
}

// Navigate to previous step
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateWizard();
    }
}

// Validate current step
function validateStep(step) {
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${step}"].active`);

    if (step === 1) {
        // Validate trip type selection
        if (!tripType) {
            // Show inline message instead of alert
            const tripTypeGrid = document.querySelector('.trip-type-grid');
            let errorMsg = tripTypeGrid?.previousElementSibling;
            if (!errorMsg?.classList.contains('step-error')) {
                errorMsg = document.createElement('p');
                errorMsg.className = 'step-error';
                errorMsg.setAttribute('role', 'alert');
                errorMsg.style.color = 'var(--warm-orange)';
                errorMsg.style.fontWeight = '600';
                errorMsg.style.marginBottom = '1rem';
                tripTypeGrid?.parentNode.insertBefore(errorMsg, tripTypeGrid);
            }
            errorMsg.textContent = 'Please select a trip type to continue.';
            return false;
        }
    }

    if (step === 3) {
        // Validate contact info
        const firstName = document.getElementById('contact-firstname').value.trim();
        const lastName = document.getElementById('contact-lastname').value.trim();
        const email = document.getElementById('contact-email').value.trim();

        // Clear previous errors
        clearErrors();

        let isValid = true;

        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        }

        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    return true;
}

// Update wizard display
function updateWizard() {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step (considering trip type)
    if (currentStep === 1) {
        // Step 1 has no trip type filter
        const step = document.querySelector(`.wizard-step[data-step="1"]`);
        if (step) step.classList.add('active');
    } else if (currentStep === 2 || currentStep === 3) {
        // Steps 2 and 3 are trip-type specific
        const step = document.querySelector(`.wizard-step[data-step="${currentStep}"][data-trip-type="${tripType}"]`);
        if (step) step.classList.add('active');
    } else {
        // Step 4 has no trip type filter
        const step = document.querySelector(`.wizard-step[data-step="${currentStep}"]:not([data-trip-type])`);
        if (step) step.classList.add('active');
    }

    // Update progress
    updateProgress();

    // Update navigation buttons
    updateButtons();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update progress bar and indicators
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Update button visibility
function updateButtons() {
    // Previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    // Next vs Submit button
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    // Validate final step
    if (!validateStep(currentStep)) {
        return;
    }

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Build email content
    let emailBody = `New Quote Request\n\n`;

    // Trip type title
    const tripTypeNames = {
        'disney': 'Disney Vacation',
        'royal-caribbean': 'Royal Caribbean Cruise',
        'disney-cruise': 'Disney Cruise Line',
        'universal': 'Universal Orlando',
        'europe': 'European Getaway',
        'river': 'River Cruise',
        'other': 'Custom Trip'
    };
    emailBody += `Trip Type: ${tripTypeNames[tripType] || 'Unknown'}\n\n`;

    if (tripType === 'disney') {
        emailBody += `DISNEY VACATION DETAILS:\n`;
        emailBody += `Destination: ${data.disneyDestination || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nDate Preferences:\n`;
        if (data.disneyDate1) emailBody += `  1st Choice: ${data.disneyDate1}\n`;
        if (data.disneyDate2) emailBody += `  2nd Choice: ${data.disneyDate2}\n`;
        if (data.disneyDate3) emailBody += `  3rd Choice: ${data.disneyDate3}\n`;
        if (!data.disneyDate1 && !data.disneyDate2 && !data.disneyDate3) emailBody += `  Not specified\n`;

        if (data.disneyDuration) emailBody += `Duration: ${data.disneyDuration} nights\n`;
        emailBody += `Adults: ${data.disneyAdults || '2'}\n`;
        emailBody += `Children: ${data.disneyChildren || '0'}\n`;
        if (data.disneyAges) emailBody += `Ages: ${data.disneyAges}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Resort: ${data.disneyResort || 'Not specified'}\n`;
        emailBody += `Tickets: ${data.disneyTickets || 'Not specified'}\n`;
        emailBody += `Dining Plan: ${data.disneyDining || 'Not specified'}\n`;
        if (data.disneySpecial) emailBody += `Special Requests: ${data.disneySpecial}\n`;
        if (data.disneyBudget) emailBody += `Budget: ${data.disneyBudget}\n`;
    } else if (tripType === 'royal-caribbean') {
        emailBody += `ROYAL CARIBBEAN CRUISE DETAILS:\n`;
        emailBody += `Region: ${data.cruiseDestination || 'Not specified'}\n`;
        emailBody += `Length: ${data.cruiseLength || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nSail Date Preferences:\n`;
        if (data.cruiseDate1) emailBody += `  1st Choice: ${data.cruiseDate1}\n`;
        if (data.cruiseDate2) emailBody += `  2nd Choice: ${data.cruiseDate2}\n`;
        if (data.cruiseDate3) emailBody += `  3rd Choice: ${data.cruiseDate3}\n`;
        if (!data.cruiseDate1 && !data.cruiseDate2 && !data.cruiseDate3) emailBody += `  Not specified\n`;

        emailBody += `Adults: ${data.cruiseAdults || '2'}\n`;
        emailBody += `Children: ${data.cruiseChildren || '0'}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Cabin: ${data.cruiseCabin || 'Not specified'}\n`;
        const rcInterests = formData.getAll('cruiseInterests');
        if (rcInterests.length > 0) {
            emailBody += `Interests: ${rcInterests.join(', ')}\n`;
        }
        if (data.cruiseSpecial) emailBody += `Special Requests: ${data.cruiseSpecial}\n`;
        if (data.cruiseBudget) emailBody += `Budget Per Person: ${data.cruiseBudget}\n`;
    } else if (tripType === 'disney-cruise') {
        emailBody += `DISNEY CRUISE LINE DETAILS:\n`;
        emailBody += `Region: ${data.disneyCruiseDestination || 'Not specified'}\n`;
        emailBody += `Length: ${data.disneyCruiseLength || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nSail Date Preferences:\n`;
        if (data.disneyCruiseDate1) emailBody += `  1st Choice: ${data.disneyCruiseDate1}\n`;
        if (data.disneyCruiseDate2) emailBody += `  2nd Choice: ${data.disneyCruiseDate2}\n`;
        if (data.disneyCruiseDate3) emailBody += `  3rd Choice: ${data.disneyCruiseDate3}\n`;
        if (!data.disneyCruiseDate1 && !data.disneyCruiseDate2 && !data.disneyCruiseDate3) emailBody += `  Not specified\n`;

        emailBody += `Adults: ${data.disneyCruiseAdults || '2'}\n`;
        emailBody += `Children: ${data.disneyCruiseChildren || '0'}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Cabin: ${data.disneyCruiseCabin || 'Not specified'}\n`;
        const dcInterests = formData.getAll('disneyCruiseInterests');
        if (dcInterests.length > 0) {
            emailBody += `Interests: ${dcInterests.join(', ')}\n`;
        }
        if (data.disneyCruiseSpecial) emailBody += `Special Requests: ${data.disneyCruiseSpecial}\n`;
        if (data.disneyCruiseBudget) emailBody += `Budget Per Person: ${data.disneyCruiseBudget}\n`;
    } else if (tripType === 'universal') {
        emailBody += `UNIVERSAL ORLANDO DETAILS:\n`;

        // Multiple date options
        emailBody += `Date Preferences:\n`;
        if (data.universalDate1) emailBody += `  1st Choice: ${data.universalDate1}\n`;
        if (data.universalDate2) emailBody += `  2nd Choice: ${data.universalDate2}\n`;
        if (data.universalDate3) emailBody += `  3rd Choice: ${data.universalDate3}\n`;
        if (!data.universalDate1 && !data.universalDate2 && !data.universalDate3) emailBody += `  Not specified\n`;

        if (data.universalDuration) emailBody += `Duration: ${data.universalDuration} nights\n`;
        emailBody += `Adults: ${data.universalAdults || '2'}\n`;
        emailBody += `Children: ${data.universalChildren || '0'}\n`;
        if (data.universalAges) emailBody += `Ages: ${data.universalAges}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Hotel: ${data.universalHotel || 'Not specified'}\n`;
        emailBody += `Tickets: ${data.universalTickets || 'Not specified'}\n`;
        if (data.universalSpecial) emailBody += `Special Requests: ${data.universalSpecial}\n`;
        if (data.universalBudget) emailBody += `Budget: ${data.universalBudget}\n`;
    } else if (tripType === 'europe') {
        emailBody += `EUROPEAN GETAWAY DETAILS:\n`;
        emailBody += `Countries: ${data.europeCountries || 'Not specified'}\n`;
        emailBody += `Cities/Regions: ${data.europeCities || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nDate Preferences:\n`;
        if (data.europeDate1) emailBody += `  1st Choice: ${data.europeDate1}\n`;
        if (data.europeDate2) emailBody += `  2nd Choice: ${data.europeDate2}\n`;
        if (data.europeDate3) emailBody += `  3rd Choice: ${data.europeDate3}\n`;
        if (!data.europeDate1 && !data.europeDate2 && !data.europeDate3) emailBody += `  Not specified\n`;

        emailBody += `Duration: ${data.europeDuration || 'Not specified'}\n`;
        emailBody += `Adults: ${data.europeAdults || '2'}\n`;
        emailBody += `Children: ${data.europeChildren || '0'}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Travel Style: ${data.europeStyle || 'Not specified'}\n`;
        const europeInterests = formData.getAll('europeInterests');
        if (europeInterests.length > 0) {
            emailBody += `Interests: ${europeInterests.join(', ')}\n`;
        }
        emailBody += `Accommodation: ${data.europeAccommodation || 'Not specified'}\n`;
        if (data.europeSpecial) emailBody += `Special Requests: ${data.europeSpecial}\n`;
        if (data.europeBudget) emailBody += `Budget Per Person: ${data.europeBudget}\n`;
    } else if (tripType === 'river') {
        emailBody += `RIVER CRUISE DETAILS:\n`;
        emailBody += `Region: ${data.riverRegion || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nSail Date Preferences:\n`;
        if (data.riverDate1) emailBody += `  1st Choice: ${data.riverDate1}\n`;
        if (data.riverDate2) emailBody += `  2nd Choice: ${data.riverDate2}\n`;
        if (data.riverDate3) emailBody += `  3rd Choice: ${data.riverDate3}\n`;
        if (!data.riverDate1 && !data.riverDate2 && !data.riverDate3) emailBody += `  Not specified\n`;

        emailBody += `Adults: ${data.riverAdults || '2'}\n`;
        emailBody += `Children: ${data.riverChildren || '0'}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Cabin: ${data.riverCabin || 'Not specified'}\n`;
        if (data.riverSpecial) emailBody += `Special Requests: ${data.riverSpecial}\n`;
        if (data.riverBudget) emailBody += `Budget Per Person: ${data.riverBudget}\n`;
    } else if (tripType === 'other') {
        emailBody += `CUSTOM TRIP DETAILS:\n`;
        emailBody += `Destination: ${data.otherDestination || 'Not specified'}\n`;

        // Multiple date options
        emailBody += `\nDate Preferences:\n`;
        if (data.otherDate1) emailBody += `  1st Choice: ${data.otherDate1}\n`;
        if (data.otherDate2) emailBody += `  2nd Choice: ${data.otherDate2}\n`;
        if (data.otherDate3) emailBody += `  3rd Choice: ${data.otherDate3}\n`;
        if (!data.otherDate1 && !data.otherDate2 && !data.otherDate3) emailBody += `  Not specified\n`;

        emailBody += `Duration: ${data.otherDuration || 'Not specified'}\n`;
        emailBody += `Adults: ${data.otherAdults || '2'}\n`;
        emailBody += `Children: ${data.otherChildren || '0'}\n`;
        if (data.otherDetails) emailBody += `\nDetails:\n${data.otherDetails}\n`;
        emailBody += `\nPREFERENCES:\n`;
        emailBody += `Accommodation: ${data.otherAccommodation || 'Not specified'}\n`;
        if (data.otherSpecial) emailBody += `Special Requests: ${data.otherSpecial}\n`;
        if (data.otherBudget) emailBody += `Budget: ${data.otherBudget}\n`;
    }

    emailBody += `\nCONTACT INFORMATION:\n`;
    emailBody += `Name: ${data.firstName} ${data.lastName}\n`;
    emailBody += `Email: ${data.email}\n`;
    if (data.phone) emailBody += `Phone: ${data.phone}\n`;
    if (data.hearAbout) emailBody += `Referred by: ${data.hearAbout}\n`;
    if (data.additionalNotes) emailBody += `\nAdditional Notes:\n${data.additionalNotes}\n`;

    // Prepare form data for Web3Forms
    const submitData = new FormData();
    submitData.append('access_key', '3134483b-ece1-4cf6-9e03-307a6079e838');
    submitData.append('subject', `Quote Request from ${data.firstName} ${data.lastName}`);
    submitData.append('from_name', `${data.firstName} ${data.lastName}`);
    submitData.append('email', data.email);
    submitData.append('message', emailBody);
    if (data.phone) submitData.append('phone', data.phone);

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: submitData
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            form.style.display = 'none';
            document.querySelector('.wizard-progress').style.display = 'none';
            document.querySelector('.wizard-navigation').style.display = 'none';
            successMessage.classList.remove('hidden');
            confirmEmail.textContent = data.email;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Quote submission error:', error);

        // Remove any existing error banner
        const existingError = document.querySelector('.form-error-banner');
        if (existingError) existingError.remove();

        // Create error banner (no alert())
        const errorBanner = document.createElement('div');
        errorBanner.className = 'form-error-banner';
        errorBanner.setAttribute('role', 'alert');
        errorBanner.innerHTML = `
            <p><strong>Oops!</strong> We couldn't send your quote request.</p>
            <p>Please try again or email us directly at <a href="mailto:laura@whitneyworldtravel.com">laura@whitneyworldtravel.com</a></p>
        `;

        const wizardCard = document.querySelector('.wizard-card');
        if (wizardCard) {
            wizardCard.insertBefore(errorBanner, wizardCard.firstChild);
        }

        submitBtn.textContent = 'Request Quote';
        submitBtn.disabled = false;
    }
}

// Email validation - requires 2+ character TLD
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Show error message
function showError(fieldName, message) {
    const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }

    const inputElement = document.getElementById(`contact-${fieldName}`);
    if (inputElement) {
        inputElement.style.borderColor = 'var(--sunset-coral)';
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('active');
    });

    document.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
    });
}
