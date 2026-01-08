/**
 * Contact Form Validation and Mailto Integration
 * Handles form validation and email client launch
 */

const contactForm = document.getElementById('contact-form');

// Email validation regex
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Show error message
const showError = (fieldName, message) => {
    const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }

    const inputElement = document.getElementById(fieldName);
    if (inputElement) {
        inputElement.style.borderColor = 'var(--sunset-coral)';
    }
};

// Clear error message
const clearError = (fieldName) => {
    const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
    if (errorElement) {
        errorElement.classList.remove('active');
    }

    const inputElement = document.getElementById(fieldName);
    if (inputElement) {
        inputElement.style.borderColor = 'var(--gray-100)';
    }
};

// Real-time validation - clear errors on input
['name', 'email', 'message'].forEach(field => {
    const input = document.getElementById(field);
    if (input) {
        input.addEventListener('input', () => clearError(field));
    }
});

// Form submission handler
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = new FormData(contactForm);

    // Validate name
    const name = formData.get('name')?.trim();
    if (!name) {
        showError('name', 'Please enter your name');
        isValid = false;
    }

    // Validate email
    const email = formData.get('email')?.trim();
    if (!email) {
        showError('email', 'Please enter your email');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate message
    const message = formData.get('message')?.trim();
    if (!message) {
        showError('message', 'Please enter a message');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    // If validation fails, stop here
    if (!isValid) return;

    // Prepare form data for Web3Forms
    const submitData = new FormData();
    submitData.append('access_key', '3134483b-ece1-4cf6-9e03-307a6079e838');
    submitData.append('subject', `Travel Inquiry from ${name}`);
    submitData.append('from_name', name);
    submitData.append('email', email);
    submitData.append('message', message);

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Submit to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: submitData
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            contactForm.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting us! We'll get back to you within 24 hours at <strong>${email}</strong></p>
                    <a href="contact.html" class="btn btn-secondary" style="margin-top: 1rem;">Send Another Message</a>
                </div>
            `;
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        // Show error message
        alert('There was an error sending your message. Please try again or email us directly at laura@whitneyworldtravel.com');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});
