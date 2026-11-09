/**
 * PADHO - Authentication Service & User State Manager
 * 
 * Manages Student and Admin authentication, profile states,
 * password validation, and role-based route protection.
 */

// User storage keys
const USER_SESSION_KEY = 'padho_auth_user';
const USERS_DB_KEY = 'padho_registered_users';

// Seed initial verified admin account if not already in local database
function ensureInitialAdmin() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    let users = raw ? JSON.parse(raw) : [];
    const hasAdmin = users.some(u => u.role === 'admin');
    if (!hasAdmin) {
      // Secure provisioned administrator (never provisioned via public register form)
      users.push({
        uid: 'admin_master_1',
        name: 'Administrator',
        email: 'admin@padho.org',
        passwordHash: 'admin123', // In real Firebase Auth, stored in Google Cloud Auth
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  } catch (e) {
    console.warn("Could not check initial admin:", e);
  }
}
ensureInitialAdmin();

window.PadhoAuth = {
  // Get active session
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const u = this.getCurrentUser();
    return u !== null && u.role === 'admin';
  },

  // Student Registration (Only creates 'student' role, never 'admin')
  async registerStudent(name, email, password) {
    if (!name || name.trim().length < 2) {
      throw new Error("Please enter your complete name.");
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error("Please provide a valid email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Check existing
    let users = [];
    try {
      const raw = localStorage.getItem(USERS_DB_KEY);
      users = raw ? JSON.parse(raw) : [];
    } catch (e) { users = []; }

    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error("An account with this email address already exists. Please log in.");
    }

    const newUser = {
      uid: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      email: cleanEmail,
      passwordHash: password, // In live Firebase, managed securely via Firebase Auth createUserWithEmailAndPassword
      role: 'student',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    // Auto sign-in new student
    const sessionUser = {
      uid: newUser.uid,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Login (Authenticates students and provisioned administrators)
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please provide both email and password.");
    }

    const cleanEmail = email.toLowerCase().trim();

    let users = [];
    try {
      const raw = localStorage.getItem(USERS_DB_KEY);
      users = raw ? JSON.parse(raw) : [];
    } catch (e) { users = []; }

    const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      throw new Error("No account found with this email. Please check your credentials or register.");
    }

    if (matched.passwordHash !== password) {
      throw new Error("Incorrect password. Please verify and try again.");
    }

    const sessionUser = {
      uid: matched.uid,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      createdAt: matched.createdAt
    };

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Logout
  async logout() {
    localStorage.removeItem(USER_SESSION_KEY);
    // Redirect cleanly depending on current location
    const isInAdmin = window.location.pathname.includes('/admin/');
    if (isInAdmin) {
      window.location.href = '../login.html';
    } else {
      window.location.href = 'login.html';
    }
  },

  // Password reset request
  async requestPasswordReset(email) {
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address to receive password reset instructions.");
    }
    // Simulation / Firebase sendPasswordResetEmail hook
    return { success: true, message: `Password reset link sent to ${email}. Please check your inbox.` };
  },

  // Route Protection: Student Guard
  requireAuth(redirectUrl = 'login.html') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectUrl + '?returnUrl=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  },

  // Route Protection: Admin Guard
  requireAdmin(redirectUrl = '../login.html') {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      alert("Access restricted. Administrator authorization required.");
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  },

  // Dynamic Navigation Auth Section Renderer
  renderNav() {
    const container = document.getElementById('navAuthSection');
    if (!container) return;

    const user = this.getCurrentUser();
    const isInAdmin = window.location.pathname.includes('/admin/');
    const basePath = isInAdmin ? '../' : '';

    if (!user) {
      container.innerHTML = `
        <div class="auth-buttons-desktop flex items-center gap-sm">
          <a href="${basePath}login.html" class="btn btn-outline btn-sm">Log In</a>
          <a href="${basePath}register.html" class="btn btn-primary btn-sm">Register Free</a>
        </div>
      `;
    } else {
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      const isAdminUser = user.role === 'admin';

      container.innerHTML = `
        <div class="user-menu-wrap">
          <button type="button" class="user-avatar-btn" id="userMenuToggle" aria-label="Open User Menu">
            <span class="avatar-circle">${initial}</span>
            <span style="font-size:0.85rem; font-weight:600; color:var(--brand-primary);">${user.name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <div class="user-dropdown" id="userDropdownMenu">
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${user.name}</div>
              <div class="user-dropdown-email">${user.email}</div>
              <span class="badge ${isAdminUser ? 'badge-gold' : 'badge-emerald'}" style="margin-top:4px;">${isAdminUser ? 'Admin' : 'Student'}</span>
            </div>
            ${!isAdminUser ? `
              <a href="${basePath}dashboard.html">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Student Dashboard
              </a>
              <a href="${basePath}saved-resources.html">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Saved Resources
              </a>
            ` : `
              <a href="${basePath}admin/dashboard.html">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Admin Panel
              </a>
            `}
            <button type="button" id="navLogoutBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      `;

      // Event listener for user dropdown toggle
      const toggle = document.getElementById('userMenuToggle');
      const menu = document.getElementById('userDropdownMenu');
      if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        });
        document.addEventListener('click', () => {
          menu.classList.remove('show');
        });
      }

      // Logout handler
      const logoutBtn = document.getElementById('navLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          PadhoAuth.logout();
        });
      }
    }
  }
};

// Initialize nav on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  PadhoAuth.renderNav();
});

