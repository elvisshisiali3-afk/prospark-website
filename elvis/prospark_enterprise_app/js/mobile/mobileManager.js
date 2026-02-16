/**
 * PROSPARK ENTERPRISE - MOBILE & PWA MODULE
 * Offline mode, push notifications, voice commands, and mobile features
 */

class MobileManager {
  constructor() {
    this.offlineMode = !navigator.onLine;
    this.notifications = this.loadNotifications();
    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  setupListeners() {
    // Online/offline detection
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Visibility change for background sync
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    // Push notifications (simulated)
    if ('Notification' in window) {
      this.setupNotificationPermission();
    }

    // Voice commands
    this.setupVoiceCommands();

    // Install prompt
    this.setupInstallPrompt();
  }

  /**
   * Load notifications
   */
  loadNotifications() {
    const stored = localStorage.getItem('prospark_notifications');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save notifications
   */
  saveNotifications() {
    localStorage.setItem('prospark_notifications', JSON.stringify(this.notifications));
  }

  /**
   * Handle online status
   */
  handleOnline() {
    this.offlineMode = false;
    this.showStatusMessage('Back online! Syncing data...');
    this.syncOfflineData();
  }

  /**
   * Handle offline status
   */
  handleOffline() {
    this.offlineMode = true;
    this.showStatusMessage('You are offline. Data will sync when connected.');
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // Refresh data when app comes to foreground
      this.refreshData();
    }
  }

  /**
   * Show status message
   */
  showStatusMessage(message) {
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = this.offlineMode ? 'offline' : 'online';
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = '';
      }, 3000);
    }
  }

  /**
   * Sync offline data
   */
  syncOfflineData() {
    const offlineActions = JSON.parse(localStorage.getItem('prospark_offline_actions') || '[]');
    
    if (offlineActions.length === 0) return;

    console.log(`Syncing ${offlineActions.length} offline actions...`);
    
    // Process offline actions
    offlineActions.forEach(action => {
      // In real app, would send to server
      console.log('Synced:', action);
    });

    // Clear offline actions after sync
    localStorage.removeItem('prospark_offline_actions');
  }

  /**
   * Store offline action
   */
  storeOfflineAction(action) {
    const offlineActions = JSON.parse(localStorage.getItem('prospark_offline_actions') || '[]');
    offlineActions.push({
      ...action,
      timestamp: new Date(),
      synced: false
    });
    localStorage.setItem('prospark_offline_actions', JSON.stringify(offlineActions));
  }

  /**
   * Refresh data
   */
  refreshData() {
    // Refresh data from storage
    if (window.auth) {
      auth.loadStoredData();
    }
    if (window.booking) {
      booking.loadBookings();
    }
  }

  /**
   * Setup notification permission
   */
  setupNotificationPermission() {
    if (Notification.permission === 'default') {
      // Will request on user action
      console.log('Notifications permission default');
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return { success: false, message: 'Notifications not supported' };
    }

    try {
      const permission = await Notification.requestPermission();
      return { success: permission === 'granted', message: permission };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Send local notification
   */
  sendNotification(title, options = {}) {
    if (Notification.permission !== 'granted') {
      console.log('Notifications not permitted');
      return null;
    }

    const notification = new Notification(title, {
      icon: options.icon || '/icon.png',
      badge: options.badge || '/badge.png',
      body: options.body || '',
      tag: options.tag || 'prospark',
      data: options.data || {},
      requireInteraction: options.requireInteraction || false
    });

    notification.onclick = () => {
      window.focus();
      if (options.onClick) options.onClick();
      notification.close();
    };

    // Store notification
    this.notifications.unshift({
      id: 'NOTIF-' + Date.now(),
      title: title,
      body: options.body,
      timestamp: new Date(),
      read: false
    });
    this.saveNotifications();

    return notification;
  }

  /**
   * Send booking reminder
   */
  sendBookingReminder(booking) {
    const service = EnterpriseServices.getServiceById(booking.serviceType);
    this.sendNotification('Booking Reminder', {
      body: `Your ${service?.name || 'cleaning'} is scheduled for tomorrow`,
      tag: 'booking-reminder',
      data: { bookingId: booking.id }
    });
  }

  /**
   * Send payment confirmation
   */
  sendPaymentConfirmation(amount) {
    this.sendNotification('Payment Successful', {
      body: `Ksh ${amount.toLocaleString()} has been received`,
      tag: 'payment',
      data: { type: 'payment' }
    });
  }

  /**
   * Get notifications
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Mark notification as read
   */
  markNotificationRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * Setup voice commands
   */
  setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      this.voiceCommandsEnabled = false;
      return;
    }

    this.voiceCommandsEnabled = true;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.processVoiceCommand(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
    };
  }

  /**
   * Process voice command
   */
  processVoiceCommand(command) {
    console.log('Voice command:', command);

    const commands = {
      'book': () => window.location.href = 'booking.html',
      'book cleaning': () => window.location.href = 'booking.html',
      'dashboard': () => window.location.href = 'dashboard.html',
      'home': () => window.location.href = 'index.html',
      'logout': () => auth && auth.logout(),
      'check bookings': () => {
        if (window.booking) booking.showBookings();
      },
      'check wallet': () => {
        const wallet = finance.getWalletBalance(auth.currentUser.id);
        app.showAlert(`Wallet Balance: Ksh ${wallet.balance.toLocaleString()}`, 'info');
      }
    };

    // Find matching command
    for (const [key, action] of Object.entries(commands)) {
      if (command.includes(key)) {
        action();
        return;
      }
    }

    // Fallback to chatbot
    if (window.analytics) {
      const response = analytics.getChatbotResponse(command);
      app.showAlert(response, 'info');
    }
  }

  /**
   * Start voice recognition
   */
  startVoiceRecognition() {
    if (!this.voiceCommandsEnabled) {
      app.showAlert('Voice commands not supported in this browser', 'warning');
      return;
    }

    try {
      this.recognition.start();
      app.showAlert('Listening...', 'info');
    } catch (error) {
      console.error('Voice recognition error:', error);
    }
  }

  /**
   * Setup install prompt
   */
  setupInstallPrompt() {
    this.deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      console.log('PWA installed');
    });
  }

  /**
   * Show install prompt
   */
  showInstallPrompt() {
    const installButton = document.getElementById('install-app');
    if (installButton && this.deferredPrompt) {
      installButton.style.display = 'block';
    }
  }

  /**
   * Install app
   */
  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App installed');
    }
    
    this.deferredPrompt = null;
  }

  /**
   * Generate QR code (mock)
   */
  generateQRCode(data) {
    // In real app, would use a QR library
    return `QR-${btoa(data).substring(0, 20)}`;
  }

  /**
   * Scan QR code (mock simulation)
   */
  scanQRCode(code) {
    if (code.startsWith('BKG-')) {
      return { type: 'booking', id: code };
    }
    if (code.startsWith('STAFF-')) {
      return { type: 'staff', id: code };
    }
    return { type: 'unknown' };
  }

  /**
   * Check in with QR
   */
  checkInWithQR(bookingId, qrCode) {
    const scan = this.scanQRCode(qrCode);
    
    if (scan.type === 'booking') {
      return { success: true, message: 'Check-in successful!', bookingId: scan.id };
    }
    
    return { success: false, message: 'Invalid QR code' };
  }

  /**
   * Get device info
   */
  getDeviceInfo() {
    return {
      online: navigator.onLine,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: screen.width,
      screenHeight: screen.height,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isPWA: window.matchMedia('(display-mode: standalone)').matches
    };
  }

  /**
   * Share content
   */
  async shareContent(data) {
    if (!navigator.share) {
      return { success: false, message: 'Share not supported' };
    }

    try {
      await navigator.share(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get AR preview (mock)
   */
  getARPreview(serviceId) {
    return {
      available: true,
      features: ['Room scanning', 'Cleaning preview', 'Before/After comparison'],
      message: 'Point your camera at the room to see the cleaning preview'
    };
  }

  /**
   * Simulate smart home integration
   */
  getSmartHomeStatus() {
    return {
      connected: true,
      devices: [
        { name: 'Smart Thermostat', status: 'off', room: 'Living Room' },
        { name: 'Smart Lights', status: 'on', room: 'Hallway' },
        { name: 'Robot Vacuum', status: 'charging', room: 'Utility' }
      ],
      integration: 'Google Home, Alexa compatible'
    };
  }

  /**
   * Get PWA install banner
   */
  shouldShowInstallBanner() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('prospark_install_dismissed');
    
    return isMobile && !isStandalone && !dismissed && this.deferredPrompt;
  }

  /**
   * Dismiss install banner
   */
  dismissInstallBanner() {
    localStorage.setItem('prospark_install_dismissed', 'true');
  }
}

// Initialize Mobile
window.MobileManager = MobileManager;
