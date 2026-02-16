/**
 * PROSPARK ENTERPRISE - ANALYTICS & AI MODULE
 * Dashboard, predictions, AI features, and data analysis
 */

class AnalyticsEngine {
  constructor() {
    this.loadAnalyticsData();
  }

  /**
   * Load analytics data
   */
  loadAnalyticsData() {
    this.revenueData = this.generateRevenueData();
    this.customerData = this.generateCustomerData();
    this.serviceData = this.generateServiceData();
    this.pred = this.loadictionsPredictions();
  }

  /**
   * Generate revenue data
   */
  generateRevenueData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month: month,
      revenue: Math.floor(Math.random() * 500000) + 300000,
      expenses: Math.floor(Math.random() * 200000) + 100000,
      bookings: Math.floor(Math.random() * 100) + 50,
      newCustomers: Math.floor(Math.random() * 20) + 5,
      monthIndex: index
    }));
  }

  /**
   * Generate customer data
   */
  generateCustomerData() {
    return {
      total: 156,
      active: 89,
      newThisMonth: 12,
      churnRate: 3.2,
      avgLifetimeValue: 45000,
      repeatRate: 67,
      segments: [
        { name: 'Residential', count: 78, percentage: 50 },
        { name: 'Commercial', count: 45, percentage: 29 },
        { name: 'Industrial', count: 18, percentage: 12 },
        { name: 'Hospitality', count: 15, percentage: 9 }
      ],
      topCities: [
        { city: 'Nairobi', customers: 89 },
        { city: 'Mombasa', customers: 23 },
        { city: 'Kisumu', customers: 18 },
        { city: 'Nakuru', customers: 14 },
        { city: 'Eldoret', customers: 12 }
      ]
    };
  }

  /**
   * Generate service data
   */
  generateServiceData() {
    return [
      { service: 'Residential', bookings: 234, revenue: 1170000, growth: 12 },
      { service: 'Apartment', bookings: 156, revenue: 624000, growth: 8 },
      { service: 'Office', bookings: 89, revenue: 1335000, growth: 15 },
      { service: 'Hospital', bookings: 23, revenue: 575000, growth: 5 },
      { service: 'Hospitality', bookings: 67, revenue: 234500, growth: 22 },
      { service: 'Industrial', bookings: 12, revenue: 360000, growth: -3 },
      { service: 'Other', bookings: 45, revenue: 315000, growth: 10 }
    ];
  }

  /**
   * Load predictions
   */
  loadPredictions() {
    return {
      nextMonthRevenue: Math.floor(Math.random() * 200000) + 600000,
      demandForecast: this.generateDemandForecast(),
      customerChurnRisk: this.analyzeChurnRisk(),
      popularServices: ['residential', 'office', 'hospitality']
    };
  }

  /**
   * Generate demand forecast
   */
  generateDemandForecast() {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Simulate demand patterns (higher on weekdays)
      const dayOfWeek = date.getDay();
      let baseDemand = 15;
      if (dayOfWeek === 0 || dayOfWeek === 6) baseDemand = 25; // Higher on weekends
      if (dayOfWeek === 1) baseDemand = 10; // Lower on Monday
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        predictedDemand: baseDemand + Math.floor(Math.random() * 10),
        confidence: 0.75 + Math.random() * 0.2
      });
    }
    
    return days;
  }

  /**
   * Analyze churn risk
   */
  analyzeChurnRisk() {
    const customers = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    const customersData = customers.filter(c => c.role === 'customer');
    
    return customersData.map(c => ({
      customerId: c.id,
      name: c.name,
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      lastBooking: c.lastLogin || c.created,
      bookingCount: Math.floor(Math.random() * 20),
      daysSinceLastBooking: Math.floor(Math.random() * 90)
    }));
  }

  /**
   * AI Price Prediction
   */
  predictPrice(serviceId, options = {}) {
    const service = EnterpriseServices.getServiceById(serviceId);
    if (!service) return null;

    let basePrice = service.basePrice;
    let confidence = 0.85;

    // AI factors
    if (options.urgency) {
      basePrice *= 1.2; // Same-day premium
      confidence -= 0.05;
    }

    if (options.size === 'large') {
      basePrice *= 1.5;
      confidence -= 0.02;
    }

    if (options.recurring) {
      basePrice *= 0.9; // Discount for recurring
      confidence += 0.05;
    }

    // Demand-based pricing
    const demandFactor = this.getDemandFactor(serviceId);
    basePrice *= demandFactor;
    confidence -= 0.05;

    return {
      predictedPrice: Math.round(basePrice),
      confidence: confidence,
      factors: [
        { name: 'Base Price', impact: service.basePrice },
        { name: 'Demand', impact: demandFactor > 1 ? 'High demand (+' + Math.round((demandFactor - 1) * 100) + '%)' : 'Normal' },
        { name: 'Urgency', impact: options.urgency ? 'Same-day (+20%)' : 'Standard' },
        { name: 'Property Size', impact: options.size === 'large' ? 'Large property (+50%)' : 'Standard' }
      ]
    };
  }

  /**
   * Get demand factor
   */
  getDemandFactor(serviceId) {
    // Simulate demand patterns
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    let factor = 1.0;
    
    // Time-based demand
    if (hour >= 9 && hour <= 11) factor *= 1.15;
    if (hour >= 14 && hour <= 16) factor *= 1.1;
    
    // Day-based demand
    if (day === 5) factor *= 1.2; // Friday
    if (day === 6 || day === 0) factor *= 1.25; // Weekend
    
    return factor;
  }

  /**
   * AI Service Recommendation
   */
  recommendServices(userId, context = {}) {
    const user = this.getUserPreferences(userId);
    const allServices = EnterpriseServices.services;
    
    // Score each service
    const recommendations = allServices.map(service => {
      let score = 50; // Base score
      
      // User history factor
      if (user?.previousServices?.includes(service.id)) {
        score += 20;
      }
      
      // Context factors
      if (context.time === 'weekend' && service.popular) {
        score += 15;
      }
      
      // Seasonal (simplified)
      const month = new Date().getMonth();
      if (month === 2 || month === 3) { // March/April - spring cleaning
        if (service.id === 'deepclean' || service.id === 'residential') {
          score += 20;
        }
      }
      
      return {
        ...service,
        recommendationScore: score,
        reason: this.getRecommendationReason(service, user, context)
      };
    });
    
    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 5);
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId) {
    const users = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    return users.find(u => u.id === userId);
  }

  /**
   * Get recommendation reason
   */
  getRecommendationReason(service, user, context) {
    if (user?.previousServices?.includes(service.id)) {
      return 'Based on your previous bookings';
    }
    if (service.popular) {
      return 'Popular choice in your area';
    }
    return 'Recommended for you';
  }

  /**
   * Customer Behavior Analytics
   */
  analyzeCustomerBehavior(userId) {
    const user = this.getUserPreferences(userId);
    const bookings = JSON.parse(localStorage.getItem('prospark_bookings') || '[]');
    const userBookings = bookings.filter(b => b.customerId === userId);
    
    return {
      totalBookings: userBookings.length,
      favoriteService: this.getMostBookedService(userBookings),
      averageSpend: this.calculateAverageSpend(userBookings),
      preferredTime: this.getPreferredTime(userBookings),
      bookingFrequency: this.getBookingFrequency(userBookings),
      lifetimeValue: user?.loyaltyPoints ? user.loyaltyPoints * 100 : 0,
      nextBestAction: this.predictNextAction(user, userBookings)
    };
  }

  /**
   * Get most booked service
   */
  getMostBookedService(bookings) {
    if (bookings.length === 0) return null;
    
    const counts = {};
    bookings.forEach(b => {
      counts[b.serviceType] = (counts[b.serviceType] || 0) + 1;
    });
    
    const max = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return EnterpriseServices.getServiceById(max);
  }

  /**
   * Calculate average spend
   */
  calculateAverageSpend(bookings) {
    if (bookings.length === 0) return 0;
    return bookings.reduce((sum, b) => sum + (b.price || 0), 0) / bookings.length;
  }

  /**
   * Get preferred time
   */
  getPreferredTime(bookings) {
    if (bookings.length === 0) return { day: 'weekday', time: 'morning' };
    
    const times = bookings.map(b => ({
      day: new Date(b.scheduledDate).getDay(),
      hour: parseInt(b.scheduledTime?.split(':')[0] || 10)
    }));
    
    const avgHour = times.reduce((sum, t) => sum + t.hour, 0) / times.length;
    const weekendCount = times.filter(t => t.day === 0 || t.day === 6).length;
    
    return {
      day: weekendCount > times.length / 2 ? 'weekend' : 'weekday',
      time: avgHour < 12 ? 'morning' : avgHour < 17 ? 'afternoon' : 'evening'
    };
  }

  /**
   * Get booking frequency
   */
  getBookingFrequency(bookings) {
    if (bookings.length < 2) return 'new';
    
    const dates = bookings.map(b => new Date(b.scheduledDate).getTime()).sort();
    const intervals = [];
    
    for (let i = 1; i < dates.length; i++) {
      intervals.push(dates[i] - dates[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const daysBetween = avgInterval / (1000 * 60 * 60 * 24);
    
    if (daysBetween < 14) return 'weekly';
    if (daysBetween < 45) return 'biweekly';
    if (daysBetween < 90) return 'monthly';
    return 'occasional';
  }

  /**
   * Predict next action
   */
  predictNextAction(user, bookings) {
    const freq = this.getBookingFrequency(bookings);
    const lastBooking = bookings[0];
    
    if (freq === 'new') {
      return { action: 'Book first service', urgency: 'high' };
    }
    
    if (lastBooking?.status === 'completed') {
      return { action: 'Leave a review', urgency: 'medium' };
    }
    
    return { action: 'Book recurring service', urgency: 'low' };
  }

  /**
   * Auto-Fraud Detection
   */
  detectFraud(transaction) {
    const riskFactors = [];
    let riskScore = 0;
    
    // Unusual amount
    if (transaction.amount > 100000) {
      riskFactors.push('High transaction amount');
      riskScore += 30;
    }
    
    // Unusual location (mock)
    if (transaction.location && transaction.location !== 'Nairobi') {
      riskFactors.push('Unusual location');
      riskScore += 20;
    }
    
    // Multiple failed attempts (would check in real system)
    if (Math.random() > 0.95) {
      riskFactors.push('Multiple payment attempts');
      riskScore += 40;
    }
    
    return {
      isFraud: riskScore > 50,
      riskScore: riskScore,
      riskFactors: riskFactors,
      recommendation: riskScore > 50 ? 'Review manually' : 'Approve'
    };
  }

  /**
   * Get Dashboard Data
   */
  getDashboardData() {
    const revenue = this.revenueData[this.revenueData.length - 1];
    const previousRevenue = this.revenueData[this.revenueData.length - 2];
    
    const revenueGrowth = ((revenue.revenue - previousRevenue.revenue) / previousRevenue.revenue * 100).toFixed(1);
    const bookingGrowth = ((revenue.bookings - previousRevenue.bookings) / previousRevenue.bookings * 100).toFixed(1);

    return {
      summary: {
        totalRevenue: revenue.revenue,
        revenueGrowth: revenueGrowth,
        totalBookings: revenue.bookings,
        bookingGrowth: bookingGrowth,
        totalCustomers: this.customerData.total,
        activeCustomers: this.customerData.active,
        avgRating: 4.7
      },
      revenueChart: this.revenueData.slice(-6),
      topServices: this.serviceData.slice(0, 5),
      customerSegments: this.customerData.segments,
      recentActivity: this.getRecentActivity()
    };
  }

  /**
   * Get recent activity
   */
  getRecentActivity() {
    return [
      { type: 'booking', message: 'New booking: Residential Cleaning', time: '5 min ago', icon: '📅' },
      { type: 'payment', message: 'Payment received: Ksh 5,500', time: '15 min ago', icon: '💰' },
      { type: 'customer', message: 'New customer registration', time: '1 hour ago', icon: '👤' },
      { type: 'review', message: 'New 5-star review', time: '2 hours ago', icon: '⭐' },
      { type: 'staff', message: 'Staff check-in: Mary Akinyi', time: '3 hours ago', icon: '👷' }
    ];
  }

  /**
   * Generate KPI Report
   */
  generateKPIReport() {
    const revenue = this.revenueData.reduce((sum, r) => sum + r.revenue, 0);
    const expenses = this.revenueData.reduce((sum, r) => sum + r.expenses, 0);
    const bookings = this.revenueData.reduce((sum, r) => sum + r.bookings, 0);
    
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      profitMargin: ((revenue - expenses) / revenue * 100).toFixed(1),
      totalBookings: bookings,
      avgRevenuePerBooking: Math.round(revenue / bookings),
      customerLifetimeValue: this.customerData.avgLifetimeValue,
      customerRetentionRate: (100 - this.customerData.churnRate).toFixed(1),
      employeeProductivity: Math.round(bookings / 5), // 5 staff
      kpis: {
        revenueGrowth: '+12.5%',
        customerGrowth: '+8.3%',
        bookingGrowth: '+15.2%',
        profitGrowth: '+9.8%'
      }
    };
  }

  /**
   * Chatbot Response (Mock AI)
   */
  getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
      greeting: ['Hello! How can I help you today?', 'Hi there! What can I assist you with?'],
      booking: ['I can help you book a service! Would you like to schedule a cleaning?', 'Great! Let me help you book a service. What type of cleaning do you need?'],
      pricing: ['Our pricing varies by service. Would you like me to show you our price list?', 'I can provide pricing information. Which service are you interested in?'],
      location: ['We service Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret. Which location are you in?'],
      contact: ['You can reach us at 0799-802-509 or email us at info@prospark.ke'],
      default: ['I\'m here to help! Could you please clarify your question?']
    };

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    if (lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return responses.booking[Math.floor(Math.random() * responses.booking.length)];
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return responses.pricing[Math.floor(Math.random() * responses.pricing.length)];
    }
    if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('area')) {
      return responses.location[Math.floor(Math.random() * responses.location.length)];
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return responses.contact[Math.floor(Math.random() * responses.contact.length)];
    }
    
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
}

// Initialize Analytics
window.AnalyticsEngine = AnalyticsEngine;
