/**
 * BOOKING SYSTEM MANAGEMENT UI MODULE
 * Provides UI components and interactions for the booking system manager
 */

class BookingSystemUI {
  constructor() {
    this.manager = bookingSystemManager;
    this.init();
  }

  /**
   * Initialize UI components
   */
  init() {
    this.setupBookingManagementPanel();
    this.setupNotificationCenter();
    this.setupClientHistoryPanel();
    this.setupBookingAnalyticsDashboard();
  }

  /**
   * Render Booking Management Panel
   */
  setupBookingManagementPanel() {
    const panelHTML = `
      <div id="booking-management-panel" style="display: none;">
        <h3>📅 Booking Management System</h3>
        
        <!-- Booking Filters -->
        <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); margin-bottom: 2rem;">
          <h4>Filters & Search</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 1rem;">
            <input 
              type="text" 
              id="booking-search-client" 
              placeholder="Search by client name..."
              class="form-control"
            />
            <select id="booking-filter-status" class="form-control">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input 
              type="date" 
              id="booking-filter-date" 
              class="form-control"
            />
            <button class="btn btn-primary" onclick="bookingSystemUI.filterBookings()">Search</button>
          </div>
        </div>

        <!-- Bookings List -->
        <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color);">
                <th style="padding: var(--space-md); text-align: left;">Booking ID</th>
                <th style="padding: var(--space-md); text-align: left;">Client</th>
                <th style="padding: var(--space-md); text-align: left;">Service</th>
                <th style="padding: var(--space-md); text-align: left;">Date & Time</th>
                <th style="padding: var(--space-md); text-align: left;">Status</th>
                <th style="padding: var(--space-md); text-align: left;">Assigned To</th>
                <th style="padding: var(--space-md); text-align: left;">Price</th>
                <th style="padding: var(--space-md); text-align: left;">Actions</th>
              </tr>
            </thead>
            <tbody id="booking-system-list">
              <!-- Rendered by JavaScript -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Booking Details Modal -->
      <div id="booking-details-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div style="background: var(--bg-primary); padding: var(--space-xl); border-radius: var(--radius-lg); max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h3>Booking Details</h3>
            <button onclick="bookingSystemUI.closeBookingModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
          </div>
          <div id="booking-details-content"></div>
        </div>
      </div>
    `;

    // Inject into the page when admin section is ready
    document.addEventListener('DOMContentLoaded', () => {
      const adminContent = document.querySelector('.dashboard-content');
      if (adminContent) {
        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        adminContent.appendChild(container);
      }
    });
  }

  /**
   * Render Notification Center
   */
  setupNotificationCenter() {
    const notificationHTML = `
      <div id="notification-center" style="
        position: fixed;
        top: 80px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 999;
        overflow-y: auto;
        display: none;
      ">
        <div style="padding: var(--space-lg); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <h4>Notifications</h4>
          <button onclick="bookingSystemUI.clearNotifications()" style="background: none; border: none; color: var(--color-danger); cursor: pointer;">Clear</button>
        </div>
        <div id="notification-list" style="max-height: 400px; overflow-y: auto;">
          <!-- Notifications rendered here -->
        </div>
      </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
      const body = document.body;
      const container = document.createElement('div');
      container.innerHTML = notificationHTML;
      body.appendChild(container);
    });
  }

  /**
   * Render Client History Panel
   */
  setupClientHistoryPanel() {
    const historyHTML = `
      <div id="client-history-panel" style="display: none;">
        <h3>👥 Client Booking History & Preferences</h3>
        
        <!-- Client Search -->
        <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); margin-bottom: 2rem;">
          <input 
            type="text" 
            id="client-search" 
            placeholder="Search client by name or ID..."
            class="form-control"
            style="margin-bottom: 1rem;"
          />
          <button class="btn btn-primary" onclick="bookingSystemUI.searchClient()">Search</button>
        </div>

