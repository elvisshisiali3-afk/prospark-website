/**
 * PROSPARK ENTERPRISE - MAIN APPLICATION
 * World-class Enterprise Platform for ProSpark Cleaning Hub Limited
 */

// Global Enterprise Application
class ProSparkEnterprise {
  constructor() {
    this.version = '2.0.0';
    this.enterprise = true;
    this.init();
  }

  /**
   * Initialize all enterprise modules
   */
  init() {
    // Initialize core systems first
    this.initializeStorage();
    
    // Initialize all enterprise modules
    this.initModules();
    
    // Setup global features
    this.setupFeatures();
    
    // Update UI
    this.updateUI();
    
    // Initialize animations
    this.initAnimations();
    
    console.log('ProSpark Enterprise v' + this.version + ' initialized');
  }

  /**
   * Initialize storage
   */
  initializeStorage() {
    // Ensure default data exists
    if (!localStorage.getItem('prospark_users')) {
      localStorage.setItem('prospark_users', JSON.stringify(this.getDefaultUsers()));
    }
    if (!localStorage.getItem('prospark_bookings')) {
      localStorage.setItem('prospark_bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('prospark_wallet')) {
      localStorage.setItem('prospark_wallet', JSON.stringify({ balance: 0 }));
    }
  }

  /**
   * Get default users
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
        wallet: { balance: 35000, currency: 'KES' },
        permissions: ['bookings', 'staff', 'reports', 'finance']
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
        addresses: [{ id: 'addr-1', label: 'Home', street: '123 Karen Road', city: 'Nairobi', zip: '00100' }],
        preferences: { notifications: true, newsletter: true },
        loyaltyPoints: 250,
        wallet: { balance: 5000, currency: 'KES' }
      }
    ];
  }

  /**
   * Simple hash function
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
   * Initialize all modules
   */
  initModules() {
    // Services (core)
    if (window.EnterpriseServices) {
      this.services = EnterpriseServices;
    }

    // Authentication
    if (window.EnterpriseAuth) {
      this.auth = new EnterpriseAuth();
    }

    // CRM
    if (window.CRManager) {
      this.crm = new CRManager();
    }

    // Finance
    if (window.FinanceManager) {
      this.finance = new FinanceManager();
    }

    // Operations
    if (window.OperationsManager) {
      this.operations = new OperationsManager();
    }

    // Analytics
    if (window.AnalyticsEngine) {
      this.analytics = new AnalyticsEngine();
    }

    // Admin
    if (window.AdminManager) {
      this.admin = new AdminManager();
    }

    // Mobile
    if (window.MobileManager) {
      this.mobile = new MobileManager();
    }
  }

  /**
   * Setup global features
   */
  setupFeatures() {
    // Theme
    this.theme = localStorage.getItem('theme') || 'light';
    this.applyTheme();

    // Language
    this.language = localStorage.getItem('language') || 'en';

    // Check auth
    this.user = this.getStoredUser();
  }

  /**
   * Apply theme
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeIcon = document.getElementById('theme-toggle');
    if (themeIcon) {
      themeIcon.textContent = this.theme === 'dark' ? '🌙' : '☀️';
    }
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.theme);
  }

  /**
   * Get stored user
   */
  getStoredUser() {
    const stored = localStorage.getItem('prospark_current_user');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Update UI
   */
  updateUI() {
    // Update navigation based on auth status
    this.updateNavigation();
    
    // Update page content
    this.updatePageContent();
  }

  /**
   * Update navigation
   */
  updateNavigation() {
    const publicNav = document.querySelectorAll('[data-auth="public"]');
    const protectedNav = document.querySelectorAll('[data-auth="protected"]');
    
    if (this.user) {
      publicNav.forEach(el => el.style.display = 'none');
      protectedNav.forEach(el => el.style.display = '');
    } else {
      publicNav.forEach(el => el.style.display = '');
      protectedNav.forEach(el => el.style.display = 'none');
    }

    // Update user menu
    const userMenu = document.getElementById('user-menu');
    if (userMenu && this.user) {
      userMenu.textContent = this.user.name?.split(' ')[0] || 'Profile';
    }
  }

  /**
   * Update page content
   */
  updatePageContent() {
    // Services page
    if (document.getElementById('services-grid')) {
      this.renderServices();
    }

    // Dashboard
    if (document.getElementById('dashboard-content')) {
      this.renderDashboard();
    }
  }

  /**
   * Render services
   */
  renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid || !this.services) return;

    const services = this.services.services;
    grid.innerHTML = services.map(service => `
      <div class="service-card" data-service="${service.id}">
        <div class="service-icon">${service.icon}</div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <div class="service-price">From Ksh ${service.basePrice.toLocaleString()}</div>
        <button class="btn btn-primary" onclick="window.location.href='booking.html?service=${service.id}'">
          Book Now
        </button>
      </div>
    `).join('');
  }

