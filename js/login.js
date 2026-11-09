/**
 * PADHO - Login Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const togglePassBtn = document.getElementById('togglePasswordBtn');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const alertBox = document.getElementById('loginAlertBox');

  if (!form) return;

  // Toggle password visibility
  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      togglePassBtn.innerHTML = isPass 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (alertBox) alertBox.style.display = 'none';

    const email = emailInput.value.trim();
    const password = passInput.value;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> Signing in...`;

      const user = await PadhoAuth.login(email, password);

      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');

      if (user.role === 'admin') {
        window.location.href = returnUrl || 'admin/dashboard.html';
      } else {
        window.location.href = returnUrl || 'dashboard.html';
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Sign In to PADHO`;
      if (alertBox) {
        alertBox.textContent = err.message;
        alertBox.style.display = 'block';
      }
      window.showToast(err.message, "error");
    }
  });

  // Forgot password modal
  const forgotBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotModal');
  const closeForgot = document.getElementById('closeForgotModal');
  const forgotForm = document.getElementById('forgotPasswordForm');

  if (forgotBtn && forgotModal) {
    forgotBtn.addEventListener('click', () => forgotModal.classList.add('open'));
  }
  if (closeForgot && forgotModal) {
    closeForgot.addEventListener('click', () => forgotModal.classList.remove('open'));
  }
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById('resetEmail').value.trim();
      try {
        const res = await PadhoAuth.requestPasswordReset(resetEmail);
        forgotModal.classList.remove('open');
        window.showToast(res.message);
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

