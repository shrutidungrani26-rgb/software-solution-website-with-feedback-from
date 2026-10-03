/**
 * ==========================================================================
 * Project: Software Solutions Website
 * Subject: SYBCA AI Practical / Journal Submission
 * Author: Student Project
 * File: script.js - Client-Side Interactive Logic & Validation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive website components
  initMobileNav();
  initContactForm();
  initFeedbackForm();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation Hamburger Menu
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (!navToggle || !navMenu) return;

  // Toggle mobile menu visibility
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const isExpanded = navMenu.classList.contains('show');
    navToggle.setAttribute('aria-expanded', isExpanded);

    // Toggle icon between hamburger and close icon
    const icon = navToggle.querySelector('i');
    if (icon) {
      if (isExpanded) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close menu when clicking on any navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });

  // Close menu if user clicks outside the navigation container
  document.addEventListener('click', (event) => {
    if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('show');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. Helper Validation Functions
   -------------------------------------------------------------------------- */
// Validate email address format using standard regular expression
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Show error on input field
function setFieldError(inputElement, errorElement, message) {
  if (inputElement) inputElement.classList.add('is-invalid');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Clear error on input field
function clearFieldError(inputElement, errorElement) {
  if (inputElement) inputElement.classList.remove('is-invalid');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

/* --------------------------------------------------------------------------
   3. Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const successAlert = document.getElementById('contactSuccessAlert');

  // Clear errors dynamically on input
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        const errorElem = document.getElementById(input.id + 'Error');
        clearFieldError(input, errorElem);
      });
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    let isValid = true;

    // Validate Full Name
    const nameError = document.getElementById('contactNameError');
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, nameError, 'Please enter your full name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, nameError, 'Name must be at least 2 characters long.');
      isValid = false;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // Validate Email Address
    const emailError = document.getElementById('contactEmailError');
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address (e.g. user@example.com).');
      isValid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // Validate Subject
    const subjectError = document.getElementById('contactSubjectError');
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, subjectError, 'Please enter a subject.');
      isValid = false;
    } else {
      clearFieldError(subjectInput, subjectError);
    }

    // Validate Message
    const messageError = document.getElementById('contactMessageError');
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, messageError, 'Please write your message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, messageError, 'Message must be at least 10 characters long.');
      isValid = false;
    } else {
      clearFieldError(messageInput, messageError);
    }

    // If all fields are valid, show success message
    if (isValid) {
      if (successAlert) {
        successAlert.innerHTML = `
          <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
          <div>
            <strong>Thank you, ${nameInput.value.trim()}!</strong>
            <p>Your message has been sent successfully. We will get back to you shortly.</p>
          </div>
        `;
        successAlert.classList.add('show');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form fields
      contactForm.reset();

      // Auto-hide success alert after 8 seconds
      setTimeout(() => {
        if (successAlert) successAlert.classList.remove('show');
      }, 8000);
    }
  });
}

/* --------------------------------------------------------------------------
   4. Feedback Form & 5-Star Rating System
   -------------------------------------------------------------------------- */
function initFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  if (!feedbackForm) return;

  const nameInput = document.getElementById('feedbackName');
  const emailInput = document.getElementById('feedbackEmail');
  const messageInput = document.getElementById('feedbackMessage');
  const ratingValueInput = document.getElementById('ratingValue');
  const ratingText = document.getElementById('ratingText');
  const ratingError = document.getElementById('ratingError');
  const stars = document.querySelectorAll('.star-rating .star');
  const successAlert = document.getElementById('feedbackSuccessAlert');

  let selectedRating = 0;

  const ratingDescriptions = {
    1: '1 Star - Poor',
    2: '2 Stars - Fair',
    3: '3 Stars - Good',
    4: '4 Stars - Very Good',
    5: '5 Stars - Excellent'
  };

  // Helper function to render active state of stars
  function highlightStars(rating) {
    stars.forEach((star) => {
      const starVal = parseInt(star.getAttribute('data-value'), 10);
      if (starVal <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  // Star Rating Interaction (Hover, Click, Keyboard)
  stars.forEach((star) => {
    // Hover effect
    star.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(star.getAttribute('data-value'), 10);
      stars.forEach((s) => {
        const sVal = parseInt(s.getAttribute('data-value'), 10);
        if (sVal <= hoverVal) {
          s.classList.add('hovered');
        } else {
          s.classList.remove('hovered');
        }
      });
      if (ratingText) {
        ratingText.textContent = ratingDescriptions[hoverVal] || '';
      }
    });

    // Mouse leave rating container
    star.parentElement.addEventListener('mouseleave', () => {
      stars.forEach((s) => s.classList.remove('hovered'));
      highlightStars(selectedRating);
      if (ratingText) {
        ratingText.textContent = selectedRating > 0 ? ratingDescriptions[selectedRating] : 'Select a rating (1 to 5 stars)';
      }
    });

    // Click event to select star rating
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'), 10);
      if (ratingValueInput) ratingValueInput.value = selectedRating;
      highlightStars(selectedRating);
      if (ratingText) {
        ratingText.textContent = ratingDescriptions[selectedRating];
      }
      if (ratingError) {
        ratingError.classList.remove('show');
      }
    });
  });

  // Clear input errors on input
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        const errorElem = document.getElementById(input.id + 'Error');
        clearFieldError(input, errorElem);
      });
    }
  });

  // Feedback Form Submit Handler
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    let isValid = true;

    // 1. Check that Name is not empty
    const nameError = document.getElementById('feedbackNameError');
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, nameError, 'Please enter your full name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, nameError, 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // 2. Check that Email is valid
    const emailError = document.getElementById('feedbackEmailError');
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // 3. Check that a rating is selected
    if (selectedRating === 0 || !ratingValueInput.value) {
      if (ratingError) {
        ratingError.textContent = 'Please select a star rating (1 to 5 stars).';
        ratingError.classList.add('show');
      }
      isValid = false;
    } else {
      if (ratingError) {
        ratingError.textContent = '';
        ratingError.classList.remove('show');
      }
    }

    // 4. Check that feedback message is not empty
    const messageError = document.getElementById('feedbackMessageError');
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, messageError, 'Please enter your feedback message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 5) {
      setFieldError(messageInput, messageError, 'Feedback message must be at least 5 characters.');
      isValid = false;
    } else {
      clearFieldError(messageInput, messageError);
    }

    // 5 & 6. If everything is valid, show success message
    if (isValid) {
      const submittedName = nameInput.value.trim();
      const starsDisplay = '★'.repeat(selectedRating);

      if (successAlert) {
        successAlert.innerHTML = `
          <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; color: #10b981;"></i>
          <div>
            <strong>Thank you for your valuable feedback!</strong>
            <p>Dear <strong>${submittedName}</strong>, your <strong>${selectedRating}-Star (${starsDisplay})</strong> rating and comments have been recorded successfully.</p>
          </div>
        `;
        successAlert.classList.add('show');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // 7. Clear/reset the form after successful submission
      feedbackForm.reset();
      selectedRating = 0;
      if (ratingValueInput) ratingValueInput.value = '';
      highlightStars(0);
      if (ratingText) {
        ratingText.textContent = 'Select a rating (1 to 5 stars)';
      }

      // Auto-hide alert after 8 seconds
      setTimeout(() => {
        if (successAlert) successAlert.classList.remove('show');
      }, 8000);
    }
  });
}

/* --------------------------------------------------------------------------
   5. Dynamic Copyright Year
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
