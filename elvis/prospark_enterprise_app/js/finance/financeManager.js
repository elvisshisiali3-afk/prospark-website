/**
 * PROSPARK ENTERPRISE - FINANCE MODULE
 * Financial management, payments, wallets, payroll, and invoicing
 */

class FinanceManager {
  constructor() {
    this.transactions = this.loadTransactions();
    this.invoices = this.loadInvoices();
    this.payroll = this.loadPayroll();
  }

  /**
   * Load transactions
   */
  loadTransactions() {
    const stored = localStorage.getItem('prospark_transactions');
    return stored ? JSON.parse(stored) : this.getDefaultTransactions();
  }

  /**
   * Get default transactions
   */
  getDefaultTransactions() {
    return [
      {
        id: 'TXN-001',
        userId: 'USR-006',
        type: 'payment',
        amount: 5500,
        method: 'mpesa',
        status: 'completed',
        bookingId: 'BKG-001',
        description: 'Residential cleaning service',
        created: new Date('2024-12-01')
      },
      {
        id: 'TXN-002',
        userId: 'USR-006',
        type: 'payment',
        amount: 4000,
        method: 'card',
        status: 'completed',
        bookingId: 'BKG-002',
        description: 'Apartment cleaning',
        created: new Date('2024-12-15')
      },
      {
        id: 'TXN-003',
        userId: 'USR-007',
        type: 'payment',
        amount: 15000,
        method: 'invoice',
        status: 'pending',
        bookingId: 'BKG-003',
        description: 'Office maintenance - December',
        created: new Date('2024-12-20')
      },
      {
        id: 'TXN-004',
        userId: 'USR-001',
        type: 'payout',
        amount: 25000,
        method: 'bank',
        status: 'completed',
        description: 'Monthly revenue withdrawal',
        created: new Date('2024-12-25')
      }
    ];
  }

  /**
   * Save transactions
   */
  saveTransactions() {
    localStorage.setItem('prospark_transactions', JSON.stringify(this.transactions));
  }