  /**
   * Render dashboard
   */
  renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    if (!this.user) {
      container.innerHTML = `
        <div class="dashboard-guest">
          <h2>Welcome to ProSpark Enterprise</h2>
          <p>Please login to access your dashboard</p>
          <a href="login.html" class="btn btn-primary">Login</a>
        </div>
      `;
      return;
    }

    const wallet = this.finance?.getWalletBalance(this.user.id) || { balance: 0 };
    const bookings = this.getUserBookings();
    const loyalty = this.user.loyaltyPoints || 0;
    const tier = this.crm?.getLoyaltyTier(loyalty) || { tier: 'bronze' };

    container.innerHTML = `
      <div class="dashboard-welcome">
        <h2>Welcome back, ${this.user.name}</h2>
        <span class="badge badge-${tier.tier}">${tier.tier.toUpperCase()} MEMBER</span>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">Ksh ${wallet.balance.toLocaleString()}</div>
          <div class="stat-label">Wallet Balance</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-value">${bookings.length}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">${loyalty}</div>
          <div class="stat-label">Loyalty Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎁</div>
          <div class="stat-value">${this.user.referralCode || 'N/A'}</div>
          <div class="stat-label">Referral Code</div>
        </div>
      </div>
      
      <div class="dashboard-actions">
        <a href="booking.html" class="action-card">
          <span class="action-icon">📅</span>
          <span>Book Service</span>
        </a>
        <a href="dashboard.html?tab=bookings" class="action-card">
          <span class="action-icon">📋</span>
          <span>My Bookings</span>
        </a>
        <a href="dashboard.html?tab=wallet" class="action-card">
          <span class="action-icon">💳</span>
          <span>Wallet</span>
        </a>
        <a href="dashboard.html?tab=loyalty" class="action-card">
          <span class="action-icon">🏆</span>
          <span>Loyalty</span>
        </a>
      </div>
    `;
  }

  /**
   * Get user bookings
   */
  getUserBookings() {
    const allBookings = JSON.parse(localStorage.getItem('prospark_bookings') || '[]');
    if (!this.user) return [];
    return allBookings.filter(b => b.customerId === this.user.id);
  }

  /**
   * Show alert
   */
  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
      <span class="alert-icon">${this.getAlertIcon(type)}</span>
      <span class="alert-message">${message}</span>
      <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }

  /**
   * Get alert icon
   */
  getAlertIcon(type) {
    const icons = {
      success: '✓',
      danger: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return 'Ksh ' + (amount || 0).toLocaleString();
  }

  /**
   * Validate email
   */
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Initialize animations
   */
  initAnimations() {
    // Add animation classes to elements
    document.querySelectorAll('.card, .service-card, .stat-card').forEach((el, index) => {
      el.style.animationDelay = (index * 0.1) + 's';
      el.classList.add('fade-in');
    });
  }

  /**
   * Get translations
   */
  t(key) {
    const translations = {
      'en': {
        'welcome': 'Welcome to ProSpark',
        'login': 'Login',
        'signup': 'Sign Up',
        'book': 'Book Now',
        'logout': 'Logout'
      },
      'sw': {
        'welcome': 'Karibu ProSpark',
        'login': 'Ingia',
        'signup': 'Jisajili',
        'book': 'Panga Sasa',
        'logout': 'Toka'
      }
    };
    return translations[this.language]?.[key] || translations['en'][key] || key;
  }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new ProSparkEnterprise();
  
  // Global error handler
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.message);
  });
});

// Export
window.ProSparkEnterprise = ProSparkEnterprise;
