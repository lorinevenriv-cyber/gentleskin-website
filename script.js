// script.js

// === Smooth Scroll for Anchor Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// === Form Submission with Toast Notification and Redirect ===
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission (page reload)

    const formData = new FormData(form);
    let success = false;

    try {
      const response = await fetch(form.action, { // Use fetch API for async submission
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json' // Important for Formspree AJAX response
        }
      });
      success = response.ok; // true if HTTP status is 2xx

    } catch (error) {
      console.error('Submission error:', error);
      success = false;
    }

    // Create and display toast message
    const toast = document.createElement('div');
    toast.textContent = success ? "Message sent successfully!" : "Something went wrong. Please try again.";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "20px"; // Positioned on the bottom left
    toast.style.backgroundColor = "var(--pale-dogwood)"; // Uses CSS variable from style.css
    toast.style.color = "var(--text)"; // Uses CSS variable from style.css
    toast.style.padding = "10px 15px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    toast.style.zIndex = "1000"; // Ensure it's above other elements
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove(); // Remove toast after a delay
      if (success) {
        window.location.href = 'thanks.html'; // Redirect to the thank you page
      } else {
        form.reset(); // Only reset form if there was an error and no redirect
      }
    }, 3000); // Display toast for 3 seconds
  });
}

// === Booking Page Header Hide on Scroll Logic ===
const bookingHeader = document.querySelector('.booking-header');
let lastScrollY = window.scrollY; // Tracks the last scroll position

if (bookingHeader) { // Only run this logic if bookingHeader exists on the page
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down and scrolled past 100px from top
      bookingHeader.classList.add('header-hidden');
    } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
      // Scrolling up, or scrolled close to the top
      bookingHeader.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY; // Update last scroll position
  });
}

// script.js (add this new section at the very end of the file)

// === Price Calculation Logic for Booking Page ===
const primaryServiceSelect = document.getElementById('service');
const additionalServiceCheckboxes = document.querySelectorAll('.additional-services-group input[type="checkbox"]');
const totalPriceDisplay = document.getElementById('totalPrice');
const calculatedPriceInput = document.getElementById('calculatedPrice');

function calculateTotalPrice() {
  let total = 0;

  // Get price from primary service
  if (primaryServiceSelect && primaryServiceSelect.value) {
    total += parseFloat(primaryServiceSelect.value);
  }

  // Add prices from selected additional services
  additionalServiceCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      total += parseFloat(checkbox.value);
    }
  });

  // Update display and hidden input
  totalPriceDisplay.textContent = `R${total.toFixed(2)}`; // Format to 2 decimal places
  calculatedPriceInput.value = total.toFixed(2); // Store formatted total for submission
}

// Attach event listeners
if (primaryServiceSelect) {
  primaryServiceSelect.addEventListener('change', calculateTotalPrice);
}

if (additionalServiceCheckboxes.length > 0) {
  additionalServiceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculateTotalPrice);
  });
}

// Calculate initial total when the page loads
calculateTotalPrice();
