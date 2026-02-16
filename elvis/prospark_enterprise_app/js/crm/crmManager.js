/**
 * PROSPARK ENTERPRISE - CRM MODULE
 * Customer Relationship Management with loyalty, referrals, and subscriptions
 */

class CRManager {
  constructor() {
    this.promoCodes = this.loadPromoCodes();
    this.referrals = this.loadReferrals();
    this.subscriptions = this.loadSubscriptions();
    this.vouchers = this.loadVouchers();
  }

  /**
   * Load promo codes
   */
  loadPromoCodes() {
    const stored = localStorage.getItem('prospark_promo_codes');
    return stored ? JSON.parse(stored) : this.getDefaultPromoCodes();
  }

  /**
   * Get default promo codes
   */
  getDefaultPromoCodes() {
    return [
      {
        code: 'WELCOME100',
        type: 'percentage',
        value: 15,
        minOrder: 3000,
        maxDiscount: 2000,
        validUntil: new Date('2026-12-31'),
        usageLimit: 100,
        usageCount: 23,
        applicableServices: ['residential', 'apartment', 'deepclean'],
        description: 'Welcome offer - 15% off your first booking'
      },
      {
        code: 'PROSPARK20',
        type: 'percentage',
        value: 20,
        minOrder: 5000,
        maxDiscount: 3000,
        validUntil: new Date('2026-06-30'),
        usageLimit: 50,
        usageCount: 12,
        applicableServices: 'all',
        description: 'Spring special - 20% off'
      },
      {
        code: 'SAVER500',
        type: 'fixed',
        value: 500,
        minOrder: 4000,
        maxDiscount: 500,
        validUntil: new Date('2026-12-31'),
        usageLimit: 200,
        usageCount: 45,
        applicableServices: 'all',
        description: 'Ksh 500 off any service'
      },
      {
        code: 'LOYALTY25',
        type: 'percentage',
        value: 25,
        minOrder: 8000,
        maxDiscount: 5000,
        validUntil: new Date('2026-12-31'),
        usageLimit: null,
        usageCount: 0,
        applicableServices: 'all',
        description: 'Loyal customer exclusive - 25% off'
      }
    ];
  }

  /**
   * Save promo codes
   */
  savePromoCodes() {
    localStorage.setItem('prospark_promo_codes', JSON.stringify(this.promoCodes));
  }

  /**
   * Load referrals
   */
  loadReferrals() {
    const stored = localStorage.getItem('prospark_referrals');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save referrals
   */
  saveReferrals() {
    localStorage.setItem('prospark_referrals', JSON.stringify(this.referrals));
  }

  /**
   * Load subscriptions
   */
  loadSubscriptions() {
    const stored = localStorage.getItem('prospark_subscriptions');
    return stored ? JSON.parse(stored) : this.getDefaultSubscriptions();
  }

  /**
   * Get default subscriptions
   */
  getDefaultSubscriptions() {
    return [
      {
        id: 'SUB-BASIC',
        name: 'Basic Clean',
        price: 15000,
        billingCycle: 'monthly',
        features: [
          '2 standard cleanings/month',
          'Basic supplies',
          'Standard hours',
          'Email support'
        ],
        serviceLimit: 2,
        discount: 10,
        popular: false
      },
      {
        id: 'SUB-STANDARD',
        name: 'Standard Clean',
        price: 25000,
        billingCycle: 'monthly',
        features: [
          '4 standard cleanings/month',
          'Premium supplies',
          'Flexible hours',
          'Priority booking',
          'Phone support'
        ],
        serviceLimit: 4,
        discount: 15,
        popular: true
      },
      {
        id: 'SUB-PREMIUM',
        name: 'Premium Clean',
        price: 45000,
        billingCycle: 'monthly',
        features: [
          '8 cleanings/month',
          'Any service type',
          '24/7 availability',
          'Dedicated cleaner',
          'Priority support',
          'Free supplies',
          'Exclusive deals'
        ],
        serviceLimit: 8,
        discount: 25,
        popular: false
      },
      {
        id: 'SUB-ENTERPRISE',
        name: 'Enterprise',
        price: 100000,
        billingCycle: 'monthly',
        features: [
          'Unlimited cleanings',
          'All services included',
          'Dedicated team',
          '24/7 VIP support',
          'Custom scheduling',
          'Free equipment',
          'Account manager',
          'Monthly reports'
        ],
        serviceLimit: -1, // Unlimited
        discount: 35,
        popular: false
      }
    ];
  }

  /**
   * Save subscriptions
   */
  saveSubscriptions() {
    localStorage.setItem('prospark_subscriptions', JSON.stringify(this.subscriptions));
  }

  /**
   * Load vouchers
   */
  loadVouchers() {
    const stored = localStorage.getItem('prospark_vouchers');
    return stored ? JSON.parse(stored) : this.getDefaultVouchers();
  }

  /**
   * Get default vouchers
   */
  getDefaultVouchers() {
    return [
      {
        code: 'GIFT-1000',
        value: 1000,
        type: 'gift',
        balance: 1000,
        purchasedBy: null,
        giftedTo: null,
        purchasedDate: null,
        validUntil: new Date('2027-12-31'),
        status: 'available'
      },
      {
        code: 'GIFT-2500',
        value: 2500,
        type: 'gift',
        balance: 2500,
        purchasedBy: null,
        giftedTo: null,
        purchasedDate: null,
        validUntil: new Date('2027-12-31'),
        status: 'available'
      },
      {
        code: 'GIFT-5000',
        value: 5000,
        type: 'gift',
        balance: 5000,
        purchasedBy: null,
        giftedTo: null,
        purchasedDate: null,
        validUntil: new Date('2027-12-31'),
        status: 'available'
      }
    ];
  }

  /**
   * Save vouchers
   */
  saveVouchers() {
    localStorage.setItem('prospark_vouchers', JSON.stringify(this.vouchers));
  }

  /**
   * Validate promo code
   */
  validatePromoCode(code, serviceId = null) {
    const promo = this.promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    
    if (!promo) {
      return { valid: false, message: 'Invalid promo code' };
    }

    // Check expiration
    if (new Date(promo.validUntil) < new Date()) {
      return { valid: false, message: 'Promo code has expired' };
    }

    // Check usage limit
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: 'Promo code usage limit reached' };
    }

