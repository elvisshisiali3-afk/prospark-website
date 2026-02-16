/**
 * PROSPARK ENTERPRISE - ADVANCED ADMIN MODULE
 * Multi-role access, audit trails, compliance, and admin features
 */

class AdminManager {
  constructor() {
    this.auditLog = this.loadAuditLog();
    this.alerts = this.loadAlerts();
    this.approvals = this.loadApprovals();
  }

  /**
   * Load audit log
   */
  loadAuditLog() {
    const stored = localStorage.getItem('prospark_audit_log');
    return stored ? JSON.parse(stored) : this.getDefaultAuditLog();
  }

  /**
   * Get default audit log
   */
  getDefaultAuditLog() {
    return [
      {
        id: 'AUDIT-001',
        action: 'user_login',
        userId: 'USR-001',
        userName: 'Elvis Shisiali',
        role: 'ceo',
        details: 'Successful login',
        ip: '192.168.1.100',
        timestamp: new Date('2024-12-28T09:30:00')
      },
      {
        id: 'AUDIT-002',
        action: 'booking_created',
        userId: 'USR-006',
        userName: 'John Doe',
        role: 'customer',
        details: 'New booking BKG-001 created',
        ip: '192.168.1.150',
        timestamp: new Date('2024-12-28T10:15:00')
      },
      {
        id: 'AUDIT-003',
        action: 'booking_completed',
        userId: 'USR-004',
        userName: 'David Mwangi',
        role: 'supervisor',
        details: 'Booking BKG-001 marked as completed',
        ip: '192.168.1.120',
        timestamp: new Date('2024-12-28T14:30:00')
      },
      {
        id: 'AUDIT-004',
        action: 'payment_processed',
        userId: 'USR-001',
        userName: 'Elvis Shisiali',
        role: 'ceo',
        details: 'Payment TXN-001 processed - Ksh 5,500',
        ip: '192.168.1.100',
        timestamp: new Date('2024-12-28T14:45:00')
      },
      {
        id: 'AUDIT-005',
        action: 'staff_assigned',
        userId: 'USR-002',
        userName: 'Bernard Keragu',
        role: 'manager',
        details: 'Staff STAFF-001 assigned to booking BKG-001',
        ip: '192.168.1.110',
        timestamp: new Date('2024-12-28T08:00:00')
      }
    ];
  }

  /**
   * Save audit log
   */
  saveAuditLog() {
    localStorage.setItem('prospark_audit_log', JSON.stringify(this.auditLog));
  }

  /**
   * Load alerts
   */
  loadAlerts() {
    const stored = localStorage.getItem('prospark_alerts');
    return stored ? JSON.parse(stored) : this.getDefaultAlerts();
  }

  /**
   * Get default alerts
   */
  getDefaultAlerts() {
    return [
      {
        id: 'ALERT-001',
        type: 'security',
        severity: 'medium',
        title: 'Multiple login attempts detected',
        message: '5 failed login attempts from IP 192.168.1.200',
        acknowledged: false,
        created: new Date('2024-12-28T11:00:00')
      },
      {
        id: 'ALERT-002',
        type: 'operational',
        severity: 'low',
        title: 'Low inventory alert',
        message: 'Microfiber cloths below minimum stock level',
        acknowledged: false,
        created: new Date('2024-12-28T09:00:00')
      }
    ];
  }

  /**
   * Save alerts
   */
  saveAlerts() {
    localStorage.setItem('prospark_alerts', JSON.stringify(this.alerts));
  }

