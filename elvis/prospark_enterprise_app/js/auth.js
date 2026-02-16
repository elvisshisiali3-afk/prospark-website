/**
 * PROSPARK CLEANING HUB - AUTHENTICATION MODULE
 * User Authentication & Account Management
 */

class AuthManager {
  constructor() {
    this.mockUsers = [
      {
        id: 'USR-001',
        email: 'elvis@prospark.ke',
        password: 'password123',
        name: 'Elvis Shisiali',
        phone: '0799802509',
        role: 'admin',
        created: new Date('2024-01-01')
      },
      {
        id: 'USR-002',
        email: 'bernard@prospark.ke',
        password: 'password123',
        name: 'Bernard Keragu',
        phone: '0741156566',
        role: 'admin',
        created: new Date('2024-01-01')
      },
      {
        id: 'USR-003',
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '0700000000',
        role: 'customer',
        created: new Date('2024-06-15'),
        address: 'Karen, Nairobi',
        loyaltyPoints: 250
      }
    ];
    
    this.loadUsers();
    this.setupFormListeners();
  }

  /**
   * Load users from localStorage
   */
  loadUsers() {
    const stored = localStorage.getItem('prospark_users');
    if (stored) {
      this.mockUsers = JSON.parse(stored);
    } else {
      this.saveUsers();
    }
  }

  /**
   * Save users to localStorage
   */
  saveUsers() {
    localStorage.setItem('prospark_users', JSON.stringify(this.mockUsers));
  }

  /**
   * Setup form event listeners
   */
  setupFormListeners() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
  }

  /**
   * Login Handler
   */
  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    const rememberMe = document.getElementById('remember-me')?.checked;

    if (!email || !password) {
      app.showAlert('Please fill in all fields', 'warning');
      return;
    }

    if (!app.validateEmail(email)) {
      app.showAlert('Invalid email format', 'danger');
      return;
    }

    const result = this.login(email, password);
    
    if (result.success) {
      app.showAlert(app.translate('success.login'), 'success');
      
      if (rememberMe) {
        localStorage.setItem('prospark_remember_email', email);
      }

      setTimeout(() => {
        const user = result.user;
        if (user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 1500);
    } else {
      app.showAlert(result.message, 'danger');
    }
  }

  /**
   * Signup Handler
   */
  async handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const phone = document.getElementById('signup-phone')?.value;
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value;
    const address = document.getElementById('signup-address')?.value;
    const agreeTerms = document.getElementById('agree-terms')?.checked;

    if (!name || !email || !phone || !password || !confirmPassword) {
      app.showAlert('Please fill in all required fields', 'warning');
      return;
    }

    if (!app.validateEmail(email)) {
      app.showAlert('Invalid email format', 'danger');
      return;
    }

    if (!app.validatePhone(phone)) {
      app.showAlert('Invalid phone format', 'danger');
      return;
    }

    if (!app.validatePassword(password)) {
      app.showAlert('Password must be at least 8 characters long', 'danger');
      return;
    }

    if (password !== confirmPassword) {
      app.showAlert('Passwords do not match', 'danger');
      return;
    }

    if (!agreeTerms) {
      app.showAlert('You must agree to the terms and conditions', 'warning');
      return;
    }

    const result = this.signup({
      name,
      email,
      phone,
      password,
      address
    });

    if (result.success) {
      app.showAlert('Account created successfully! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      app.showAlert(result.message, 'danger');
    }
  }

  /**
   * Login Logic
   */
  login(email, password) {
    const user = this.mockUsers.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        message: app.translate('error.login')
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: app.translate('error.login')
      };
    }

    // Set authenticated user
    app.setUser({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints || 0
    });

    app.updateUIForUser();

    return {
      success: true,
      user: app.user,
      message: 'Login successful'
    };
  }

  /**
   * Signup Logic
   */
  signup(data) {
    // Check if email already exists
    if (this.mockUsers.find(u => u.email === data.email)) {
      return {
        success: false,
        message: 'Email already exists'
      };
    }

    // Create new user
    const newUser = {
      id: app.generateId(),
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      address: data.address,
      role: 'customer',
      created: new Date(),
      loyaltyPoints: 0
    };

    this.mockUsers.push(newUser);
    this.saveUsers();

    return {
      success: true,
      user: newUser,
      message: 'Account created successfully'
    };
  }

  /**
   * Logout
   */
  logout() {
    app.clearUser();
    app.updateUIForUser();
    window.location.href = 'index.html';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return app.user !== null;
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return app.user?.role === 'admin';
  }

  /**
   * Require authentication (redirect to login if not authenticated)
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }

  /**
   * Require admin (redirect if not admin)
   */
  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.href = 'dashboard.html';
      app.showAlert('Admin access required', 'danger');
    }
  }

  /**
   * Update user profile
   */
  updateProfile(updates) {
    const userIndex = this.mockUsers.findIndex(u => u.id === app.user.id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...updates };
      this.saveUsers();
      
      app.user = { ...app.user, ...updates };
      app.setUser(app.user);
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    }

    return {
      success: false,
      message: 'User not found'
    };
  }

  /**
   * Change password
   */
  changePassword(oldPassword, newPassword) {
    const user = this.mockUsers.find(u => u.id === app.user.id);

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (user.password !== oldPassword) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    if (!app.validatePassword(newPassword)) {
      return {
        success: false,
        message: 'New password must be at least 8 characters'
      };
    }

    user.password = newPassword;
    this.saveUsers();

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    return this.mockUsers.find(u => u.id === userId);
  }

  /**
   * Get all customers
   */
  getAllCustomers() {
    return this.mockUsers.filter(u => u.role === 'customer');
  }

  /**
   * Get all staff
   */
  getAllStaff() {
    return this.mockUsers.filter(u => u.role === 'staff');
  }

  /**
   * Add staff
   */
  addStaff(data) {
    const newStaff = {
      id: app.generateId(),
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: 'staff',
      created: new Date(),
      specialization: data.specialization,
      rating: 5,
      completedJobs: 0,
      availability: data.availability || true
    };

    this.mockUsers.push(newStaff);
    this.saveUsers();

    return {
      success: true,
      user: newStaff
    };
  }

  /**
   * Pre-fill remember email
   */
  preFillRememberedEmail() {
    const remembered = localStorage.getItem('prospark_remember_email');
    const emailInput = document.getElementById('login-email');
    if (remembered && emailInput) {
      emailInput.value = remembered;
    }
  }
}

// Initialize auth manager
const auth = new AuthManager();

// Pre-fill remembered email on login page
if (document.getElementById('login-form')) {
  auth.preFillRememberedEmail();
}