        <!-- Client Details -->
        <div id="client-details-container" style="display: none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <!-- Client Info -->
            <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md);">
              <h4>Client Information</h4>
              <div id="client-info-details"></div>
            </div>

            <!-- Client Preferences -->
            <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md);">
              <h4>Preferences & History</h4>
              <div id="client-preferences-details"></div>
            </div>
          </div>

          <!-- Booking History Table -->
          <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); margin-top: 2rem; overflow-x: auto;">
            <h4>Booking History</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color);">
                  <th style="padding: var(--space-md); text-align: left;">Date</th>
                  <th style="padding: var(--space-md); text-align: left;">Service</th>
                  <th style="padding: var(--space-md); text-align: left;">Status</th>
                  <th style="padding: var(--space-md); text-align: left;">Rating</th>
                  <th style="padding: var(--space-md); text-align: left;">Amount</th>
                </tr>
              </thead>
              <tbody id="client-booking-history-table"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
      const adminContent = document.querySelector('.dashboard-content');
      if (adminContent) {
        const container = document.createElement('div');
        container.innerHTML = historyHTML;
        adminContent.appendChild(container);
      }
    });
  }

  /**
   * Render Analytics Dashboard
   */
  setupBookingAnalyticsDashboard() {
    const analyticsHTML = `
      <div id="booking-analytics-panel" style="display: none;">
        <h3>📊 Booking System Analytics</h3>
        
        <!-- Analytics Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-success);">
            <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Active Bookings</p>
            <p id="analytics-active-bookings" style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-success);">0</p>
          </div>
          <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-info);">
            <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Completed</p>
            <p id="analytics-completed-bookings" style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-info);">0</p>
          </div>
          <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-warning);">
            <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Avg Rating</p>
            <p id="analytics-avg-rating" style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-warning);">4.8/5</p>
          </div>
          <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-champagne-gold);">
            <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Total Revenue</p>
            <p id="analytics-total-revenue" style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0; color: var(--color-champagne-gold);">₱0</p>
          </div>
        </div>

        <!-- Service Performance -->
        <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md); margin-bottom: 2rem;">
          <h4>Top Performing Services</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color);">
                <th style="padding: var(--space-md); text-align: left;">Service</th>
                <th style="padding: var(--space-md); text-align: left;">Bookings</th>
                <th style="padding: var(--space-md); text-align: left;">Revenue</th>
                <th style="padding: var(--space-md); text-align: left;">Avg Rating</th>
              </tr>
            </thead>
            <tbody id="analytics-services-table"></tbody>
          </table>
        </div>

        <!-- Export Options -->
        <div style="background: var(--bg-secondary); padding: var(--space-lg); border-radius: var(--radius-md);">
          <h4>Export Data</h4>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-secondary" onclick="bookingSystemUI.exportData('json')">📥 Export JSON</button>
            <button class="btn btn-secondary" onclick="bookingSystemUI.exportData('csv')">📥 Export CSV</button>
            <button class="btn btn-secondary" onclick="bookingSystemUI.generateReport()">📄 Generate Report</button>
          </div>
        </div>
      </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
      const adminContent = document.querySelector('.dashboard-content');
      if (adminContent) {
        const container = document.createElement('div');
        container.innerHTML = analyticsHTML;
        adminContent.appendChild(container);
      }
    });
  }

  /**
   * Filter and display bookings
   */
  filterBookings() {
    const clientName = document.getElementById('booking-search-client')?.value || '';
    const status = document.getElementById('booking-filter-status')?.value || '';
    const date = document.getElementById('booking-filter-date')?.value || '';

    let filtered = this.manager.bookings;

    if (clientName) {
      filtered = filtered.filter(b => b.clientName.toLowerCase().includes(clientName.toLowerCase()));
    }
    if (status) {
      filtered = filtered.filter(b => b.status === status);
    }
    if (date) {
      filtered = filtered.filter(b => b.date === date);
    }

    this.renderBookingsList(filtered);
  }

  /**
   * Render bookings list
   */
  renderBookingsList(bookings) {
    const tbody = document.getElementById('booking-system-list');
    if (!tbody) return;

    tbody.innerHTML = bookings.map(booking => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: var(--space-md);"><strong>${booking.id}</strong></td>
        <td style="padding: var(--space-md);">${booking.clientName}</td>
        <td style="padding: var(--space-md);">${booking.serviceName}</td>
        <td style="padding: var(--space-md);">${booking.date} ${booking.time}</td>
        <td style="padding: var(--space-md);">
          <span class="badge badge-${this.getStatusColor(booking.status)}">${booking.status}</span>
        </td>
        <td style="padding: var(--space-md);">${booking.assignedStaff || 'Unassigned'}</td>
        <td style="padding: var(--space-md);">₱${booking.price.toLocaleString()}</td>
        <td style="padding: var(--space-md);">
          <button class="btn btn-sm btn-secondary" onclick="bookingSystemUI.viewBookingDetails('${booking.id}')">View</button>
          <button class="btn btn-sm btn-secondary" onclick="bookingSystemUI.editBookingStatus('${booking.id}')">Update</button>
        </td>
      </tr>
    `).join('');
  }

  /**
   * View booking details
   */
  viewBookingDetails(bookingId) {
    const booking = this.manager.findBooking(bookingId);
    if (!booking) return;

    const detailsHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--color-champagne-gold); margin-top: 0;">Booking Information</h5>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Status:</strong> <span class="badge badge-${this.getStatusColor(booking.status)}">${booking.status}</span></p>
        <p><strong>Created:</strong> ${booking.createdAt}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--color-champagne-gold);">Client Details</h5>
        <p><strong>Name:</strong> ${booking.clientName}</p>
        <p><strong>Email:</strong> ${booking.clientEmail}</p>
        <p><strong>Phone:</strong> ${booking.clientPhone}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--color-champagne-gold);">Service Details</h5>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Duration:</strong> ${booking.duration} hours</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Price:</strong> ₱${booking.price.toLocaleString()}</p>
      </div>

      ${booking.assignedStaff ? `
        <div style="margin-bottom: 1.5rem;">
          <h5 style="color: var(--color-champagne-gold);">Assignment</h5>
          <p><strong>Assigned To:</strong> ${booking.assignedStaff}</p>
          <p><strong>Team Members:</strong> ${booking.assignedTeam.join(', ') || 'None'}</p>
        </div>
      ` : ''}

      ${booking.rating ? `
        <div style="margin-bottom: 1.5rem;">
          <h5 style="color: var(--color-champagne-gold);">Client Review</h5>
          <p><strong>Rating:</strong> ${booking.rating}/5 ⭐</p>
          <p><strong>Feedback:</strong> ${booking.feedback}</p>
        </div>
      ` : ''}

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button class="btn btn-primary" onclick="bookingSystemUI.updateBookingStatus('${booking.id}')">Update Status</button>
        <button class="btn btn-secondary" onclick="bookingSystemUI.rescheduleBooking('${booking.id}')">Reschedule</button>
        ${booking.status !== 'completed' && booking.status !== 'cancelled' ? `
          <button class="btn btn-danger" onclick="bookingSystemUI.cancelBooking('${booking.id}')">Cancel</button>
        ` : ''}
        <button class="btn btn-secondary" onclick="bookingSystemUI.closeBookingModal()">Close</button>
      </div>
    `;

    document.getElementById('booking-details-content').innerHTML = detailsHTML;
    document.getElementById('booking-details-modal').style.display = 'flex';
  }

  /**
   * Close booking modal
   */
  closeBookingModal() {
    document.getElementById('booking-details-modal').style.display = 'none';
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId) {
    const booking = this.manager.findBooking(bookingId);
    if (!booking) return;

    const newStatus = prompt('Enter new status (pending, confirmed, assigned, in-progress, completed, cancelled):', booking.status);
    if (!newStatus) return;

    this.manager.updateBookingStatus(bookingId, newStatus);
    this.viewBookingDetails(bookingId);
    this.filterBookings();
    alert('Booking status updated successfully');
  }

  /**
   * Reschedule booking
   */
  rescheduleBooking(bookingId) {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    if (!newDate) return;

    const newTime = prompt('Enter new time (HH:MM):');
    if (!newTime) return;

    this.manager.rescheduleBooking(bookingId, newDate, newTime);
    this.viewBookingDetails(bookingId);
    alert('Booking rescheduled successfully');
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId) {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    this.manager.cancelBooking(bookingId, reason);
    this.viewBookingDetails(bookingId);
    alert('Booking cancelled successfully');
  }

  /**
   * Search client
   */
  searchClient() {
    const query = document.getElementById('client-search')?.value;
    if (!query) {
      alert('Please enter a client name or ID');
      return;
    }

    const client = this.manager.bookings.find(b => 
      b.clientName.toLowerCase().includes(query.toLowerCase()) || 
      b.clientId.includes(query)
    );

    if (!client) {
      alert('Client not found');
      return;
    }

    this.displayClientDetails(client.clientId, client.clientName);
  }

  /**
   * Display client details
   */
  displayClientDetails(clientId, clientName) {
    const history = this.manager.getClientHistory(clientId);
    const preferences = this.manager.getClientPreferences(clientId);
    const bookings = this.manager.getClientBookings(clientId);

    // Display client info
    const clientInfo = `
      <p><strong>Client ID:</strong> ${clientId}</p>
      <p><strong>Name:</strong> ${clientName}</p>
      <p><strong>Total Bookings:</strong> ${history?.totalBookings || 0}</p>
      <p><strong>Total Spent:</strong> ₱${(history?.totalSpent || 0).toLocaleString()}</p>
      <p><strong>Average Rating:</strong> ${(history?.averageRating || 0).toFixed(1)}/5 ⭐</p>
      <p><strong>Loyalty Level:</strong> <strong style="color: var(--color-champagne-gold);">${preferences?.loyaltyLevel || 'New'}</strong></p>
    `;
    document.getElementById('client-info-details').innerHTML = clientInfo;

    // Display preferences
    if (preferences) {
      const preferencesHTML = `
        <h5>Preferred Services:</h5>
        <ul style="margin: 0; padding-left: 1.5rem;">
          ${preferences.preferredServices.map(s => `<li>${s.service} (${s.count} bookings)</li>`).join('')}
        </ul>
        <h5 style="margin-top: 1rem;">Average Spend:</h5>
        <p>₱${preferences.averageSpend.toLocaleString()}</p>
      `;
      document.getElementById('client-preferences-details').innerHTML = preferencesHTML;
    }

    // Display booking history table
    const historyHTML = bookings.map(booking => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: var(--space-md);">${booking.date}</td>
        <td style="padding: var(--space-md);">${booking.serviceName}</td>
        <td style="padding: var(--space-md);"><span class="badge badge-${this.getStatusColor(booking.status)}">${booking.status}</span></td>
        <td style="padding: var(--space-md);">${booking.rating ? `${booking.rating}⭐` : 'N/A'}</td>
        <td style="padding: var(--space-md);">₱${booking.price.toLocaleString()}</td>
      </tr>
    `).join('');
    document.getElementById('client-booking-history-table').innerHTML = historyHTML;

    document.getElementById('client-details-container').style.display = 'block';
  }

  /**
   * Show analytics
   */
  updateAnalyticsDashboard() {
    const analytics = this.manager.getAnalytics();

    document.getElementById('analytics-active-bookings').textContent = 
      analytics.summary.confirmedBookings + analytics.summary.assignedBookings + analytics.summary.inProgressBookings;
    document.getElementById('analytics-completed-bookings').textContent = 
      analytics.summary.completedBookings;
    document.getElementById('analytics-avg-rating').textContent = 
      analytics.summary.averageRating + '/5';
    document.getElementById('analytics-total-revenue').textContent = 
      '₱' + analytics.revenue.totalRevenue.toLocaleString();

    // Render services table
    const servicesHTML = analytics.services.slice(0, 5).map(service => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: var(--space-md);">${service.name}</td>
        <td style="padding: var(--space-md);">${service.totalBookings}</td>
        <td style="padding: var(--space-md);">₱${service.revenue.toLocaleString()}</td>
        <td style="padding: var(--space-md);">${service.averageRating || 'N/A'}</td>
      </tr>
    `).join('');
    document.getElementById('analytics-services-table').innerHTML = servicesHTML;
  }

  /**
   * Export data
   */
  exportData(format) {
    const data = this.manager.exportBookingData(format);
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const filename = `prospark_bookings_${new Date().toISOString().split('T')[0]}.${format}`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/' + (format === 'csv' ? 'csv' : 'json') + ';charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert(`Data exported as ${filename}`);
  }

  /**
   * Generate report
   */
  generateReport() {
    const analytics = this.manager.getAnalytics();
    const reportHTML = `
      <html>
        <head>
          <title>ProSpark Booking System Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>ProSpark Booking System Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Bookings: ${analytics.summary.totalBookings}</p>
            <p>Completed: ${analytics.summary.completedBookings}</p>
            <p>Pending: ${analytics.summary.pendingBookings}</p>
            <p>Cancelled: ${analytics.summary.cancelledBookings}</p>
            <p>Average Rating: ${analytics.summary.averageRating}/5</p>
            <p>Client Satisfaction: ${analytics.summary.clientSatisfaction}</p>
          </div>

          <div>
            <h2>Revenue</h2>
            <p>Total Revenue: ₱${analytics.revenue.totalRevenue.toLocaleString()}</p>
            <p>Pending Revenue: ₱${analytics.revenue.pendingRevenue.toLocaleString()}</p>
            <p>Average Booking Value: ₱${analytics.revenue.averageBookingValue.toLocaleString()}</p>
          </div>

          <h2>Top Services</h2>
          <table>
            <tr>
              <th>Service</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Rating</th>
            </tr>
            ${analytics.services.slice(0, 10).map(s => `
              <tr>
                <td>${s.name}</td>
                <td>${s.totalBookings}</td>
                <td>₱${s.revenue.toLocaleString()}</td>
                <td>${s.averageRating || 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
  }

  /**
   * Get status color
   */
  getStatusColor(status) {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      assigned: 'info',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  }

  /**
   * Clear notifications
   */
  clearNotifications() {
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
      notificationList.innerHTML = '';
    }
  }
}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof bookingSystemManager !== 'undefined') {
    window.bookingSystemUI = new BookingSystemUI();
    console.log('✅ Booking System UI initialized');
  }
});
