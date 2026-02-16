/**
 * PROSPARK CLEANING HUB - BOOKING SYSTEM MANAGEMENT MODULE
 * Advanced Client Booking Integration & System Management
 * Handles: Booking lifecycle, staff assignments, scheduling, notifications, and analytics
 */

class BookingSystemManager {
  constructor() {
    this.bookings = this.loadBookings();
    this.assignments = this.loadAssignments();
    this.notifications = this.loadNotifications();
    this.schedules = this.loadSchedules();
    this.clientHistory = this.loadClientHistory();
    this.performanceMetrics = this.loadPerformanceMetrics();
    this.init();
  }

  /**
   * Initialize the booking system manager
   */
  init() {
    console.log('🔧 Booking System Manager initialized');
    this.setupEventListeners();
    this.startAutoSync();
  }

  /**
   * Load bookings from localStorage
   */
  loadBookings() {
    const stored = localStorage.getItem('prospark_bookings');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Load staff assignments from localStorage
   */
  loadAssignments() {
    const stored = localStorage.getItem('prospark_assignments');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Load notifications from localStorage
   */
  loadNotifications() {
    const stored = localStorage.getItem('prospark_notifications');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Load schedules from localStorage
   */
  loadSchedules() {
    const stored = localStorage.getItem('prospark_schedules');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Load client booking history
   */
  loadClientHistory() {
    const stored = localStorage.getItem('prospark_client_history');
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Load performance metrics
   */
  loadPerformanceMetrics() {
    const stored = localStorage.getItem('prospark_performance_metrics');
    return stored ? JSON.parse(stored) : {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      averageRating: 0,
      clientSatisfaction: 0
    };
  }

  /**
   * Save all data to localStorage
   */
  saveAll() {
    localStorage.setItem('prospark_bookings', JSON.stringify(this.bookings));
    localStorage.setItem('prospark_assignments', JSON.stringify(this.assignments));
    localStorage.setItem('prospark_notifications', JSON.stringify(this.notifications));
    localStorage.setItem('prospark_schedules', JSON.stringify(this.schedules));
    localStorage.setItem('prospark_client_history', JSON.stringify(this.clientHistory));
    localStorage.setItem('prospark_performance_metrics', JSON.stringify(this.performanceMetrics));
  }

  /**
   * Create a new booking with system integration
   */
  createBooking(bookingData) {
    const booking = {
      id: `BK-${Date.now()}`,
      clientId: bookingData.clientId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      serviceCategory: bookingData.serviceCategory,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration,
      location: bookingData.location,
      price: bookingData.price,
      frequency: bookingData.frequency || 'one-time',
      status: 'pending', // pending, confirmed, assigned, in-progress, completed, cancelled
      priority: bookingData.priority || 'normal', // low, normal, high, urgent
      notes: bookingData.notes || '',
      specialRequirements: bookingData.specialRequirements || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedStaff: null,
      assignedTeam: [],
      completedAt: null,
      rating: null,
      feedback: null,
      paymentStatus: 'pending', // pending, partial, completed
      paymentMethod: bookingData.paymentMethod || 'cash',
      invoiceId: null
    };

    this.bookings.push(booking);
    this.addToClientHistory(booking.clientId, booking);
    this.createNotification(booking.clientId, `Booking ${booking.id} created`, 'booking_created', booking.id);
    this.saveAll();
    return booking;
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId, newStatus, metadata = {}) {
    const booking = this.findBooking(bookingId);
    if (!booking) return null;

    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();

    // Handle status transitions
    switch (newStatus) {
      case 'confirmed':
        this.createNotification(
          booking.clientId,
          'Your booking has been confirmed',
          'booking_confirmed',
          bookingId
        );
        break;
      case 'assigned':
        booking.assignedStaff = metadata.staffId || null;
        booking.assignedTeam = metadata.team || [];
        this.createAssignment(bookingId, metadata.staffId, metadata.team);
        this.createNotification(
          booking.clientId,
          'Staff assigned to your booking',
          'staff_assigned',
          bookingId
        );
        break;
      case 'in-progress':
        this.createNotification(
          booking.clientId,
          'Cleaning service in progress',
          'service_started',
          bookingId
        );
        break;
      case 'completed':
        booking.completedAt = new Date().toISOString();
        this.performanceMetrics.completedBookings++;
        this.createNotification(
          booking.clientId,
          'Your cleaning service is complete. Please rate your experience',
          'service_completed',
          bookingId
        );
        break;
      case 'cancelled':
        this.performanceMetrics.cancelledBookings++;
        this.createNotification(
          booking.clientId,
          'Your booking has been cancelled',
          'booking_cancelled',
          bookingId
        );
        break;
    }

    this.saveAll();
    return booking;
  }

  /**
   * Assign staff to a booking
   */
  createAssignment(bookingId, staffId, teamMembers = []) {
    const booking = this.findBooking(bookingId);
    if (!booking) return null;

    const assignment = {
      id: `ASN-${Date.now()}`,
      bookingId: bookingId,
      staffId: staffId,
      teamMembers: teamMembers,
      assignedAt: new Date().toISOString(),
      status: 'assigned', // assigned, acknowledged, en-route, arrived, in-progress, completed
      estimatedArrivalTime: new Date(new Date(booking.date + ' ' + booking.time).getTime() + 30 * 60000),
      actualArrivalTime: null,
      completionTime: null,
      notes: '',
      equipment: [],
      issues: []
    };

    this.assignments.push(assignment);
    booking.assignedStaff = staffId;
    booking.assignedTeam = teamMembers;

    this.saveAll();
    return assignment;
  }

  /**
   * Update assignment status
   */
  updateAssignmentStatus(assignmentId, status, metadata = {}) {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    if (!assignment) return null;

    assignment.status = status;

    if (status === 'arrived') {
      assignment.actualArrivalTime = new Date().toISOString();
    } else if (status === 'completed') {
      assignment.completionTime = new Date().toISOString();
    }

    Object.assign(assignment, metadata);
    this.saveAll();
    return assignment;
  }

  /**
   * Create a notification
   */
  createNotification(clientId, message, type, relatedId) {
    const notification = {
      id: `NOT-${Date.now()}`,
      clientId: clientId,
      message: message,
      type: type, // booking_created, booking_confirmed, staff_assigned, service_started, service_completed, booking_cancelled
      relatedId: relatedId,
      read: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    this.notifications.push(notification);
    this.saveAll();
    return notification;
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveAll();
    }
    return notification;
  }

  /**
   * Get unread notifications for a client
   */
  getUnreadNotifications(clientId) {
    return this.notifications.filter(n => n.clientId === clientId && !n.read);
  }

  /**
   * Get all notifications for a client
   */
  getClientNotifications(clientId, limit = 20) {
    return this.notifications
      .filter(n => n.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  /**
   * Add booking to client history
   */
  addToClientHistory(clientId, booking) {
    if (!this.clientHistory[clientId]) {
      this.clientHistory[clientId] = {
        clientId: clientId,
        totalBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        averageRating: 0,
        preferences: [],
        bookingHistory: [],
        lastBooking: null
      };
    }

    const history = this.clientHistory[clientId];
    history.totalBookings++;
    history.totalSpent += booking.price;
    history.bookingHistory.push(booking.id);
    history.lastBooking = new Date().toISOString();

    this.saveAll();
    return history;
  }

  /**
   * Get client booking history
   */
  getClientHistory(clientId) {
    return this.clientHistory[clientId] || null;
  }

  /**
   * Get client preferences based on history
   */
  getClientPreferences(clientId) {
    const history = this.getClientHistory(clientId);
    if (!history) return null;

    const bookings = this.bookings.filter(b => b.clientId === clientId);
    const serviceStats = {};
    const freqStats = {};

    bookings.forEach(booking => {
      serviceStats[booking.serviceName] = (serviceStats[booking.serviceName] || 0) + 1;
      freqStats[booking.frequency] = (freqStats[booking.frequency] || 0) + 1;
    });

    return {
      preferredServices: Object.entries(serviceStats)
        .sort((a, b) => b[1] - a[1])
        .map(([service, count]) => ({ service, count }))
        .slice(0, 5),
      preferredFrequency: Object.entries(freqStats)
        .sort((a, b) => b[1] - a[1])
        .map(([freq, count]) => ({ frequency: freq, count })),
      averageSpend: history.totalSpent / history.totalBookings,
      loyaltyLevel: history.totalBookings >= 10 ? 'VIP' : history.totalBookings >= 5 ? 'Regular' : 'New'
    };
  }

  /**
   * Rate a completed booking
   */
  rateBooking(bookingId, rating, feedback) {
    const booking = this.findBooking(bookingId);
    if (!booking || booking.status !== 'completed') return null;

    booking.rating = rating;
    booking.feedback = feedback;
    booking.updatedAt = new Date().toISOString();

    // Update performance metrics
    const currentAverage = this.performanceMetrics.averageRating || 0;
    const totalRatings = this.bookings.filter(b => b.rating !== null).length;
    this.performanceMetrics.averageRating = 
      (currentAverage * (totalRatings - 1) + rating) / totalRatings;

    this.performanceMetrics.clientSatisfaction = this.performanceMetrics.averageRating * 20;

    // Update client history rating
    const history = this.getClientHistory(booking.clientId);
    if (history) {
      const clientRatings = this.bookings
        .filter(b => b.clientId === booking.clientId && b.rating !== null)
        .map(b => b.rating);
      history.averageRating = clientRatings.length > 0
        ? clientRatings.reduce((a, b) => a + b) / clientRatings.length
        : 0;
    }

    this.saveAll();
    return booking;
  }

  /**
   * Get all bookings for a time range
   */
  getBookingsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= start && bookingDate <= end;
    });
  }

  /**
   * Get available time slots for a service on a specific date
   */
  getAvailableTimeSlots(serviceId, date, duration) {
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const bookedSlots = this.bookings.filter(b => 
      b.date === date && 
      (b.status === 'pending' || b.status === 'confirmed' || b.status === 'assigned' || b.status === 'in-progress')
    );

    return timeSlots.filter(slot => {
      const slotTime = new Date(`${date}T${slot}`);
      const slotEndTime = new Date(slotTime.getTime() + duration * 60 * 60000);

      return !bookedSlots.some(booking => {
        const bookingTime = new Date(`${booking.date}T${booking.time}`);
        const bookingEndTime = new Date(bookingTime.getTime() + booking.duration * 60 * 60000);
        return (slotTime >= bookingTime && slotTime < bookingEndTime) ||
               (slotEndTime > bookingTime && slotEndTime <= bookingEndTime);
      });
    });
  }

  /**
   * Find a booking by ID
   */
  findBooking(bookingId) {
    return this.bookings.find(b => b.id === bookingId);
  }

  /**
   * Get all bookings for a client
   */
  getClientBookings(clientId) {
    return this.bookings.filter(b => b.clientId === clientId);
  }

  /**
   * Get upcoming bookings for a client
   */
  getUpcomingBookings(clientId) {
    const today = new Date().toISOString().split('T')[0];
    return this.getClientBookings(clientId)
      .filter(b => b.date >= today && (b.status === 'confirmed' || b.status === 'assigned' || b.status === 'pending'))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get completed bookings for a client
   */
  getCompletedBookings(clientId) {
    return this.getClientBookings(clientId)
      .filter(b => b.status === 'completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId, reason) {
    const booking = this.findBooking(bookingId);
    if (!booking) return null;

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return null; // Cannot cancel completed or already cancelled bookings
    }

    booking.cancelReason = reason;
    booking.cancelledAt = new Date().toISOString();
    this.updateBookingStatus(bookingId, 'cancelled');

    // Handle refund/credit
    if (booking.paymentStatus === 'completed') {
      booking.refundStatus = 'pending';
      booking.refundAmount = booking.price;
    }

    this.saveAll();
    return booking;
  }

  /**
   * Reschedule a booking
   */
  rescheduleBooking(bookingId, newDate, newTime) {
    const booking = this.findBooking(bookingId);
    if (!booking) return null;

    if (['completed', 'cancelled'].includes(booking.status)) {
      return null; // Cannot reschedule completed or cancelled bookings
    }

    booking.originalDate = booking.date;
    booking.originalTime = booking.time;
    booking.date = newDate;
    booking.time = newTime;
    booking.rescheduledAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    this.createNotification(
      booking.clientId,
      `Booking rescheduled to ${newDate} at ${newTime}`,
      'booking_rescheduled',
      bookingId
    );

    this.saveAll();
    return booking;
  }

  /**
   * Get analytics and metrics
   */
  getAnalytics() {
    const analytics = {
      summary: {
        totalBookings: this.bookings.length,
        pendingBookings: this.bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: this.bookings.filter(b => b.status === 'confirmed').length,
        assignedBookings: this.bookings.filter(b => b.status === 'assigned').length,
        inProgressBookings: this.bookings.filter(b => b.status === 'in-progress').length,
        completedBookings: this.performanceMetrics.completedBookings,
        cancelledBookings: this.performanceMetrics.cancelledBookings,
        averageRating: this.performanceMetrics.averageRating.toFixed(1),
        clientSatisfaction: this.performanceMetrics.clientSatisfaction.toFixed(1) + '%'
      },
      revenue: {
        totalRevenue: this.bookings
          .filter(b => b.status === 'completed' && b.paymentStatus === 'completed')
          .reduce((sum, b) => sum + b.price, 0),
        pendingRevenue: this.bookings
          .filter(b => ['pending', 'confirmed', 'assigned'].includes(b.status))
          .reduce((sum, b) => sum + b.price, 0),
        averageBookingValue: this.bookings.length > 0
          ? this.bookings.reduce((sum, b) => sum + b.price, 0) / this.bookings.length
          : 0
      },
      services: this.getServiceAnalytics(),
      timeline: this.getBookingTimeline()
    };

    return analytics;
  }

  /**
   * Get service analytics
   */
  getServiceAnalytics() {
    const serviceData = {};

    this.bookings.forEach(booking => {
      if (!serviceData[booking.serviceName]) {
        serviceData[booking.serviceName] = {
          name: booking.serviceName,
          category: booking.serviceCategory,
          totalBookings: 0,
          completedBookings: 0,
          revenue: 0,
          averageRating: 0,
          ratings: []
        };
      }

      const service = serviceData[booking.serviceName];
      service.totalBookings++;
      service.revenue += booking.price;

      if (booking.status === 'completed') {
        service.completedBookings++;
        if (booking.rating) {
          service.ratings.push(booking.rating);
        }
      }
    });

    Object.values(serviceData).forEach(service => {
      if (service.ratings.length > 0) {
        service.averageRating = (service.ratings.reduce((a, b) => a + b, 0) / service.ratings.length).toFixed(1);
      }
    });

    return Object.values(serviceData).sort((a, b) => b.totalBookings - a.totalBookings);
  }

  /**
   * Get booking timeline (for charts)
   */
  getBookingTimeline(days = 30) {
    const timeline = {};
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      timeline[dateStr] = { date: dateStr, bookings: 0, revenue: 0 };
    }

    this.bookings.forEach(booking => {
      const dateStr = booking.date;
      if (timeline[dateStr]) {
        timeline[dateStr].bookings++;
        if (booking.status === 'completed') {
          timeline[dateStr].revenue += booking.price;
        }
      }
    });

    return Object.values(timeline);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for booking creation from the main app
    document.addEventListener('booking:created', (e) => {
      console.log('📅 New booking created:', e.detail);
    });

    document.addEventListener('booking:updated', (e) => {
      console.log('✏️ Booking updated:', e.detail);
    });
  }

  /**
   * Auto-sync data periodically
   */
  startAutoSync() {
    setInterval(() => {
      this.saveAll();
      console.log('🔄 Booking system auto-sync');
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Export booking data
   */
  exportBookingData(format = 'json') {
    const data = {
      bookings: this.bookings,
      assignments: this.assignments,
      notifications: this.notifications,
      clientHistory: this.clientHistory,
      performanceMetrics: this.performanceMetrics,
      generatedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      return this.convertToCSV(this.bookings);
    }

    return data;
  }

  /**
   * Convert bookings to CSV
   */
  convertToCSV(bookings) {
    const headers = ['ID', 'Client Name', 'Service', 'Date', 'Time', 'Status', 'Price', 'Rating'];
    const rows = bookings.map(b => [
      b.id,
      b.clientName,
      b.serviceName,
      b.date,
      b.time,
      b.status,
      b.price,
      b.rating || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Get system health check
   */
  getSystemHealth() {
    return {
      status: 'operational',
      dataIntegrity: this.validateData(),
      bookingsCount: this.bookings.length,
      assignmentsCount: this.assignments.length,
      notificationsCount: this.notifications.length,
      lastSyncTime: new Date().toISOString(),
      systemUptime: 'stable'
    };
  }

  /**
   * Validate system data integrity
   */
  validateData() {
    const issues = [];

    // Check for bookings without clients
    this.bookings.forEach(booking => {
      if (!booking.clientId || !booking.clientName) {
        issues.push(`Booking ${booking.id} missing client information`);
      }
      if (!booking.serviceId || !booking.serviceName) {
        issues.push(`Booking ${booking.id} missing service information`);
      }
    });

    // Check for orphaned assignments
    this.assignments.forEach(assignment => {
      if (!this.findBooking(assignment.bookingId)) {
        issues.push(`Assignment ${assignment.id} references non-existent booking`);
      }
    });

    return issues.length === 0 ? 'valid' : `invalid (${issues.length} issues)`;
  }
}

// Initialize the booking system manager when the app loads
let bookingSystemManager;
document.addEventListener('DOMContentLoaded', () => {
  if (typeof booking !== 'undefined') {
    bookingSystemManager = new BookingSystemManager();
    console.log('✅ Booking System Manager loaded');
  }
});
