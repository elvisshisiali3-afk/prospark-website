/**
 * PROSPARK ENTERPRISE - AUTHENTICATION & SECURITY MODULE
 * Enhanced authentication with 2FA, roles, and security features
 */

class EnterpriseAuth {
  constructor() {
    this.currentUser = null;
    this.sessions = [];
    this.securityEvents = [];
    this.init();
  }

  /**
   * Initialize auth module
   */
  init() {
    this.loadStoredData();
    this.setupSecurityListeners();
  }

  /**
   * Load stored data
   */
  loadStoredData() {
    const storedUser = localStorage.getItem('prospark_current_user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    
    const storedSessions = localStorage.getItem('prospark_sessions');
    if (storedSessions) {
      this.sessions = JSON.parse(storedSessions);
    }
    
    const storedEvents = localStorage.getItem('prospark_security_events');
    if (storedEvents) {
      this.securityEvents = JSON.parse(storedEvents);
    }
  }

  /**
   * Save data to storage
   */
  saveData() {
    localStorage.setItem('prospark_current_user', JSON.stringify(this.currentUser));
    localStorage.setItem('prospark_sessions', JSON.stringify(this.sessions));
    localStorage.setItem('prospark_security_events', JSON.stringify(this.securityEvents));
  }

  /**
   * Get all users
   */
  getAllUsers() {
    const stored = localStorage.getItem('prospark_users');
    return stored ? JSON.parse(stored) : this.getDefaultUsers();
  }

  /**
   * Get default enterprise users
   */
  getDefaultUsers() {
    return [
      {
        id: 'USR-001',
        email: 'elvis@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'Elvis Shisiali',
        phone: '0799802509',
        role: 'ceo',
        department: 'Executive',
        avatar: null,
        created: new Date('2024-01-01'),
        lastLogin: new Date(),
        twoFactorEnabled: true,
        loginHistory: [],
        wallet: { balance: 50000, currency: 'KES' },
        permissions: ['all']
      },
      {
        id: 'USR-002',
        email: 'bernard@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'Bernard Keragu',
        phone: '0741156566',
        role: 'manager',
        department: 'Operations',
        avatar: null,
        created: new Date('2024-01-01'),
        lastLogin: new Date(),
        twoFactorEnabled: true,
        loginHistory: [],
        wallet: { balance: 35000, currency: 'KES' },
        permissions: ['bookings', 'staff', 'reports', 'finance']
      },
      {
        id: 'USR-003',
        email: 'manager@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'Sarah Johnson',
        phone: '0712345678',
        role: 'manager',
        department: 'Finance',
        avatar: null,
        created: new Date('2024-02-15'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        loginHistory: [],
        wallet: { balance: 25000, currency: 'KES' },
        permissions: ['finance', 'reports']
      },
      {
        id: 'USR-004',
        email: 'supervisor@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'David Mwangi',
        phone: '0723456789',
        role: 'supervisor',
        department: 'Operations',
        avatar: null,
        created: new Date('2024-03-01'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        loginHistory: [],
        wallet: { balance: 15000, currency: 'KES' },
        permissions: ['bookings', 'staff', 'daily_reports']
      },
      {
        id: 'USR-005',
        email: 'analyst@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'Emily Wanjiku',
        phone: '0734567890',
        role: 'analyst',
        department: 'Analytics',
        avatar: null,
        created: new Date('2024-04-01'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        loginHistory: [],
        wallet: { balance: 10000, currency: 'KES' },
        permissions: ['reports', 'analytics']
      },
      {
        id: 'USR-006',
        email: 'john@example.com',
        password: this.hashPassword('password123'),
        name: 'John Doe',
        phone: '0700000000',
        role: 'customer',
        department: null,
        avatar: null,
        created: new Date('2024-06-15'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        addresses: [
          { id: 'addr-1', label: 'Home', street: '123 Karen Road', city: 'Nairobi', zip: '00100' }
        ],
        preferences: { notifications: true, newsletter: true },
        loyaltyPoints: 250,
        subscription: null,
        loginHistory: [],
        wallet: { balance: 0, currency: 'KES' }
      },
      {
        id: 'STAFF-001',
        email: 'cleaner1@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'Mary Akinyi',
        phone: '0745000001',
        role: 'staff',
        department: 'Cleaning',
        position: 'Senior Cleaner',
        staffId: 'EMP-001',
        avatar: null,
        created: new Date('2024-01-15'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        hourlyRate: 500,
        totalJobs: 156,
        rating: 4.8,
        loginHistory: [],
        wallet: { balance: 5000, currency: 'KES' },
        attendance: { present: 0, absent: 0, late: 0 }
      },
      {
        id: 'STAFF-002',
        email: 'cleaner2@prospark.ke',
        password: this.hashPassword('password123'),
        name: 'James Otieno',
        phone: '0745000002',
        role: 'staff',
        department: 'Cleaning',
        position: 'Cleaner',
        staffId: 'EMP-002',
        avatar: null,
        created: new Date('2024-02-01'),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        hourlyRate: 400,
        totalJobs: 89,
        rating: 4.6,
        loginHistory: [],
        wallet: { balance: 3000, currency: 'KES' },
        attendance: { present: 0, absent: 0, late: 0 }
      }
    ];
  }

  /**
   * Hash password (simple simulation)
   */
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'hashed_' + Math.abs(hash).toString(16);
  }

  /**
   * Login user
   */
  login(email, password, options = {}) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      this.logSecurityEvent('login_failed', { email, reason: 'User not found' });
      return { success: false, message: 'Invalid email or password' };
    }

    const hashedInput = this.hashPassword(password);
    if (hashedInput !== user.password) {
      this.logSecurityEvent('login_failed', { email, reason: 'Wrong password' });
      return { success: false, message: 'Invalid email or password' };
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && !options.skip2FA) {
      return { 
        success: true, 
        requires2FA: true, 
        userId: user.id,
        message: 'Please enter your 2FA code' 
      };
    }

    // Complete login
    return this.completeLogin(user, options);
  }

  /**
   * Complete login after 2FA
   */
  verify2FA(userId, code) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'Invalid user' };
    }

    // Simulate 2FA - accept any 6-digit code for demo
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      this.logSecurityEvent('2fa_failed', { userId });
      return { success: false, message: 'Invalid 2FA code' };
    }

