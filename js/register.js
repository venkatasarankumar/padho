/**
 * PADHO - Student Registration Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const passInput = document.getElementById('regPassword');
  const confirmInput = document.getElementById('regConfirmPassword');
  const termsCheck = document.getElementById('regTerms');
  const submitBtn = document.getElementById('registerSubmitBtn');
  const alertBox = document.getElementById('registerAlertBox');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (alertBox) alertBox.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const confirm = confirmInput.value;

    if (name.length < 2) {
      showError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      showError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!termsCheck.checked) {
      showError("Please accept the terms to proceed.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> Creating account...`;

      await PadhoAuth.registerStudent(name, email, password);

      window.showToast("Account created successfully! Welcome to PADHO.");
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Complete Registration`;
      showError(err.message);
    }
  });

  function showError(msg) {
    if (alertBox) {
      alertBox.textContent = msg;
      alertBox.style.display = 'block';
    }
    window.showToast(msg, "error");
  }
});

