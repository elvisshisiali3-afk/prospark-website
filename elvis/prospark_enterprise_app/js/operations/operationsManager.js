/**
 * PROSPARK ENTERPRISE - OPERATIONS MODULE
 * Staff management, job tracking, inventory, and operational features
 */

class OperationsManager {
  constructor() {
    this.staff = this.loadStaff();
    this.inventory = this.loadInventory();
    this.incidents = this.loadIncidents();
    this.attendance = this.loadAttendance();
    this.equipment = this.loadEquipment();
  }

  /**
   * Load staff data
   */
  loadStaff() {
    const stored = localStorage.getItem('prospark_operational_staff');
    return stored ? JSON.parse(stored) : this.getDefaultStaff();
  }

  /**
   * Get default staff
   */
  getDefaultStaff() {
    return [
      {
        id: 'STAFF-001',
        staffId: 'EMP-001',
        name: 'Mary Akinyi',
        email: 'cleaner1@prospark.ke',
        phone: '0745000001',
        position: 'Senior Cleaner',
        department: 'Residential',
        status: 'active',
        hireDate: new Date('2024-01-15'),
        hourlyRate: 500,
        skills: ['residential', 'deepclean', 'green'],
        certifications: ['Basic Cleaning', 'Green Cleaning'],
        rating: 4.8,
        totalJobs: 156,
        avatar: null,
        currentLocation: null,
        assignedJobs: []
      },
      {
        id: 'STAFF-002',
        staffId: 'EMP-002',
        name: 'James Otieno',
        email: 'cleaner2@prospark.ke',
        phone: '0745000002',
        position: 'Cleaner',
        department: 'Commercial',
        status: 'active',
        hireDate: new Date('2024-02-01'),
        hourlyRate: 400,
        skills: ['office', 'apartment'],
        certifications: ['Office Cleaning'],
        rating: 4.6,
        totalJobs: 89,
        avatar: null,
        currentLocation: null,
        assignedJobs: []
      },
      {
        id: 'STAFF-003',
        staffId: 'EMP-003',
        name: 'Faith Wanjiku',
        email: 'cleaner3@prospark.ke',
        phone: '0745000003',
        position: 'Specialist Cleaner',
        department: 'Specialized',
        status: 'active',
        hireDate: new Date('2024-03-01'),
        hourlyRate: 700,
        skills: ['hospital', 'biohazard', 'industrial'],
        certifications: ['Medical Cleaning', 'Biohazard Handling', 'Industrial Hygiene'],
        rating: 4.9,
        totalJobs: 67,
        avatar: null,
        currentLocation: null,
        assignedJobs: []
      },
      {
        id: 'STAFF-004',
        staffId: 'EMP-004',
        name: 'Peter Njoroge',
        email: 'cleaner4@prospark.ke',
        phone: '0745000004',
        position: 'Team Lead',
        department: 'Operations',
        status: 'active',
        hireDate: new Date('2024-01-01'),
        hourlyRate: 800,
        skills: ['all'],
        certifications: ['Team Leadership', 'First Aid', 'Safety'],
        rating: 4.7,
        totalJobs: 203,
        avatar: null,
        currentLocation: null,
        assignedJobs: []
      },
      {
        id: 'STAFF-005',
        staffId: 'EMP-005',
        name: 'Grace Atieno',
        email: 'cleaner5@prospark.ke',
        phone: '0745000005',
        position: 'Cleaner',
        department: 'Hospitality',
        status: 'active',
        hireDate: new Date('2024-04-01'),
        hourlyRate: 450,
        skills: ['hospitality', 'event'],
        certifications: ['Hotel Cleaning', 'Event Setup'],
        rating: 4.5,
        totalJobs: 45,
        avatar: null,
        currentLocation: null,
        assignedJobs: []
      }
    ];
  }

  /**
   * Save staff
   */
  saveStaff() {
    localStorage.setItem('prospark_operational_staff', JSON.stringify(this.staff));
  }

