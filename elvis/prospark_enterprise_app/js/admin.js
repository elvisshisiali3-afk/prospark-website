/**
 * PROSPARK CLEANING HUB - ADMIN DASHBOARD MODULE
 * Admin Panel & Management System
 */

class AdminManager {
  constructor() {
    this.user = app.user;
    this.init();
  }

  /**
   * Initialize admin panel
   */
  init() {
    if (!auth.isAdmin()) {
      window.location.href = 'dashboard.html';
      app.showAlert('Admin access required', 'danger');
      return;
    }

    this.renderAdminPanel();
    this.setupEventListeners();
    this.loadAdminData();
  }

  /**
   * Render admin panel
   */
  renderAdminPanel() {
    const adminGreeting = document.getElementById('admin-greeting');
    if (adminGreeting) {
      adminGreeting.textContent = `Welcome, ${this.user.name}`;
    }
  }

  /**
   * Load admin data
   */
  loadAdminData() {
    this.loadDashboardStats();
    this.loadAllBookings();
    this.loadCustomers();
    this.loadStaff();
    this.loadRevenueChart();
  }

  /**
   * Load dashboard statistics
   */
  loadDashboardStats() {
    const statsContainer = document.getElementById('admin-stats');
    if (!statsContainer) return;

    const allBookings = booking.getAllBookings();
    const customers = auth.getAllCustomers();
    const staff = auth.getAllStaff();

    const totalRevenue = allBookings.reduce((sum, b) => sum + b.price, 0);
    const completedBookings = allBookings.filter(b => b.status === 'completed').length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const averageRating = 4.8;

    statsContainer.innerHTML = `
      <div class="grid grid-cols-4">
        <div class="card" style="text-align: center; border-top: 4px solid var(--color-success);">
          <p style="color: var(--text-secondary); margin: 0;">Total Revenue</p>
          <p style="font-size: 1.75rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-champagne-gold);">
            ${app.formatCurrency(totalRevenue)}
          </p>
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin: 0;">This month</p>
        </div>

        <div class="card" style="text-align: center; border-top: 4px solid var(--color-info);">
          <p style="color: var(--text-secondary); margin: 0;">Total Bookings</p>
          <p style="font-size: 1.75rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-info);">
            ${allBookings.length}
          </p>
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin: 0;">All time</p>
        </div>

        <div class="card" style="text-align: center; border-top: 4px solid var(--color-warning);">
          <p style="color: var(--text-secondary); margin: 0;">Active Customers</p>
          <p style="font-size: 1.75rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-warning);">
            ${customers.length}
          </p>
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin: 0;">Registered</p>
        </div>

        <div class="card" style="text-align: center; border-top: 4px solid var(--color-champagne-gold);">
          <p style="color: var(--text-secondary); margin: 0;">Staff Members</p>
          <p style="font-size: 1.75rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-champagne-gold);">
            ${staff.length}
          </p>
          <p style="color: var(--text-tertiary); font-size: 0.875rem; margin: 0;">Active</p>
        </div>
      </div>
    `;
  }