  /**
   * Load approvals
   */
  loadApprovals() {
    const stored = localStorage.getItem('prospark_approvals');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save approvals
   */
  saveApprovals() {
    localStorage.setItem('prospark_approvals', JSON.stringify(this.approvals));
  }

  /**
   * Log audit action
   */
  logAuditAction(action, userId, userName, role, details) {
    const entry = {
      id: 'AUDIT-' + Date.now(),
      action: action,
      userId: userId,
      userName: userName,
      role: role,
      details: details,
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      timestamp: new Date()
    };

    this.auditLog.unshift(entry);
    if (this.auditLog.length > 1000) this.auditLog.pop();
    this.saveAuditLog();

    return entry;
  }

  /**
   * Get audit log
   */
  getAuditLog(filters = {}) {
    let result = this.auditLog;

    if (filters.action) {
      result = result.filter(a => a.action === filters.action);
    }
    if (filters.userId) {
      result = result.filter(a => a.userId === filters.userId);
    }
    if (filters.role) {
      result = result.filter(a => a.role === filters.role);
    }
    if (filters.startDate) {
      result = result.filter(a => new Date(a.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(a => new Date(a.timestamp) <= new Date(filters.endDate));
    }

    return result;
  }

  /**
   * Create approval request
   */
  createApprovalRequest(request) {
    const approval = {
      id: 'APR-' + Date.now(),
      type: request.type,
      title: request.title,
      description: request.description,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      amount: request.amount,
      status: 'pending',
      priority: request.priority || 'normal',
      created: new Date(),
      approvers: this.getApprovers(request.type),
      history: [{
        action: 'submitted',
        userId: request.requesterId,
        userName: request.requesterName,
        timestamp: new Date()
      }]
    };

    this.approvals.push(approval);
    this.saveApprovals();

    return approval;
  }

  /**
   * Get approvers based on type
   */
  getApprovers(type) {
    if (type === 'refund') {
      return [
        { role: 'supervisor', required: true, approved: false },
        { role: 'manager', required: true, approved: false }
      ];
    }
    if (type === 'expense') {
      return [
        { role: 'manager', required: true, approved: false },
        { role: 'ceo', required: true, approved: false }
      ];
    }
    return [{ role: 'manager', required: true, approved: false }];
  }

  /**
   * Approve request
   */
  approveRequest(approvalId, approverId, approverName) {
    const approval = this.approvals.find(a => a.id === approvalId);
    if (!approval) {
      return { success: false, message: 'Request not found' };
    }

    approval.approvers = approval.approvers.map(a => {
      if (!a.approved) {
        return { ...a, approved: true, approvedBy: approverName, approvedAt: new Date() };
      }
      return a;
    });

    approval.history.push({
      action: 'approved',
      userId: approverId,
      userName: approverName,
      timestamp: new Date()
    });

    // Check if all required approvals are complete
    const allApproved = approval.approvers.filter(a => a.required).every(a => a.approved);
    if (allApproved) {
      approval.status = 'approved';
    }

    this.saveApprovals();
    return { success: true, approval: approval };
  }

  /**
   * Reject request
   */
  rejectRequest(approvalId, approverId, approverName, reason) {
    const approval = this.approvals.find(a => a.id === approvalId);
    if (!approval) {
      return { success: false, message: 'Request not found' };
    }

    approval.status = 'rejected';
    approval.rejectionReason = reason;
    approval.history.push({
      action: 'rejected',
      userId: approverId,
      userName: approverName,
      reason: reason,
      timestamp: new Date()
    });

    this.saveApprovals();
    return { success: true, approval: approval };
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals(role) {
    return this.approvals.filter(a => {
      if (a.status !== 'pending') return false;
      const requiredApprovers = a.approvers.filter(ar => ar.required && !ar.approved);
      return requiredApprovers.some(ar => ar.role === role);
    });
  }

  /**
   * Get alerts
   */
  getAlerts(type = null, acknowledged = null) {
    let result = this.alerts;
    
    if (type) {
      result = result.filter(a => a.type === type);
    }
    if (acknowledged !== null) {
      result = result.filter(a => a.acknowledged === acknowledged);
    }
    
    return result;
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) {
      return { success: false, message: 'Alert not found' };
    }

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date();
    this.saveAlerts();

    return { success: true, alert: alert };
  }

  /**
   * Create alert
   */
  createAlert(alertData) {
    const alert = {
      id: 'ALERT-' + Date.now(),
      type: alertData.type,
      severity: alertData.severity,
      title: alertData.title,
      message: alertData.message,
      acknowledged: false,
      created: new Date()
    };

    this.alerts.unshift(alert);
    this.saveAlerts();

    return alert;
  }

  /**
   * Get role permissions
   */
  getRolePermissions(role) {
    const permissions = {
      ceo: {
        canViewDashboard: true,
        canViewAnalytics: true,
        canManageUsers: true,
        canManageStaff: true,
        canManageBookings: true,
        canProcessPayments: true,
        canViewFinancials: true,
        canManageInventory: true,
        canApproveRequests: true,
        canViewAuditLog: true,
        canManageSettings: true,
        canExportReports: true,
        canManageRoles: true
      },
      manager: {
        canViewDashboard: true,
        canViewAnalytics: true,
        canManageUsers: false,
        canManageStaff: true,
        canManageBookings: true,
        canProcessPayments: true,
        canViewFinancials: true,
        canManageInventory: true,
        canApproveRequests: true,
        canViewAuditLog: true,
        canManageSettings: false,
        canExportReports: true,
        canManageRoles: false
      },
      supervisor: {
        canViewDashboard: true,
        canViewAnalytics: false,
        canManageUsers: false,
        canManageStaff: true,
        canManageBookings: true,
        canProcessPayments: false,
        canViewFinancials: false,
        canManageInventory: true,
        canApproveRequests: true,
        canViewAuditLog: false,
        canManageSettings: false,
        canExportReports: false,
        canManageRoles: false
      },
      analyst: {
        canViewDashboard: true,
        canViewAnalytics: true,
        canManageUsers: false,
        canManageStaff: false,
        canManageBookings: false,
        canProcessPayments: false,
        canViewFinancials: true,
        canManageInventory: false,
        canApproveRequests: false,
        canViewAuditLog: true,
        canManageSettings: false,
        canExportReports: true,
        canManageRoles: false
      },
      customer: {
        canViewDashboard: true,
        canViewAnalytics: false,
        canManageUsers: false,
        canManageStaff: false,
        canManageBookings: true,
        canProcessPayments: true,
        canViewFinancials: false,
        canManageInventory: false,
        canApproveRequests: false,
        canViewAuditLog: false,
        canManageSettings: true,
        canExportReports: false,
        canManageRoles: false
      },
      staff: {
        canViewDashboard: true,
        canViewAnalytics: false,
        canManageUsers: false,
        canManageStaff: false,
        canManageBookings: false,
        canProcessPayments: false,
        canViewFinancials: false,
        canManageInventory: false,
        canApproveRequests: false,
        canViewAuditLog: false,
        canManageSettings: false,
        canExportReports: false,
        canManageRoles: false
      }
    };

    return permissions[role] || permissions.customer;
  }

  /**
   * Check permission
   */
  hasPermission(role, permission) {
    const permissions = this.getRolePermissions(role);
    return permissions[permission] || false;
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport() {
    return {
      generatedAt: new Date(),
      reportPeriod: '2024-Q4',
      complianceItems: [
        { area: 'Data Protection', status: 'compliant', lastAudit: new Date('2024-12-01'), notes: 'GDPR/Local data laws' },
        { area: 'Health & Safety', status: 'compliant', lastAudit: new Date('2024-11-15'), notes: 'OSHA compliance' },
        { area: 'Financial', status: 'compliant', lastAudit: new Date('2024-12-20'), notes: 'Tax compliance verified' },
        { area: 'Staff Training', status: 'partial', lastAudit: new Date('2024-10-01'), notes: '2 staff pending certification' },
        { area: 'Equipment', status: 'compliant', lastAudit: new Date('2024-12-10'), notes: 'All equipment certified' }
      ],
      overallStatus: 'compliant',
      actionItems: [
        { priority: 'medium', item: 'Complete staff certification training', dueDate: '2025-01-31' }
      ]
    };
  }

  /**
   * Export report
   */
  exportReport(type, format = 'json') {
    let data;
    let filename;

    switch (type) {
      case 'bookings':
        data = JSON.parse(localStorage.getItem('prospark_bookings') || '[]');
        filename = 'prospark_bookings_report';
        break;
      case 'financials':
        data = window.finance ? window.finance.getFinancialSummary('month') : {};
        filename = 'prospark_financials_report';
        break;
      case 'staff':
        data = window.operations ? window.operations.getAllStaff() : [];
        filename = 'prospark_staff_report';
        break;
      case 'customers':
        data = window.auth ? window.auth.getAllCustomers() : [];
        filename = 'prospark_customers_report';
        break;
      default:
        data = { error: 'Unknown report type' };
    }

    return {
      success: true,
      data: data,
      filename: filename,
      format: format,
      exportedAt: new Date()
    };
  }

  /**
   * Get admin dashboard data
   */
  getAdminDashboard() {
    return {
      stats: {
        totalUsers: JSON.parse(localStorage.getItem('prospark_users') || '[]').length,
        totalBookings: JSON.parse(localStorage.getItem('prospark_bookings') || '[]').length,
        totalRevenue: window.finance ? window.finance.getFinancialSummary('month').revenue : 0,
        activeStaff: window.operations ? window.operations.getAllStaff().length : 0
      },
      alerts: this.getAlerts(null, false),
      pendingApprovals: this.approvals.filter(a => a.status === 'pending').length,
      recentAuditActions: this.auditLog.slice(0, 10)
    };
  }
}

// Initialize Admin
window.AdminManager = AdminManager;
