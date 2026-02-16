/**
 * PROSPARK CLEANING HUB - BOOKING MODULE
 * Booking & Scheduling System
 */

class BookingManager {
  constructor() {
    this.services = this.getServices();
    this.bookings = this.loadBookings();
    this.schedules = this.loadSchedules();
    this.setupFormListeners();
  }

  /**
   * Get all available services
   */
  getServices() {
    return [
      {
        id: 'SVC-001',
        name: 'Residential Home Cleaning',
        icon: '🏠',
        category: 'residential',
        description: 'Professional home cleaning service',
        basePrice: 3500,
        duration: 4,
        frequency: ['one-time', 'weekly', 'monthly']
      },
      {
        id: 'SVC-002',
        name: 'Apartment (Kejani) Cleaning',
        icon: '🏢',
        category: 'residential',
        description: 'Specialized apartment cleaning',
        basePrice: 2500,
        duration: 3,
        frequency: ['one-time', 'weekly', 'monthly']
      },
      {
        id: 'SVC-003',
        name: 'Office & Corporate Cleaning',
        icon: '💼',
        category: 'commercial',
        description: 'Daily office maintenance and deep cleaning',
        basePrice: 8000,
        duration: 6,
        frequency: ['daily', 'weekly', 'monthly']
      },
      {
        id: 'SVC-004',
        name: 'Hospital & Clinic Cleaning',
        icon: '🏥',
        category: 'healthcare',
        description: 'Sterile and sanitized medical facility cleaning',
        basePrice: 15000,
        duration: 8,
        frequency: ['daily', 'weekly']
      },
      {
        id: 'SVC-005',
        name: 'School & University Cleaning',
        icon: '🎓',
        category: 'educational',
        description: 'Campus and classroom cleaning services',
        basePrice: 12000,
        duration: 6,
        frequency: ['daily', 'weekly']
      },
      {
        id: 'SVC-006',
        name: 'Hotel & Airbnb Cleaning',
        icon: '🏨',
        category: 'hospitality',
        description: 'Guest room turnover and maintenance',
        basePrice: 5000,
        duration: 3,
        frequency: ['one-time', 'daily']
      },
      {
        id: 'SVC-007',
        name: 'Carpet, Mattress & Sofa Cleaning',
        icon: '🛋️',
        category: 'specialized',
        description: 'Deep cleaning of furniture and carpets',
        basePrice: 4500,
        duration: 3,
        frequency: ['one-time']
      },
      {
        id: 'SVC-008',
        name: 'Curtain & Upholstery Cleaning',
        icon: '🪟',
        category: 'specialized',
        description: 'Fabric care and upholstery cleaning',
        basePrice: 3000,
        duration: 2,
        frequency: ['one-time']
      },
      {
        id: 'SVC-009',
        name: 'Post-Construction Cleaning',
        icon: '🏗️',
        category: 'specialized',
        description: 'Complete post-construction site cleanup',
        basePrice: 20000,
        duration: 12,
        frequency: ['one-time']
      },
      {
        id: 'SVC-010',
        name: 'Move-In / Move-Out Cleaning',
        icon: '📦',
        category: 'specialized',
        description: 'Complete property cleaning for transitions',
        basePrice: 8000,
        duration: 6,
        frequency: ['one-time']
      },
      {
        id: 'SVC-011',
        name: 'Deep Sanitization & Fumigation',
        icon: '🛡️',
        category: 'specialized',
        description: 'Disinfection and pest control services',
        basePrice: 6000,
        duration: 4,
        frequency: ['one-time', 'monthly']
      },
      {
        id: 'SVC-012',
        name: 'Event Cleanup Services',
        icon: '🎉',
        category: 'specialized',
        description: 'Pre and post-event cleaning',
        basePrice: 5000,
        duration: 4,
        frequency: ['one-time']
      },
      {
        id: 'SVC-013',
        name: 'Warehouse Cleaning',
        icon: '📦',
        category: 'industrial',
        description: 'Large-scale warehouse maintenance',
        basePrice: 25000,
        duration: 10,
        frequency: ['weekly', 'monthly']
      },
      {
        id: 'SVC-014',
        name: 'Industrial Cleaning',
        icon: '🏭',
        category: 'industrial',
        description: 'Specialized industrial facility cleaning',
        basePrice: 30000,
        duration: 12,
        frequency: ['weekly']
      },
      {
        id: 'SVC-015',
        name: 'High-Rise Window Cleaning',
        icon: '🪟',
        category: 'specialized',
        description: 'Professional window cleaning for tall buildings',
        basePrice: 10000,
        duration: 6,
        frequency: ['one-time', 'monthly']
      },
      {
        id: 'SVC-016',
        name: 'Water Tank Cleaning',
        icon: '💧',
        category: 'specialized',
        description: 'Complete water tank disinfection',
        basePrice: 4000,
        duration: 3,
        frequency: ['one-time', 'yearly']
      },
      {
        id: 'SVC-017',
        name: 'Solar Panel Cleaning',
        icon: '☀️',
        category: 'specialized',
        description: 'Solar panel maintenance and cleaning',
        basePrice: 3500,
        duration: 2,
        frequency: ['one-time', 'quarterly']
      }
    ];
  }