  /**
   * Load inventory
   */
  loadInventory() {
    const stored = localStorage.getItem('prospark_inventory');
    return stored ? JSON.parse(stored) : this.getDefaultInventory();
  }

  /**
   * Get default inventory
   */
  getDefaultInventory() {
    return [
      { id: 'INV-001', name: 'Industrial Vacuum Cleaner', category: 'Equipment', quantity: 5, minStock: 2, unit: 'pcs', condition: 'good' },
      { id: 'INV-002', name: 'Floor Polisher', category: 'Equipment', quantity: 3, minStock: 1, unit: 'pcs', condition: 'good' },
      { id: 'INV-003', name: 'Pressure Washer', category: 'Equipment', quantity: 2, minStock: 1, unit: 'pcs', condition: 'good' },
      { id: 'INV-004', name: 'Microfiber Cloths', category: 'Supplies', quantity: 100, minStock: 50, unit: 'pcs', condition: 'good' },
      { id: 'INV-005', name: 'All-Purpose Cleaner (5L)', category: 'Supplies', quantity: 20, minStock: 10, unit: 'liters', condition: 'good' },
      { id: 'INV-006', name: 'Disinfectant Spray (1L)', category: 'Supplies', quantity: 15, minStock: 8, unit: 'liters', condition: 'good' },
      { id: 'INV-007', name: 'Mop Heads', category: 'Supplies', quantity: 30, minStock: 15, unit: 'pcs', condition: 'good' },
      { id: 'INV-008', name: 'Safety Gloves', category: 'PPE', quantity: 50, minStock: 20, unit: 'pairs', condition: 'good' },
      { id: 'INV-009', name: 'Face Masks', category: 'PPE', quantity: 100, minStock: 50, unit: 'pcs', condition: 'good' },
      { id: 'INV-010', name: 'Uniform (Large)', category: 'Uniform', quantity: 10, minStock: 5, unit: 'pcs', condition: 'good' },
      { id: 'INV-011', name: 'Uniform (Medium)', category: 'Uniform', quantity: 8, minStock: 5, unit: 'pcs', condition: 'good' },
      { id: 'INV-012', name: 'Uniform (Small)', category: 'Uniform', quantity: 5, minStock: 3, unit: 'pcs', condition: 'good' }
    ];
  }

  /**
   * Save inventory
   */
  saveInventory() {
    localStorage.setItem('prospark_inventory', JSON.stringify(this.inventory));
  }