  /**
   * Load invoices
   */
  loadInvoices() {
    const stored = localStorage.getItem('prospark_invoices');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save invoices
   */
  saveInvoices() {
    localStorage.setItem('prospark_invoices', JSON.stringify(this.invoices));
  }

  /**
   * Load payroll data
   */
  loadPayroll() {
    const stored = localStorage.getItem('prospark_payroll');
    return stored ? JSON.parse(stored) : this.getDefaultPayroll();
  }

  /**
   * Get default payroll
   */
  getDefaultPayroll() {
    return [
      {
        staffId: 'STAFF-001',
        staffName: 'Mary Akinyi',
        period: '2024-12',
        basicSalary: 35000,
        allowances: 5000,
        deductions: 4500,
        bonus: 3000,
        netPay: 38500,
        status: 'paid',
        paidDate: new Date('2024-12-31')
      },
      {
        staffId: 'STAFF-002',
        staffName: 'James Otieno',
        period: '2024-12',
        basicSalary: 28000,
        allowances: 3000,
        deductions: 3600,
        bonus: 2000,
        netPay: 29400,
        status: 'paid',
        paidDate: new Date('2024-12-31')
      }
    ];
  }

  /**
   * Save payroll
   */
  savePayroll() {
    localStorage.setItem('prospark_payroll', JSON.stringify(this.payroll));
  }

  /**
   * Process payment
   */
  processPayment(paymentData) {
    const transaction = {
      id: 'TXN-' + Date.now(),
      userId: paymentData.userId,
      type: 'payment',
      amount: paymentData.amount,
      method: paymentData.method || 'mpesa',
      status: 'completed',
      bookingId: paymentData.bookingId,
      description: paymentData.description,
      created: new Date(),
      transactionRef: 'TXN' + Date.now().toString(36).toUpperCase()
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    // Update wallet balance
    this.updateWalletBalance(paymentData.userId, paymentData.amount, 'credit');

    // Award loyalty points
    if (window.crm) {
      const points = Math.floor(paymentData.amount / 100);
      crm.awardLoyaltyPoints(paymentData.userId, points, 'payment');
    }

    return { success: true, transaction: transaction };
  }

  /**
   * Process refund
   */
  processRefund(transactionId, amount, reason) {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      return { success: false, message: 'Transaction not found' };
    }

    const refund = {
      id: 'TXN-' + Date.now(),
      userId: transaction.userId,
      type: 'refund',
      amount: amount,
      method: transaction.method,
      status: 'completed',
      originalTransactionId: transactionId,
      reason: reason,
      created: new Date()
    };

    this.transactions.unshift(refund);
    this.saveTransactions();

    // Update wallet balance
    this.updateWalletBalance(transaction.userId, amount, 'debit');

    return { success: true, refund: refund };
  }

  /**
   * Get user transactions
   */
  getUserTransactions(userId) {
    return this.transactions.filter(t => t.userId === userId);
  }

  /**
   * Get all transactions
   */
  getAllTransactions() {
    return this.transactions;
  }

  /**
   * Update wallet balance
   */
  updateWalletBalance(userId, amount, type) {
    const users = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return null;

    if (!user.wallet) {
      user.wallet = { balance: 0, currency: 'KES' };
    }

    if (type === 'credit') {
      user.wallet.balance += amount;
    } else {
      user.wallet.balance -= amount;
    }

    localStorage.setItem('prospark_users', JSON.stringify(users));

    return user.wallet;
  }

  /**
   * Get wallet balance
   */
  getWalletBalance(userId) {
    const users = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    const user = users.find(u => u.id === userId);
    return user?.wallet || { balance: 0, currency: 'KES' };
  }

  /**
   * Add funds to wallet
   */
  addToWallet(userId, amount, method = 'mpesa') {
    this.updateWalletBalance(userId, amount, 'credit');

    const transaction = {
      id: 'TXN-' + Date.now(),
      userId: userId,
      type: 'deposit',
      amount: amount,
      method: method,
      status: 'completed',
      description: 'Wallet top-up',
      created: new Date()
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    return { success: true, newBalance: this.getWalletBalance(userId) };
  }

  /**
   * Pay from wallet
   */
  payFromWallet(userId, amount, description, bookingId = null) {
    const balance = this.getWalletBalance(userId);
    
    if (balance.balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    this.updateWalletBalance(userId, amount, 'debit');

    const transaction = {
      id: 'TXN-' + Date.now(),
      userId: userId,
      type: 'payment',
      amount: amount,
      method: 'wallet',
      status: 'completed',
      bookingId: bookingId,
      description: description,
      created: new Date()
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    return { 
      success: true, 
      transaction: transaction,
      newBalance: this.getWalletBalance(userId)
    };
  }

  /**
   * Create invoice
   */
  createInvoice(invoiceData) {
    const invoice = {
      id: 'INV-' + Date.now(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(this.invoices.length + 1).padStart(4, '0'),
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      customerAddress: invoiceData.customerAddress,
      items: invoiceData.items,
      subtotal: invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      taxRate: 16, // VAT
      tax: 0,
      total: 0,
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      created: new Date(),
      paidDate: null,
      notes: invoiceData.notes || ''
    };

    // Calculate tax and total
    invoice.tax = invoice.subtotal * (invoice.taxRate / 100);
    invoice.total = invoice.subtotal + invoice.tax;

    this.invoices.push(invoice);
    this.saveInvoices();

    return invoice;
  }

  /**
   * Pay invoice
   */
  payInvoice(invoiceId, paymentMethod) {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    if (invoice.status === 'paid') {
      return { success: false, message: 'Invoice already paid' };
    }

    // Create payment transaction
    this.processPayment({
      userId: invoice.customerId,
      amount: invoice.total,
      method: paymentMethod,
      bookingId: invoice.id,
      description: `Invoice payment - ${invoice.invoiceNumber}`
    });

    invoice.status = 'paid';
    invoice.paidDate = new Date();
    this.saveInvoices();

    return { success: true, invoice: invoice };
  }

  /**
   * Get user invoices
   */
  getUserInvoices(userId) {
    return this.invoices.filter(i => i.customerId === userId);
  }

  /**
   * Calculate staff commission
   */
  calculateCommission(staffId, bookingAmount, serviceType) {
    let commissionRate = 0.10; // Default 10%

    // Different rates for different services
    if (serviceType === 'hospital') commissionRate = 0.15;
    else if (serviceType === 'industrial') commissionRate = 0.12;
    else if (serviceType === 'biohazard') commissionRate = 0.18;

    return Math.round(bookingAmount * commissionRate);
  }

  /**
   * Process staff commission
   */
  payCommission(staffId, bookingId, amount) {
    const transaction = {
      id: 'TXN-' + Date.now(),
      userId: staffId,
      type: 'commission',
      amount: amount,
      method: 'wallet',
      status: 'completed',
      bookingId: bookingId,
      description: 'Service commission',
      created: new Date()
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    this.updateWalletBalance(staffId, amount, 'credit');

    return transaction;
  }

  /**
   * Process payroll
   */
  processPayroll(staffMembers, period) {
    const payrollRecords = [];
    const baseDate = new Date(period + '-01');

    staffMembers.forEach(staff => {
      const basicSalary = staff.hourlyRate * 160; // 160 hours/month
      const allowances = 5000; // Transport + lunch
      const deductions = Math.round(basicSalary * 0.10 + 1500); // Tax + NHF
      const bonus = staff.totalJobs > 100 ? 3000 : 1000;
      const netPay = basicSalary + allowances - deductions + bonus;

      const record = {
        id: 'PAY-' + Date.now() + '-' + staff.id,
        staffId: staff.id,
        staffName: staff.name,
        period: period,
        basicSalary: basicSalary,
        allowances: allowances,
        deductions: deductions,
        bonus: bonus,
        netPay: netPay,
        status: 'pending',
        dueDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0),
        paidDate: null
      };

      payrollRecords.push(record);

      // Update staff record
      staff.attendance = staff.attendance || { present: 0, absent: 0, late: 0 };
    });

    // Store pending payroll
    const pendingPayroll = JSON.parse(localStorage.getItem('prospark_pending_payroll') || '[]');
    pendingPayroll.push(...payrollRecords);
    localStorage.setItem('prospark_pending_payroll', JSON.stringify(pendingPayroll));

    return payrollRecords;
  }

  /**
   * Pay staff salary
   */
  paySalary(payrollId) {
    const pendingPayroll = JSON.parse(localStorage.getItem('prospark_pending_payroll') || '[]');
    const record = pendingPayroll.find(p => p.id === payrollId);
    
    if (!record) {
      return { success: false, message: 'Payroll record not found' };
    }

    // Process payment
    this.processPayment({
      userId: record.staffId,
      amount: record.netPay,
      method: 'bank',
      description: `Salary - ${record.period}`
    });

    record.status = 'paid';
    record.paidDate = new Date();

    localStorage.setItem('prospark_pending_payroll', JSON.stringify(pendingPayroll));

    return { success: true, record: record };
  }

  /**
   * Get financial summary
   */
  getFinancialSummary(period = 'month') {
    const now = new Date();
    let startDate;
    
    if (period === 'day') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const transactions = this.transactions.filter(t => 
      new Date(t.created) >= startDate && t.type === 'payment' && t.status === 'completed'
    );

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = transactions.length;
    const averageTransaction = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    // Calculate expenses (approximate)
    const expenses = this.payroll.filter(p => 
      p.status === 'paid' && new Date(p.paidDate) >= startDate
    ).reduce((sum, p) => sum + p.netPay, 0);

    const profit = totalRevenue - expenses;

    return {
      revenue: totalRevenue,
      expenses: expenses,
      profit: profit,
      transactionCount: transactionCount,
      averageTransaction: averageTransaction,
      period: period,
      startDate: startDate,
      endDate: new Date()
    };
  }

  /**
   * Generate tax report
   */
  generateTaxReport(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = this.transactions.filter(t => {
      const date = new Date(t.created);
      return date >= startDate && date <= endDate && t.type === 'payment' && t.status === 'completed';
    });

    const grossRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const vatCollected = grossRevenue * 0.16 / 1.16;
    const netRevenue = grossRevenue - vatCollected;

    // Payroll taxes
    const payroll = this.payroll.filter(p => {
      const date = new Date(p.paidDate);
      return date >= startDate && date <= endDate && p.status === 'paid';
    });

    const totalSalaries = payroll.reduce((sum, p) => sum + p.basicSalary, 0);
    const payee = totalSalaries * 0.30; // Approximate PAYE
    const nssf = totalSalaries * 0.06; // NSSF
    const nhif = payroll.reduce((sum, p) => sum + Math.min(p.basicSalary * 0.05, 1500), 0);

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      grossRevenue: grossRevenue,
      vatCollected: vatCollected,
      netRevenue: netRevenue,
      totalSalaries: totalSalaries,
      payee: payee,
      nssf: nssf,
      nhif: nhif,
      totalTaxLiability: vatCollected + payee + nssf + nhif
    };
  }

  /**
   * Get payment methods
   */
  getPaymentMethods() {
    return [
      { id: 'mpesa', name: 'M-Pesa', icon: '📱', enabled: true },
      { id: 'card', name: 'Credit/Debit Card', icon: '💳', enabled: true },
      { id: 'bank', name: 'Bank Transfer', icon: '🏦', enabled: true },
      { id: 'cash', name: 'Cash', icon: '💵', enabled: true },
      { id: 'wallet', name: 'Wallet', icon: '💰', enabled: true }
    ];
  }
}

// Initialize Finance
window.FinanceManager = FinanceManager;
