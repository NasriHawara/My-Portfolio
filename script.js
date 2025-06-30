document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn'); // Get the submit button
    const formMessage = document.getElementById('formMessage');

    const FUNCTION_URL = 'https://sendcontactemail-isefzrrlea-uc.a.run.app'; 
    // IMPORTANT: Make sure this is still your correct function URL!

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the browser from doing its default form submission

        // --- Start: Disable button and show loading ---
        submitBtn.disabled = true; // Disable the button
        submitBtn.textContent = 'Sending...'; // Change button text
        formMessage.style.display = 'none'; // Hide previous messages
        formMessage.className = '';
        formMessage.textContent = '';
        // --- End: Disable button and show loading ---

        const formData = new FormData(contactForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        try {
            const response = await fetch(FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.text();
                formMessage.textContent = result || 'Message sent successfully!';
                formMessage.style.backgroundColor = '#d4edda';
                formMessage.style.color = '#155724';
                contactForm.reset(); // Clear the form
            } else {
                const errorText = await response.text();
                formMessage.textContent = errorText || 'Failed to send message. Please try again.';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formMessage.textContent = 'Network error or server unreachable. Please try again later.';
            formMessage.style.backgroundColor = '#f8d7da';
            formMessage.style.color = '#721c24';
        } finally {
            // --- Start: Re-enable button and hide loading ---
            submitBtn.disabled = false; // Re-enable the button
            submitBtn.textContent = 'Submit Project Inquiry'; // Reset button text
            formMessage.style.display = 'block'; // Show the message div
            // --- End: Re-enable button and hide loading ---
        }
    });
});