  /**
   * Load incidents
   */
  loadIncidents() {
    const stored = localStorage.getItem('prospark_incidents');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save incidents
   */
  saveIncidents() {
    localStorage.setItem('prospark_incidents', JSON.stringify(this.incidents));
  }

  /**
   * Load attendance
   */
  loadAttendance() {
    const stored = localStorage.getItem('prospark_attendance');
    return stored ? JSON.parse(stored) : this.getDefaultAttendance();
  }

  /**
   * Get default attendance
   */
  getDefaultAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      records: [
        { staffId: 'STAFF-001', checkIn: '08:00', checkOut: null, status: 'present', location: 'Office' },
        { staffId: 'STAFF-002', checkIn: '08:05', checkOut: null, status: 'present', location: 'Office' },
        { staffId: 'STAFF-003', checkIn: null, checkOut: null, status: 'absent', location: null },
        { staffId: 'STAFF-004', checkIn: '07:55', checkOut: null, status: 'present', location: 'Office' },
        { staffId: 'STAFF-005', checkIn: '08:10', checkOut: null, status: 'late', location: 'Office' }
      ]
    };
  }

  /**
   * Save attendance
   */
  saveAttendance() {
    localStorage.setItem('prospark_attendance', JSON.stringify(this.attendance));
  }

  /**
   * Load equipment
   */
  loadEquipment() {
    const stored = localStorage.getItem('prospark_equipment');
    return stored ? JSON.parse(stored) : this.getDefaultEquipment();
  }

  /**
   * Get default equipment
   */
  getDefaultEquipment() {
    return [
      { id: 'EQP-001', name: 'Vacuum #1', type: 'Equipment', assignedTo: 'STAFF-001', status: 'active', lastMaintenance: new Date('2024-11-01'), nextMaintenance: new Date('2025-02-01') },
      { id: 'EQP-002', name: 'Vacuum #2', type: 'Equipment', assignedTo: 'STAFF-002', status: 'active', lastMaintenance: new Date('2024-11-15'), nextMaintenance: new Date('2025-02-15') },
      { id: 'EQP-003', name: 'Floor Polisher #1', type: 'Equipment', assignedTo: 'STAFF-004', status: 'active', lastMaintenance: new Date('2024-10-01'), nextMaintenance: new Date('2025-01-01') }
    ];
  }

  /**
   * Save equipment
   */
  saveEquipment() {
    localStorage.setItem('prospark_equipment', JSON.stringify(this.equipment));
  }

  /**
   * Get all staff
   */
  getAllStaff() {
    return this.staff;
  }

  /**
   * Get available staff for booking
   */
  getAvailableStaff(serviceType, date) {
    return this.staff.filter(s => 
      s.status === 'active' && 
      (s.skills.includes('all') || s.skills.includes(serviceType))
    );
  }

  /**
   * Assign staff to job
   */
  assignStaffToJob(staffId, bookingId) {
    const staff = this.staff.find(s => s.id === staffId);
    if (!staff) {
      return { success: false, message: 'Staff not found' };
    }

    staff.assignedJobs = staff.assignedJobs || [];
    staff.assignedJobs.push({
      bookingId: bookingId,
      assignedAt: new Date(),
      status: 'assigned'
    });

    this.saveStaff();
    return { success: true, staff: staff };
  }

  /**
   * Check in staff (mock biometric)
   */
  checkIn(staffId, location = 'Office') {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const hour = parseInt(time.split(':')[0]);

    let status = 'present';
    if (hour > 8) status = 'late';

    this.attendance.records = this.attendance.records.filter(r => r.staffId !== staffId);
    this.attendance.records.push({
      staffId: staffId,
      checkIn: time,
      checkOut: null,
      status: status,
      location: location,
      method: 'biometric' // Mock
    });

    this.saveAttendance();

    // Update staff record
    const staff = this.staff.find(s => s.id === staffId);
    if (staff) {
      staff.attendance = staff.attendance || { present: 0, absent: 0, late: 0 };
      staff.attendance.present++;
      if (status === 'late') staff.attendance.late++;
      this.saveStaff();
    }

    return { success: true, status: status, time: time };
  }

  /**
   * Check out staff
   */
  checkOut(staffId) {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    const record = this.attendance.records.find(r => r.staffId === staffId);
    if (record) {
      record.checkOut = time;
      record.duration = this.calculateDuration(record.checkIn, time);
      this.saveAttendance();
    }

    return { success: true, time: time };
  }

  /**
   * Calculate duration
   */
  calculateDuration(start, end) {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const minutes = (endH * 60 + endM) - (startH * 60 + startM);
    return Math.round(minutes / 60 * 10) / 10;
  }

  /**
   * Get today's attendance
   */
  getTodayAttendance() {
    return this.attendance;
  }

  /**
   * Get attendance for date range
   */
  getAttendanceReport(startDate, endDate) {
    // Simplified - in real app would be more complex
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const staffStats = this.staff.map(s => ({
      staffId: s.id,
      name: s.name,
      present: Math.floor(Math.random() * totalDays),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 2),
      totalHours: Math.floor(Math.random() * 160)
    }));

    return {
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      staffStats: staffStats
    };
  }

  /**
   * Get inventory items
   */
  getInventory() {
    return this.inventory;
  }

  /**
   * Get low stock items
   */
  getLowStockItems() {
    return this.inventory.filter(i => i.quantity <= i.minStock);
  }

  /**
   * Update inventory
   */
  updateInventory(itemId, quantity) {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item not found' };
    }

    item.quantity = quantity;
    this.saveInventory();

    return { success: true, item: item };
  }

  /**
   * Add inventory item
   */
  addInventoryItem(itemData) {
    const item = {
      id: 'INV-' + Date.now(),
      name: itemData.name,
      category: itemData.category,
      quantity: itemData.quantity,
      minStock: itemData.minStock,
      unit: itemData.unit,
      condition: 'good'
    };

    this.inventory.push(item);
    this.saveInventory();

    return item;
  }

  /**
   * Report incident
   */
  reportIncident(incidentData) {
    const incident = {
      id: 'INC-' + Date.now(),
      type: incidentData.type,
      severity: incidentData.severity,
      description: incidentData.description,
      reportedBy: incidentData.reportedBy,
      staffInvolved: incidentData.staffInvolved || [],
      location: incidentData.location,
      status: 'open',
      created: new Date(),
      resolved: null,
      actions: []
    };

    this.incidents.unshift(incident);
    this.saveIncidents();

    return incident;
  }

  /**
   * Get incidents
   */
  getIncidents(filters = {}) {
    let result = this.incidents;

    if (filters.type) {
      result = result.filter(i => i.type === filters.type);
    }
    if (filters.severity) {
      result = result.filter(i => i.severity === filters.severity);
    }
    if (filters.status) {
      result = result.filter(i => i.status === filters.status);
    }

    return result;
  }

  /**
   * Resolve incident
   */
  resolveIncident(incidentId, resolution) {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) {
      return { success: false, message: 'Incident not found' };
    }

    incident.status = 'resolved';
    incident.resolved = new Date();
    incident.resolution = resolution;

    this.saveIncidents();

    return { success: true, incident: incident };
  }

  /**
   * Track equipment location (mock GPS)
   */
  trackEquipment(equipmentId) {
    const equipment = this.equipment.find(e => e.id === equipmentId);
    if (!equipment) return null;

    // Mock GPS coordinates around Nairobi
    return {
      ...equipment,
      location: {
        lat: -1.2921 + (Math.random() - 0.5) * 0.1,
        lng: 36.8219 + (Math.random() - 0.5) * 0.1,
        address: 'Nairobi, Kenya',
        lastUpdate: new Date()
      }
    };
  }

  /**
   * Get equipment status
   */
  getEquipmentStatus() {
    return this.equipment.map(e => ({
      ...e,
      needsMaintenance: new Date(e.nextMaintenance) <= new Date()
    }));
  }

  /**
   * Schedule maintenance
   */
  scheduleMaintenance(equipmentId, date) {
    const equipment = this.equipment.find(e => e.id === equipmentId);
    if (!equipment) {
      return { success: false, message: 'Equipment not found' };
    }

    equipment.nextMaintenance = new Date(date);
    equipment.maintenanceScheduled = true;
    this.saveEquipment();

    return { success: true, equipment: equipment };
  }

  /**
   * Optimize route (mock)
   */
  optimizeRoute(jobs) {
    // Simplified route optimization
    const sortedJobs = [...jobs].sort((a, b) => {
      // Sort by location proximity (mock)
      return Math.random() - 0.5;
    });

    return sortedJobs.map((job, index) => ({
      ...job,
      routeOrder: index + 1,
      estimatedTravelTime: Math.floor(Math.random() * 30) + 10,
      distance: (Math.random() * 10 + 1).toFixed(1)
    }));
  }

  /**
   * Get operational dashboard data
   */
  getOperationalDashboard() {
    return {
      totalStaff: this.staff.filter(s => s.status === 'active').length,
      onDuty: this.attendance.records.filter(r => r.status === 'present' || r.status === 'late').length,
      totalJobsToday: this.staff.reduce((sum, s) => sum + (s.assignedJobs?.length || 0), 0),
      lowStockItems: this.getLowStockItems().length,
      openIncidents: this.incidents.filter(i => i.status === 'open').length,
      equipmentNeedingMaintenance: this.equipment.filter(e => new Date(e.nextMaintenance) <= new Date()).length
    };
  }
}

// Initialize Operations
window.OperationsManager = OperationsManager;