  /**
   * Load all bookings
   */
  loadAllBookings() {
    const bookingsList = document.getElementById('admin-bookings-list');
    if (!bookingsList) return;

    const allBookings = booking.getAllBookings();

    if (allBookings.length === 0) {
      bookingsList.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            No bookings found
          </td>
        </tr>
      `;
      return;
    }

    bookingsList.innerHTML = allBookings.map(b => {
      const customer = auth.getUserById(b.customerId);
      return `
        <tr>
          <td><strong>${b.id}</strong></td>
          <td>${customer?.name || 'Unknown'}</td>
          <td>${b.serviceName}</td>
          <td>${app.formatDate(b.date)} ${b.time}</td>
          <td>${app.formatCurrency(b.price)}</td>
          <td><span class="badge badge-${this.getStatusBadgeColor(b.status)}">${b.status}</span></td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="admin.editBooking('${b.id}')">
              Edit
            </button>
          </td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="admin.deleteBooking('${b.id}')">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Load customers
   */
  loadCustomers() {
    const customersList = document.getElementById('admin-customers-list');
    if (!customersList) return;

    const customers = auth.getAllCustomers();

    if (customers.length === 0) {
      customersList.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            No customers found
          </td>
        </tr>
      `;
      return;
    }

    customersList.innerHTML = customers.map(c => {
      const customerBookings = booking.bookings.filter(b => b.customerId === c.id);
      const totalSpent = customerBookings.reduce((sum, b) => sum + b.price, 0);

      return `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.email}</td>
          <td>${c.phone}</td>
          <td>${app.formatDate(c.created)}</td>
          <td>${customerBookings.length}</td>
          <td><strong>${app.formatCurrency(totalSpent)}</strong></td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="admin.viewCustomer('${c.id}')">
              View
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Load staff
   */
  loadStaff() {
    const staffList = document.getElementById('admin-staff-list');
    if (!staffList) return;

    const staff = auth.getAllStaff();

    let staffHTML = `
      <div style="margin-bottom: 1rem;">
        <button class="btn btn-primary" onclick="admin.openAddStaffModal()">
          + Add Staff Member
        </button>
      </div>
    `;

    if (staff.length === 0) {
      staffHTML += `
        <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p>No staff members added yet. <a href="#" onclick="admin.openAddStaffModal(); return false;" style="color: var(--color-champagne-gold);">Add one now</a></p>
        </div>
      `;
    } else {
      staffHTML += `
        <div class="grid grid-cols-2">
          ${staff.map(s => `
            <div class="card">
              <div class="flex-between">
                <div>
                  <h4 style="margin: 0 0 0.5rem 0;">${s.name}</h4>
                  <p style="margin: 0.25rem 0; color: var(--text-secondary);">
                    ${s.email}
                  </p>
                  <p style="margin: 0.25rem 0; color: var(--text-secondary);">
                    ${s.phone}
                  </p>
                  <p style="margin: 0.5rem 0 0 0;">
                    <span class="badge badge-gold">${s.specialization || 'General'}</span>
                    <span class="badge badge-success" style="margin-left: 0.5rem;">★ ${s.rating || 5}/5</span>
                  </p>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-sm btn-secondary" onclick="admin.editStaff('${s.id}')">
                  Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="admin.removeStaff('${s.id}')">
                  Remove
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    staffList.innerHTML = staffHTML;
  }

  /**
   * Open add staff modal
   */
  openAddStaffModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add Staff Member</h3>
          <button class="modal-close">×</button>
        </div>
        <form onsubmit="admin.submitAddStaff(event)">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" id="staff-name" required>
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" id="staff-email" required>
          </div>
          <div class="form-group">
            <label>Phone *</label>
            <input type="tel" id="staff-phone" required>
          </div>
          <div class="form-group">
            <label>Password *</label>
            <input type="password" id="staff-password" required minlength="8">
          </div>
          <div class="form-group">
            <label>Specialization</label>
            <select id="staff-specialization">
              <option value="">General Cleaning</option>
              <option value="Residential">Residential Cleaning</option>
              <option value="Commercial">Commercial Cleaning</option>
              <option value="Specialized">Specialized Services</option>
            </select>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary flex-1">Add Staff</button>
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
   * Submit add staff
   */
  submitAddStaff(e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('staff-name').value,
      email: document.getElementById('staff-email').value,
      phone: document.getElementById('staff-phone').value,
      password: document.getElementById('staff-password').value,
      specialization: document.getElementById('staff-specialization').value
    };

    if (!app.validateEmail(data.email) || !app.validatePhone(data.phone)) {
      app.showAlert('Invalid email or phone format', 'danger');
      return;
    }

    const result = auth.addStaff(data);
    if (result.success) {
      app.showAlert('Staff member added successfully', 'success');
      document.querySelector('.modal').remove();
      this.loadStaff();
    } else {
      app.showAlert('Error adding staff member', 'danger');
    }
  }

  /**
   * Remove staff
   */
  removeStaff(staffId) {
    if (confirm('Are you sure you want to remove this staff member?')) {
      auth.mockUsers = auth.mockUsers.filter(u => u.id !== staffId);
      auth.saveUsers();
      app.showAlert('Staff member removed', 'success');
      this.loadStaff();
    }
  }

  /**
   * Load revenue chart
   */
  loadRevenueChart() {
    const chartContainer = document.getElementById('revenue-chart');
    if (!chartContainer) return;

    const allBookings = booking.getAllBookings();
    const totalRevenue = allBookings.reduce((sum, b) => sum + b.price, 0);
    const completedRevenue = allBookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.price, 0);
    const pendingRevenue = allBookings
      .filter(b => ['pending', 'confirmed'].includes(b.status))
      .reduce((sum, b) => sum + b.price, 0);

    const completedPercent = totalRevenue > 0 ? (completedRevenue / totalRevenue * 100) : 0;
    const pendingPercent = totalRevenue > 0 ? (pendingRevenue / totalRevenue * 100) : 0;

    chartContainer.innerHTML = `
      <div class="card">
        <h4>Revenue Breakdown</h4>
        <div style="margin-top: 1.5rem;">
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Completed Bookings</span>
              <strong>${completedPercent.toFixed(1)}%</strong>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${completedPercent}%; background: var(--color-success);"></div>
            </div>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
              ${app.formatCurrency(completedRevenue)}
            </p>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Pending Bookings</span>
              <strong>${pendingPercent.toFixed(1)}%</strong>
            </div>
            <div style="width: 100%; height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${pendingPercent}%; background: var(--color-warning);"></div>
            </div>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem;">
              ${app.formatCurrency(pendingRevenue)}
            </p>
          </div>

          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 0.5rem; text-align: center;">
            <p style="color: var(--text-secondary); margin: 0;">Total Revenue</p>
            <p style="font-size: 1.75rem; font-weight: bold; color: var(--color-champagne-gold); margin: 0.5rem 0;">
              ${app.formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Edit booking
   */
  editBooking(bookingId) {
    const b = booking.bookings.find(bk => bk.id === bookingId);
    if (!b) return;

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Booking</h3>
          <button class="modal-close">×</button>
        </div>
        <form onsubmit="admin.submitEditBooking(event, '${bookingId}')">
          <div class="form-group">
            <label>Status</label>
            <select id="edit-status" required>
              <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="in-progress" ${b.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
          <div class="form-group">
            <label>Assigned Staff (comma-separated)</label>
            <input type="text" id="edit-staff" value="${b.assignedStaff.join(', ')}">
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit" class="btn btn-primary flex-1">Save Changes</button>
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
   * Submit edit booking
   */
  submitEditBooking(e, bookingId) {
    e.preventDefault();

    const status = document.getElementById('edit-status').value;
    const staffInput = document.getElementById('edit-staff').value;
    const staffArray = staffInput.split(',').map(s => s.trim()).filter(s => s);

    booking.updateBookingStatus(bookingId, status);
    booking.assignStaff(bookingId, staffArray);

    app.showAlert('Booking updated successfully', 'success');
    document.querySelector('.modal').remove();
    this.loadAllBookings();
  }

  /**
   * Delete booking
   */
  deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
      booking.bookings = booking.bookings.filter(b => b.id !== bookingId);
      booking.saveBookings();
      app.showAlert('Booking deleted', 'success');
      this.loadAllBookings();
    }
  }

  /**
   * View customer details
   */
  viewCustomer(customerId) {
    const customer = auth.getUserById(customerId);
    if (!customer) return;

    const customerBookings = booking.bookings.filter(b => b.customerId === customerId);
    const totalSpent = customerBookings.reduce((sum, b) => sum + b.price, 0);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${customer.name}</h3>
          <button class="modal-close">×</button>
        </div>
        <div>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Address:</strong> ${customer.address || 'Not provided'}</p>
          <p><strong>Member Since:</strong> ${app.formatDate(customer.created)}</p>
          <p><strong>Total Bookings:</strong> ${customerBookings.length}</p>
          <p><strong>Total Spent:</strong> ${app.formatCurrency(totalSpent)}</p>
          <p><strong>Loyalty Points:</strong> ${customer.loyaltyPoints || 0}</p>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 1rem 0;">

          <h4>Recent Bookings</h4>
          ${customerBookings.length > 0 ? `
            <ul style="list-style: none; padding: 0;">
              ${customerBookings.slice(0, 5).map(b => `
                <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                  ${b.serviceName} - ${app.formatDate(b.date)} - ${app.formatCurrency(b.price)}
                </li>
              `).join('')}
            </ul>
          ` : '<p style="color: var(--text-secondary);">No bookings</p>'}

          <button type="button" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="this.closest('.modal').remove()">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
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
      'cancelled': 'danger'
    };
    return colors[status] || 'info';
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
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
}

// Initialize admin manager
const admin = new AdminManager();
