/**
 * PADHO - Contact Form Module
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('padhoContactForm');
  const statusMsg = document.getElementById('contactStatusMsg');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || name.length < 2) {
      showError("Please enter your name.");
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      showError("Please enter a valid email address.");
    }
    if (!message || message.length < 10) {
      showError("Please enter a message of at least 10 characters.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> Sending Message...`;

      await PadhoData.submitContactMessage({ name, email, message });

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message`;

      if (statusMsg) {
        statusMsg.className = 'alert alert-success';
        statusMsg.style.display = 'block';
        statusMsg.textContent = "Thank you! Your message has been received by the PADHO team. We will review it shortly.";
      }

      window.showToast("Message submitted successfully!");
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message`;
      showError(err.message || "Failed to submit message. Please try again.");
    }
  });

  function showError(msg) {
    if (statusMsg) {
      statusMsg.className = 'alert alert-danger';
      statusMsg.style.display = 'block';
      statusMsg.textContent = msg;
    }
    window.showToast(msg, "error");
  }
});