  /**
   * Load bookings from localStorage
   */
  loadBookings() {
    const stored = localStorage.getItem('prospark_bookings');
    return stored ? JSON.parse(stored) : this.getDefaultBookings();
  }

  /**
   * Get default bookings for demo
   */
  getDefaultBookings() {
    return [
      {
        id: 'BK-001',
        customerId: 'USR-003',
        serviceId: 'SVC-001',
        serviceName: 'Residential Home Cleaning',
        date: '2026-02-20',
        time: '09:00',
        duration: 4,
        address: 'Karen, Nairobi',
        phone: '0700000000',
        frequency: 'one-time',
        status: 'confirmed',
        price: 3500,
        assignedStaff: ['Elvis Shisiali'],
        notes: 'Please bring eco-friendly products',
        createdAt: '2026-02-10'
      }
    ];
  }

  /**
   * Load schedules from localStorage
   */
  loadSchedules() {
    const stored = localStorage.getItem('prospark_schedules');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save bookings to localStorage
   */
  saveBookings() {
    localStorage.setItem('prospark_bookings', JSON.stringify(this.bookings));
  }

  /**
   * Save schedules to localStorage
   */
  saveSchedules() {
    localStorage.setItem('prospark_schedules', JSON.stringify(this.schedules));
  }

  /**
   * Setup form event listeners
   */
  setupFormListeners() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    // Service selection handler
    const serviceSelects = document.querySelectorAll('[data-book-service]');
    serviceSelects.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serviceId = e.target.getAttribute('data-book-service');
        this.initializeBookingForm(serviceId);
      });
    });
  }

  /**
   * Initialize booking form with service
   */
  initializeBookingForm(serviceId) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      const modal = document.getElementById('booking-modal');
      if (modal) {
        modal.classList.add('active');
        document.getElementById('booking-service-input').value = serviceId;
        document.getElementById('booking-service-display').textContent = service.name;
        this.updatePriceEstimate();
      }
    }
  }

  /**
   * Handle booking form submission
   */
  async handleBookingSubmit(e) {
    e.preventDefault();

    const serviceId = document.getElementById('booking-service-input')?.value;
    const date = document.getElementById('booking-date')?.value;
    const time = document.getElementById('booking-time')?.value;
    const frequency = document.getElementById('booking-frequency')?.value;
    const address = document.getElementById('booking-address')?.value;
    const phone = document.getElementById('booking-phone')?.value;
    const notes = document.getElementById('booking-notes')?.value;

    if (!serviceId || !date || !time || !address) {
      app.showAlert('Please fill in all required fields', 'warning');
      return;
    }

    if (!app.validatePhone(phone)) {
      app.showAlert('Invalid phone number', 'danger');
      return;
    }

    const service = this.services.find(s => s.id === serviceId);
    const booking = this.createBooking({
      serviceId,
      serviceName: service.name,
      date,
      time,
      frequency,
      address,
      phone,
      notes,
      price: this.calculatePrice(service, frequency)
    });

    if (booking.success) {
      app.showAlert(app.translate('success.booking'), 'success');
      document.getElementById('booking-form').reset();
      document.getElementById('booking-modal').classList.remove('active');
      
      // Refresh bookings list
      setTimeout(() => window.location.reload(), 1500);
    } else {
      app.showAlert(booking.message, 'danger');
    }
  }

  /**
   * Create a new booking
   */
  createBooking(data) {
    if (!app.isAuthenticated()) {
      return {
        success: false,
        message: 'Please login to book a service'
      };
    }

    const booking = {
      id: app.generateId(),
      customerId: app.user.id,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      date: data.date,
      time: data.time,
      duration: this.services.find(s => s.id === data.serviceId).duration,
      address: data.address,
      phone: data.phone,
      frequency: data.frequency,
      status: 'pending',
      price: data.price,
      assignedStaff: [],
      notes: data.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.bookings.push(booking);
    this.saveBookings();

    // Send reminder notification
    app.showNotification('Booking Created', {
      body: `Your booking for ${data.serviceName} on ${data.date} has been created`,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75">✓</text></svg>'
    });

    return {
      success: true,
      booking,
      message: 'Booking created successfully'
    };
  }

  /**
   * Calculate price based on service and frequency
   */
  calculatePrice(service, frequency) {
    let price = service.basePrice;

    if (frequency === 'weekly') {
      price = service.basePrice * 0.8; // 20% discount
    } else if (frequency === 'monthly') {
      price = service.basePrice * 0.7; // 30% discount
    } else if (frequency === 'daily') {
      price = service.basePrice * 0.6; // 40% discount
    }

    return Math.round(price);
  }

  /**
   * Update price estimate in form
   */
  updatePriceEstimate() {
    const serviceId = document.getElementById('booking-service-input')?.value;
    const frequency = document.getElementById('booking-frequency')?.value;
    const priceDisplay = document.getElementById('price-estimate');

    if (serviceId && priceDisplay) {
      const service = this.services.find(s => s.id === serviceId);
      const price = this.calculatePrice(service, frequency);
      priceDisplay.textContent = app.formatCurrency(price);
    }
  }

  /**
   * Get bookings for current user
   */
  getMyBookings() {
    if (!app.isAuthenticated()) return [];
    return this.bookings.filter(b => b.customerId === app.user.id);
  }

  /**
   * Get all bookings (admin only)
   */
  getAllBookings() {
    if (!auth.isAdmin()) return [];
    return this.bookings;
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId, status) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      this.saveBookings();
      return { success: true };
    }
    return { success: false, message: 'Booking not found' };
  }

  /**
   * Assign staff to booking
   */
  assignStaff(bookingId, staffIds) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.assignedStaff = staffIds;
      this.saveBookings();
      return { success: true };
    }
    return { success: false, message: 'Booking not found' };
  }

  /**
   * Reschedule booking
   */
  rescheduleBooking(bookingId, newDate, newTime) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.date = newDate;
      booking.time = newTime;
      booking.status = 'rescheduled';
      this.saveBookings();

      app.showNotification('Booking Rescheduled', {
        body: `Your booking has been rescheduled to ${newDate} at ${newTime}`
      });

      return { success: true };
    }
    return { success: false, message: 'Booking not found' };
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId, reason = '') {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.cancelReason = reason;
      booking.cancelledAt = new Date().toISOString().split('T')[0];
      this.saveBookings();

      app.showNotification('Booking Cancelled', {
        body: 'Your booking has been cancelled'
      });

      return { success: true };
    }
    return { success: false, message: 'Booking not found' };
  }

  /**
   * Get available dates for service
   */
  getAvailableDates(serviceId, daysAhead = 30) {
    const available = [];
    const today = new Date();

    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        available.push(date.toISOString().split('T')[0]);
      }
    }

    return available;
  }

  /**
   * Get available times for a date
   */
  getAvailableTimes() {
    const times = [];
    for (let hour = 7; hour <= 18; hour++) {
      times.push(`${String(hour).padStart(2, '0')}:00`);
      times.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return times;
  }

  /**
   * Generate invoice for booking
   */
  generateInvoice(bookingId) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    const invoice = {
      invoiceId: 'INV-' + booking.id.substring(3),
      bookingId,
      customerId: booking.customerId,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: booking.serviceName,
          quantity: 1,
          unitPrice: booking.price,
          total: booking.price
        }
      ],
      subtotal: booking.price,
      tax: Math.round(booking.price * 0.16),
      total: Math.round(booking.price * 1.16),
      status: 'pending'
    };

    app.setData(`invoice-${bookingId}`, invoice);
    return invoice;
  }

  /**
   * Get pricing summary
   */
  getPricingSummary() {
    return {
      services: this.services.length,
      averagePrice: Math.round(this.services.reduce((a, s) => a + s.basePrice, 0) / this.services.length),
      mostPopular: this.services[0].name,
      totalBookings: this.bookings.length
    };
  }
}

// Initialize booking manager
const booking = new BookingManager();

// Update price estimate on frequency change
document.addEventListener('DOMContentLoaded', () => {
  const frequencySelect = document.getElementById('booking-frequency');
  if (frequencySelect) {
    frequencySelect.addEventListener('change', () => booking.updatePriceEstimate());
  }

  const serviceSelect = document.getElementById('booking-service-input');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => booking.updatePriceEstimate());
  }
});