    // Check service applicability
    if (promo.applicableServices !== 'all' && serviceId) {
      if (!promo.applicableServices.includes(serviceId)) {
        return { valid: false, message: 'Promo code not valid for this service' };
      }
    }

    return { 
      valid: true, 
      promo: promo, 
      message: 'Promo code applied successfully' 
    };
  }

  /**
   * Apply promo code discount
   */
  applyPromoCode(code, orderTotal, serviceId = null) {
    const validation = this.validatePromoCode(code, serviceId);
    
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const promo = validation.promo;

    // Check minimum order
    if (orderTotal < promo.minOrder) {
      return { 
        success: false, 
        message: `Minimum order of Ksh ${promo.minOrder.toLocaleString()} required` 
      };
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === 'percentage') {
      discount = (orderTotal * promo.value) / 100;
      discount = Math.min(discount, promo.maxDiscount);
    } else {
      discount = Math.min(promo.value, orderTotal);
    }

    // Update usage count
    promo.usageCount++;
    this.savePromoCodes();

    return {
      success: true,
      discount: discount,
      finalTotal: orderTotal - discount,
      message: validation.message
    };
  }

  /**
   * Generate referral code
   */
  generateReferralCode(userId) {
    const code = 'REF' + userId.slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    return code;
  }

  /**
   * Create referral
   */
  createReferral(referrerId, referrerName) {
    const referral = {
      id: 'REF-' + Date.now(),
      referrerId: referrerId,
      referrerName: referrerName,
      referralCode: this.generateReferralCode(referrerId),
      referredUsers: [],
      totalEarnings: 0,
      pendingBonuses: 0,
      created: new Date()
    };

    this.referrals.push(referral);
    this.saveReferrals();

    return referral;
  }

  /**
   * Process referral bonus
   */
  processReferralBonus(referrerId, referredUserId, bookingAmount) {
    const referral = this.referrals.find(r => r.referrerId === referrerId);
    if (!referral) return null;

    const bonus = Math.min(bookingAmount * 0.1, 1000); // 10% or max 1000
    
    referral.referredUsers.push({
      userId: referredUserId,
      joinedDate: new Date(),
      firstBookingBonus: bonus
    });
    
    referral.pendingBonuses += bonus;
    this.saveReferrals();

    return bonus;
  }

  /**
   * Get subscriptions
   */
  getSubscriptions() {
    return this.subscriptions;
  }

  /**
   * Get subscription by ID
   */
  getSubscriptionById(id) {
    return this.subscriptions.find(s => s.id === id);
  }

  /**
   * Subscribe to plan
   */
  subscribeToPlan(userId, planId) {
    const plan = this.getSubscriptionById(planId);
    if (!plan) {
      return { success: false, message: 'Plan not found' };
    }

    const userSubscriptions = JSON.parse(localStorage.getItem('prospark_user_subscriptions') || '{}');
    
    userSubscriptions[userId] = {
      planId: planId,
      plan: plan,
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      status: 'active'
    };

    localStorage.setItem('prospark_user_subscriptions', JSON.stringify(userSubscriptions));

    // Award loyalty points
    const pointsAwarded = Math.floor(plan.price / 100);
    this.awardLoyaltyPoints(userId, pointsAwarded, 'subscription');

    return { 
      success: true, 
      subscription: userSubscriptions[userId],
      message: `Subscribed to ${plan.name}!`,
      pointsAwarded: pointsAwarded
    };
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(userId) {
    const userSubscriptions = JSON.parse(localStorage.getItem('prospark_user_subscriptions') || '{}');
    
    if (!userSubscriptions[userId]) {
      return { success: false, message: 'No active subscription' };
    }

    userSubscriptions[userId].status = 'cancelled';
    userSubscriptions[userId].cancelledDate = new Date();
    
    localStorage.setItem('prospark_user_subscriptions', JSON.stringify(userSubscriptions));

    return { success: true, message: 'Subscription cancelled' };
  }

  /**
   * Get user subscription
   */
  getUserSubscription(userId) {
    const userSubscriptions = JSON.parse(localStorage.getItem('prospark_user_subscriptions') || '{}');
    return userSubscriptions[userId] || null;
  }

  /**
   * Award loyalty points
   */
  awardLoyaltyPoints(userId, points, reason = 'booking') {
    const users = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return null;

    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
    localStorage.setItem('prospark_users', JSON.stringify(users));

    // Log points transaction
    const pointsLog = JSON.parse(localStorage.getItem('prospark_points_log') || '[]');
    pointsLog.unshift({
      userId: userId,
      points: points,
      reason: reason,
      timestamp: new Date(),
      balance: user.loyaltyPoints
    });
    localStorage.setItem('prospark_points_log', JSON.stringify(pointsLog));

    return user.loyaltyPoints;
  }

  /**
   * Get loyalty tier
   */
  getLoyaltyTier(points) {
    if (points >= 5000) return { tier: 'platinum', color: '#c9a961', benefits: ['All gold benefits', '25% discount', 'Priority support', 'Free upgrades'] };
    if (points >= 2000) return { tier: 'gold', color: '#ffd700', benefits: ['All silver benefits', '20% discount', 'Exclusive offers'] };
    if (points >= 500) return { tier: 'silver', color: '#c0c0c0', benefits: ['15% discount', 'Birthday bonus'] };
    return { tier: 'bronze', color: '#cd7f32', benefits: ['5% discount', 'Points accumulation'] };
  }

  /**
   * Redeem points for discount
   */
  redeemPoints(userId, points, orderTotal) {
    const users = JSON.parse(localStorage.getItem('prospark_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if ((user.loyaltyPoints || 0) < points) {
      return { success: false, message: 'Insufficient points' };
    }

    const maxDiscount = orderTotal * 0.5; // Max 50% discount
    const discount = Math.min(points * 10, maxDiscount); // 10 points = 1 KES
    
    user.loyaltyPoints -= points;
    localStorage.setItem('prospark_users', JSON.stringify(users));

    return {
      success: true,
      discount: discount,
      pointsRedeemed: points,
      remainingPoints: user.loyaltyPoints
    };
  }

  /**
   * Purchase voucher
   */
  purchaseVoucher(userId, value) {
    const voucherTemplate = this.vouchers.find(v => v.value === value && v.status === 'available');
    if (!voucherTemplate) {
      return { success: false, message: 'Voucher not available' };
    }

    const voucher = {
      ...voucherTemplate,
      code: 'GV' + Date.now().toString(36).toUpperCase(),
      balance: value,
      purchasedBy: userId,
      purchasedDate: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    };

    voucherTemplate.status = 'sold';
    this.saveVouchers();

    const allVouchers = JSON.parse(localStorage.getItem('prospark_user_vouchers') || '[]');
    allVouchers.push(voucher);
    localStorage.setItem('prospark_user_vouchers', JSON.stringify(allVouchers));

    return { success: true, voucher: voucher };
  }

  /**
   * Get user vouchers
   */
  getUserVouchers(userId) {
    const allVouchers = JSON.parse(localStorage.getItem('prospark_user_vouchers') || '[]');
    return allVouchers.filter(v => v.purchasedBy === userId || v.giftedTo === userId);
  }

  /**
   * Redeem voucher
   */
  redeemVoucher(code, orderTotal) {
    const allVouchers = JSON.parse(localStorage.getItem('prospark_user_vouchers') || '[]');
    const voucher = allVouchers.find(v => v.code === code && v.status === 'active');
    
    if (!voucher) {
      return { success: false, message: 'Invalid or expired voucher' };
    }

    if (new Date(voucher.validUntil) < new Date()) {
      return { success: false, message: 'Voucher has expired' };
    }

    const discount = Math.min(voucher.balance, orderTotal);
    voucher.balance -= discount;
    
    if (voucher.balance <= 0) {
      voucher.status = 'redeemed';
    }

    localStorage.setItem('prospark_user_vouchers', JSON.stringify(allVouchers));

    return {
      success: true,
      discount: discount,
      remainingBalance: voucher.balance,
      message: `Ksh ${discount.toLocaleString()} voucher applied!`
    };
  }

  /**
   * Get promo codes
   */
  getPromoCodes() {
    return this.promoCodes;
  }

  /**
   * Create promo code (admin)
   */
  createPromoCode(promoData) {
    const promo = {
      code: promoData.code.toUpperCase(),
      type: promoData.type || 'percentage',
      value: promoData.value || 10,
      minOrder: promoData.minOrder || 0,
      maxDiscount: promoData.maxDiscount || 5000,
      validUntil: new Date(promoData.validUntil),
      usageLimit: promoData.usageLimit || null,
      usageCount: 0,
      applicableServices: promoData.applicableServices || 'all',
      description: promoData.description || 'Promotional discount'
    };

    this.promoCodes.push(promo);
    this.savePromoCodes();

    return promo;
  }
}

// Initialize CRM
window.CRManager = CRManager;
