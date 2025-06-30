// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

// Import the Firebase Firestore SDK (including getFirestore, collection, addDoc)
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATQXVTgxzEZQ7tbTK5296qSE0tOvDfl4s",
  authDomain: "my-portfolio-df491.firebaseapp.com",
  projectId: "my-portfolio-df491",
  storageBucket: "my-portfolio-df491.firebasestorage.app",
  messagingSenderId: "186289262050",
  appId: "1:186289262050:web:42dc353133c14d6bf4bdbb",
  measurementId: "G-N0ZLF59QZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
/*const analytics = getAnalytics(app);*/







// --- START OF NEW FORM SUBMISSION LOGIC ---

// 4. Get references to your HTML elements (form and message display area)
const projectForm = document.getElementById('projectForm'); // Ensure your form in HTML has id="projectForm"
const formMessages = document.getElementById('formMessages'); // Ensure your HTML has a div with id="formMessages"
const submitBtn = document.getElementById('submitBtn'); // <-- ADD THIS NEW LINE

// 5. Add an event listener for form submission
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Clear any previous messages
    formMessages.textContent = '';
    formMessages.style.color = '';


    submitBtn.disabled = true; // Disable the button so it can't be clicked again
submitBtn.textContent = 'Sending...'; // Change the text on the button
formMessages.textContent = 'Sending your inquiry...'; // Show a loading message
formMessages.style.color = 'orange'; // Change message color for "sending"




    // 6. Collect form data into an object
    const formData = {
        name: projectForm.name.value,
        email: projectForm.email.value,
        projectType: projectForm.projectType.value,
        budget: projectForm.budget.value,
        timeline: projectForm.timeline.value,
        message: projectForm.message.value,
        timestamp: new Date() // Add a timestamp for when the form was submitted
    };

    // Basic client-side validation (optional, but good practice)
    if (!formData.name || !formData.email || !formData.message) {
        formMessages.textContent = 'Please fill in all required fields (Name, Email, Message).';
        formMessages.style.color = 'red';

            submitBtn.disabled = false; // Re-enable button
    submitBtn.textContent = 'Submit Project Inquiry'; // Reset button text
    // --- END OF NEW LINES ---

        return; // Stop the function if validation fails
    }

    // 7. Send data to Firestore
    try {
        // 'collection' specifies which collection to add data to (e.g., 'project-inquiries')
        // 'addDoc' adds a new document with an auto-generated ID
        const docRef = await addDoc(collection(db, "project-inquiries"), formData);
        console.log("Document written with ID: ", docRef.id);

        formMessages.textContent = 'Thank you! Your inquiry has been sent successfully.';
        formMessages.style.color = 'green';

        projectForm.reset(); // Clear the form fields after successful submission

    } catch (e) {
        console.error("Error adding document: ", e);
        formMessages.textContent = 'Oops! There was an error sending your message. Please try again later.';
        formMessages.style.color = 'red';


          submitBtn.disabled = false; // Re-enable button
    submitBtn.textContent = 'Submit Project Inquiry'; // Reset button text



    }
});