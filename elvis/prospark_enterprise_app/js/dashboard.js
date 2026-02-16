/**
 * PROSPARK CLEANING HUB - DASHBOARD MODULE
 * Customer Portal & Dashboard
 */

class DashboardManager {
  constructor() {
    this.user = app.user;
    this.init();
  }

  /**
   * Initialize dashboard
   */
  init() {
    if (!auth.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    this.renderDashboard();
    this.setupEventListeners();
    this.loadUserData();
  }

  /**
   * Render dashboard content
   */
  renderDashboard() {
    const userGreeting = document.getElementById('user-greeting');
    const userEmail = document.getElementById('user-email');

    if (userGreeting) {
      userGreeting.textContent = `Welcome, ${this.user.name}`;
    }
    if (userEmail) {
      userEmail.textContent = this.user.email;
    }
  }

  /**
   * Load user data
   */
  loadUserData() {
    this.loadBookings();
    this.loadProfile();
    this.loadLoyaltyPoints();
    this.loadInvoices();
    this.renderStats();
  }

  /**
   * Load and display bookings
   */
  loadBookings() {
    const bookingsList = document.getElementById('bookings-list');
    if (!bookingsList) return;

    const myBookings = booking.getMyBookings();

    if (myBookings.length === 0) {
      bookingsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p style="font-size: 4rem; margin-bottom: 1rem;">📅</p>
          <p>No bookings yet. <a href="booking.html" style="color: var(--color-champagne-gold);">Book a service</a></p>
        </div>
      `;
      return;
    }

    bookingsList.innerHTML = myBookings.map(b => `
      <div class="card" style="margin-bottom: 1rem;">
        <div class="flex-between">
          <div>
            <h4 style="margin: 0 0 0.5rem 0;">${b.serviceName}</h4>
            <p style="margin: 0.25rem 0; color: var(--text-secondary);">
              📅 ${app.formatDate(b.date)} at ${b.time}
            </p>
            <p style="margin: 0.25rem 0; color: var(--text-secondary);">
              📍 ${b.address}
            </p>
            <div style="margin-top: 0.5rem;">
              <span class="badge badge-${this.getStatusBadgeColor(b.status)}">${b.status.toUpperCase()}</span>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 1.5rem; font-weight: bold; color: var(--color-champagne-gold); margin: 0;">
              ${app.formatCurrency(b.price)}
            </p>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-secondary" onclick="dashboard.openRescheduleModal('${b.id}')">
                Reschedule
              </button>
              <button class="btn btn-sm btn-danger" onclick="dashboard.cancelBooking('${b.id}')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Get status badge color
   */
  getStatusBadgeColor(status) {
    const colors = {
      'pending': 'warning',
      'confirmed': 'info',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'danger',
      'rescheduled': 'gold'
    };
    return colors[status] || 'info';
  }

  /**
   * Load and display profile
   */
  loadProfile() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    document.getElementById('profile-name').value = this.user.name || '';
    document.getElementById('profile-email').value = this.user.email || '';
    document.getElementById('profile-phone').value = this.user.phone || '';
    document.getElementById('profile-address').value = this.user.address || '';
  }

  /**
   * Update profile
   */
  updateProfile(e) {
    e.preventDefault();

    const updates = {
      name: document.getElementById('profile-name').value,
      email: document.getElementById('profile-email').value,
      phone: document.getElementById('profile-phone').value,
      address: document.getElementById('profile-address').value
    };

    if (!updates.name || !updates.email || !updates.phone) {
      app.showAlert('Please fill in all required fields', 'warning');
      return;
    }

    const result = auth.updateProfile(updates);
    if (result.success) {
      app.showAlert('Profile updated successfully', 'success');
      this.user = app.user;
    } else {
      app.showAlert(result.message, 'danger');
    }
  }

  /**
   * Change password
   */
  changePassword(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      app.showAlert('Please fill in all fields', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      app.showAlert('Passwords do not match', 'danger');
      return;
    }

    const result = auth.changePassword(oldPassword, newPassword);
    if (result.success) {
      app.showAlert(result.message, 'success');
      document.getElementById('password-form').reset();
    } else {
      app.showAlert(result.message, 'danger');
    }
  }

  /**
   * Load loyalty points
   */
  loadLoyaltyPoints() {
    const loyaltyDisplay = document.getElementById('loyalty-points');
    if (loyaltyDisplay) {
      const points = this.user.loyaltyPoints || 0;
      loyaltyDisplay.innerHTML = `
        <div class="card" style="text-align: center; background: linear-gradient(135deg, rgba(201,169,97,0.1), rgba(201,169,97,0.05));">
          <p style="color: var(--text-secondary); margin: 0;">Your Loyalty Points</p>
          <p style="font-size: 2.5rem; font-weight: bold; color: var(--color-champagne-gold); margin: 0.5rem 0;">
            ${points}
          </p>
          <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">
            = ${app.formatCurrency(points * 10)} in rewards
          </p>
        </div>
      `;
    }
  }

  /**
   * Load invoices
   */
  loadInvoices() {
    const invoicesList = document.getElementById('invoices-list');
    if (!invoicesList) return;

    const myBookings = booking.getMyBookings();
    let invoicesHTML = '';

    myBookings.forEach(b => {
      const invoice = booking.generateInvoice(b.id);
      invoicesHTML += `
        <tr>
          <td>${invoice.invoiceId}</td>
          <td>${b.serviceName}</td>
          <td>${app.formatDate(invoice.date)}</td>
          <td>${app.formatCurrency(invoice.total)}</td>
          <td><span class="badge badge-info">${invoice.status}</span></td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="dashboard.downloadInvoice('${b.id}')">
              Download
            </button>
          </td>
        </tr>
      `;
    });

    if (invoicesHTML === '') {
      invoicesList.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            No invoices available
          </td>
        </tr>
      `;
    } else {
      invoicesList.innerHTML = invoicesHTML;
    }
  }

  /**
   * Download invoice
   */
  downloadInvoice(bookingId) {
    const invoice = app.getData(`invoice-${bookingId}`);
    if (!invoice) return;

    const content = `
      PROSPARK CLEANING HUB LIMITED
      Invoice #${invoice.invoiceId}

      Customer: ${this.user.name}
      Email: ${this.user.email}
      Phone: ${this.user.phone}

      Invoice Date: ${invoice.date}
      Due Date: ${invoice.dueDate}

      ==================================================

      ITEMS:
      ${invoice.items.map(item => `
      ${item.description}
      Qty: ${item.quantity} x ${app.formatCurrency(item.unitPrice)} = ${app.formatCurrency(item.total)}
      `).join('\n')}

      ==================================================
      Subtotal: ${app.formatCurrency(invoice.subtotal)}
      Tax (16%): ${app.formatCurrency(invoice.tax)}
      TOTAL: ${app.formatCurrency(invoice.total)}

      ==================================================

      Payment Status: ${invoice.status}

      Thank you for your business!
      ProSpark Cleaning Hub Limited
      +254 799 802 509 | +254 741 156 566
      prosparkcleaninghub@gmail.com
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.invoiceId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    app.showAlert('Invoice downloaded successfully', 'success');
  }

  /**
   * Render statistics
   */
  renderStats() {
    const statsContainer = document.getElementById('dashboard-stats');
    if (!statsContainer) return;

    const myBookings = booking.getMyBookings();
    const completedBookings = myBookings.filter(b => b.status === 'completed').length;
    const upcomingBookings = myBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
    const totalSpent = myBookings.reduce((sum, b) => sum + b.price, 0);

    statsContainer.innerHTML = `
      <div class="grid grid-cols-3">
        <div class="card" style="text-align: center;">
          <p style="font-size: 2.5rem; margin: 0;">📅</p>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-champagne-gold);">
            ${upcomingBookings}
          </p>
          <p style="color: var(--text-secondary); margin: 0;">Upcoming</p>
        </div>
        <div class="card" style="text-align: center;">
          <p style="font-size: 2.5rem; margin: 0;">✓</p>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-success);">
            ${completedBookings}
          </p>
          <p style="color: var(--text-secondary); margin: 0;">Completed</p>
        </div>
        <div class="card" style="text-align: center;">
          <p style="font-size: 2.5rem; margin: 0;">💰</p>
          <p style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-champagne-gold);">
            ${app.formatCurrency(totalSpent)}
          </p>
          <p style="color: var(--text-secondary); margin: 0;">Total Spent</p>
        </div>
      </div>
    `;
  }

  /**
   * Open reschedule modal
   */
  openRescheduleModal(bookingId) {
    const b = booking.bookings.find(bk => bk.id === bookingId);
    if (!b) return;

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Reschedule Booking</h3>
          <button class="modal-close">×</button>
        </div>
        <form onsubmit="dashboard.submitReschedule(event, '${bookingId}')">
          <div class="form-group">
            <label>New Date</label>
            <input type="date" id="reschedule-date" required value="${b.date}">
          </div>
          <div class="form-group">
            <label>New Time</label>
            <select id="reschedule-time" required>
              ${booking.getAvailableTimes().map(t => `
                <option value="${t}" ${t === b.time ? 'selected' : ''}>${t}</option>
              `).join('')}
            </select>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary flex-1">Confirm Reschedule</button>
            <button type="button" class="btn btn-secondary flex-1" onclick="this.closest('.modal').remove()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  /**
   * Submit reschedule
   */
  submitReschedule(e, bookingId) {
    e.preventDefault();

    const newDate = document.getElementById('reschedule-date').value;
    const newTime = document.getElementById('reschedule-time').value;

    const result = booking.rescheduleBooking(bookingId, newDate, newTime);
    if (result.success) {
      app.showAlert('Booking rescheduled successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const result = booking.cancelBooking(bookingId);
      if (result.success) {
        app.showAlert('Booking cancelled', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  }

  /**
   * Logout
   */
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      auth.logout();
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.updateProfile(e));
    }

    if (passwordForm) {
      passwordForm.addEventListener('submit', (e) => this.changePassword(e));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }
}

// Initialize dashboard
const dashboard = new DashboardManager();