    this.logSecurityEvent('2fa_success', { userId });
    return this.completeLogin(user, { skip2FA: true });
  }

  /**
   * Complete the login process
   */
  completeLogin(user, options = {}) {
    // Update last login
    user.lastLogin = new Date();
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.unshift({
      timestamp: new Date(),
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      device: this.getDeviceInfo(),
      location: 'Nairobi, Kenya'
    });
    if (user.loginHistory.length > 10) user.loginHistory.pop();

    // Save user data
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('prospark_users', JSON.stringify(users));
    }

    // Create session
    const session = {
      id: 'SES-' + Date.now(),
      userId: user.id,
      created: new Date(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      device: this.getDeviceInfo(),
      ip: '192.168.1.' + Math.floor(Math.random() * 255)
    };
    this.sessions.push(session);
    if (this.sessions.length > 10) this.sessions.shift();

    // Set current user
    this.currentUser = { ...user, password: undefined };
    this.saveData();

    this.logSecurityEvent('login_success', { userId: user.id, role: user.role });

    return { 
      success: true, 
      user: this.currentUser,
      message: 'Login successful!' 
    };
  }

  /**
   * Logout user
   */
  logout() {
    if (this.currentUser) {
      this.logSecurityEvent('logout', { userId: this.currentUser.id });
      this.currentUser = null;
      localStorage.removeItem('prospark_current_user');
    }
    return { success: true };
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check user role
   */
  hasRole(...roles) {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.hasRole('ceo', 'admin', 'manager', 'supervisor');
  }

  /**
   * Check if user is CEO
   */
  isCEO() {
    return this.hasRole('ceo');
  }

  /**
   * Check if user is manager
   */
  isManager() {
    return this.hasRole('ceo', 'manager');
  }

  /**
   * Check if user is supervisor
   */
  isSupervisor() {
    return this.hasRole('ceo', 'manager', 'supervisor');
  }

  /**
   * Check if user is customer
   */
  isCustomer() {
    return this.hasRole('customer');
  }

  /**
   * Check if user is staff
   */
  isStaff() {
    return this.hasRole('staff');
  }

  /**
   * Check permission
   */
  hasPermission(permission) {
    if (!this.currentUser) return false;
    if (this.currentUser.permissions?.includes('all')) return true;
    return this.currentUser.permissions?.includes(permission);
  }

  /**
   * Register new user
   */
  register(userData) {
    const users = this.getAllUsers();
    
    // Check if email exists
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: 'USR-' + Date.now(),
      email: userData.email,
      password: this.hashPassword(userData.password),
      name: userData.name,
      phone: userData.phone,
      role: 'customer',
      department: null,
      avatar: null,
      created: new Date(),
      lastLogin: null,
      twoFactorEnabled: false,
      addresses: userData.address ? [userData.address] : [],
      preferences: { notifications: true, newsletter: true },
      loyaltyPoints: 100, // Welcome bonus
      subscription: null,
      loginHistory: [],
      wallet: { balance: 0, currency: 'KES' }
    };

    users.push(newUser);
    localStorage.setItem('prospark_users', JSON.stringify(users));

    this.logSecurityEvent('user_registered', { userId: newUser.id, email: newUser.email });

    return { success: true, user: newUser, message: 'Registration successful!' };
  }

  /**
   * Update user profile
   */
  updateProfile(updates) {
    if (!this.currentUser) {
      return { success: false, message: 'Not logged in' };
    }

    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === this.currentUser.id);
    
    if (index === -1) {
      return { success: false, message: 'User not found' };
    }

    // Update allowed fields
    const allowedFields = ['name', 'phone', 'avatar', 'preferences', 'addresses'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        users[index][field] = updates[field];
        this.currentUser[field] = updates[field];
      }
    });

    localStorage.setItem('prospark_users', JSON.stringify(users));
    this.saveData();

    return { success: true, user: this.currentUser };
  }

  /**
   * Enable/disable 2FA
   */
  toggle2FA(enable) {
    if (!this.currentUser) {
      return { success: false, message: 'Not logged in' };
    }

    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === this.currentUser.id);
    
    if (index === -1) {
      return { success: false, message: 'User not found' };
    }

    users[index].twoFactorEnabled = enable;
    this.currentUser.twoFactorEnabled = enable;
    
    localStorage.setItem('prospark_users', JSON.stringify(users));
    this.saveData();

    this.logSecurityEvent(enable ? '2fa_enabled' : '2fa_disabled', { userId: this.currentUser.id });

    return { success: true, message: enable ? '2FA enabled' : '2FA disabled' };
  }

  /**
   * Get device info
   */
  getDeviceInfo() {
    return navigator.userAgent;
  }

  /**
   * Log security event
   */
  logSecurityEvent(eventType, data) {
    const event = {
      id: 'SEC-' + Date.now(),
      type: eventType,
      timestamp: new Date(),
      userId: data.userId,
      ip: data.ip || 'unknown',
      details: data
    };
    
    this.securityEvents.unshift(event);
    if (this.securityEvents.length > 100) this.securityEvents.pop();
    this.saveData();

    // Check for suspicious activity
    if (eventType === 'login_failed' && this.getRecentEvents('login_failed', 5).length >= 5) {
      this.triggerFraudAlert('Multiple failed login attempts');
    }
  }

  /**
   * Get recent security events
   */
  getRecentEvents(type, limit = 10) {
    let events = this.securityEvents;
    if (type) {
      events = events.filter(e => e.type === type);
    }
    return events.slice(0, limit);
  }

  /**
   * Get all staff members
   */
  getAllStaff() {
    const users = this.getAllUsers();
    return users.filter(u => u.role === 'staff');
  }

  /**
   * Get all customers
   */
  getAllCustomers() {
    const users = this.getAllUsers();
    return users.filter(u => u.role === 'customer');
  }

  /**
   * Get all admin users
   */
  getAllAdmins() {
    const users = this.getAllUsers();
    return users.filter(u => ['ceo', 'manager', 'supervisor', 'analyst'].includes(u.role));
  }

  /**
   * Trigger fraud alert
   */
  triggerFraudAlert(reason) {
    const alert = {
      id: 'ALERT-' + Date.now(),
      type: 'fraud',
      severity: 'high',
      reason: reason,
      timestamp: new Date(),
      acknowledged: false
    };
    
    const alerts = JSON.parse(localStorage.getItem('prospark_alerts') || '[]');
    alerts.unshift(alert);
    localStorage.setItem('prospark_alerts', JSON.stringify(alerts));

    // Show notification
    if (window.app) {
      app.showAlert(`Security Alert: ${reason}`, 'danger');
    }
  }

  /**
   * Setup security listeners
   */
  setupSecurityListeners() {
    // Monitor for suspicious activity
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.currentUser) {
        // User left the page - log session activity
        console.log('User session active - ' + this.currentUser.name);
      }
    });
  }

  /**
   * Change password
   */
  changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      return { success: false, message: 'Not logged in' };
    }

    const users = this.getAllUsers();
    const user = users.find(u => u.id === this.currentUser.id);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (this.hashPassword(currentPassword) !== user.password) {
      this.logSecurityEvent('password_change_failed', { userId: user.id, reason: 'Wrong current password' });
      return { success: false, message: 'Current password is incorrect' };
    }

    user.password = this.hashPassword(newPassword);
    localStorage.setItem('prospark_users', JSON.stringify(users));

    this.logSecurityEvent('password_changed', { userId: user.id });

    return { success: true, message: 'Password changed successfully' };
  }
}

// Initialize auth
window.EnterpriseAuth = EnterpriseAuth;
