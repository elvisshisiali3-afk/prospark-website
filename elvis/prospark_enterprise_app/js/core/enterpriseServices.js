/**
 * PROSPARK ENTERPRISE - CORE SERVICES MODULE
 * Defines all 12 cleaning services with pricing, features, and AI capabilities
 */

const EnterpriseServices = {
  /**
   * All 12 Cleaning Services
   */
  services: [
    {
      id: 'residential',
      name: 'Smart Residential Cleaning',
      category: 'residential',
      icon: '🏠',
      description: 'AI-powered home cleaning with smart scheduling, personalized preferences, and eco-friendly options.',
      basePrice: 5000,
      minPrice: 3000,
      maxPrice: 15000,
      duration: '2-4 hours',
      features: [
        'AI-powered scheduling optimization',
        'Personalized cleaning preferences',
        'Smart home integration ready',
        'Real-time progress tracking',
        'Eco-friendly (green) option',
        'Pet-friendly cleaning agents'
      ],
      requirements: ['Home access', 'Water supply', 'Parking'],
      aiEnabled: true,
      popular: true,
      tags: ['home', 'house', 'residence', 'apartment']
    },
    {
      id: 'apartment',
      name: 'Apartment (Kejani) Management',
      category: 'commercial',
      icon: '🏢',
      description: 'Professional property management cleaning for apartments, studios, and multi-unit buildings.',
      basePrice: 4000,
      minPrice: 2500,
      maxPrice: 12000,
      duration: '1-3 hours',
      features: [
        'Multi-unit discounts',
        'Property manager portal',
        'Move-in/move-out deep clean',
        'Common area maintenance',
        'Inventory management',
        'Compliance reporting'
      ],
      requirements: ['Unit access', 'Building regulations'],
      aiEnabled: true,
      popular: true,
      tags: ['apartment', 'kejani', 'flat', 'property', 'rental']
    },
    {
      id: 'office',
      name: 'Smart Office Maintenance',
      category: 'commercial',
      icon: '🏛️',
      description: 'Enterprise-grade office cleaning with after-hours service, discrete operations, and compliance.',
      basePrice: 15000,
      minPrice: 8000,
      maxPrice: 50000,
      duration: '2-6 hours',
      features: [
        'After-hours service available',
        'IT-friendly cleaning',
        'Document security protocols',
        'Break room sanitization',
        'Conference room preparation',
        'Supply replenishment'
      ],
      requirements: ['After-hours access', 'Security clearance', 'Floor plan'],
      aiEnabled: true,
      popular: true,
      tags: ['office', 'commercial', 'business', 'corporate', 'workspace']
    },
    {
      id: 'hospital',
      name: 'Hospital-Grade Sanitation',
      category: 'specialized',
      icon: '🏥',
      description: 'Certified medical facility cleaning with infection control, biohazard handling, and compliance.',
      basePrice: 25000,
      minPrice: 15000,
      maxPrice: 100000,
      duration: '4-8 hours',
      features: [
        'Certified infection control',
        'Biohazard protocol',
        'Medical-grade disinfectants',
        'Operating room preparation',
        'Compliance documentation',
        '24/7 emergency service'
      ],
      requirements: ['Medical facility access', 'Certification verification', 'Safety protocols'],
      aiEnabled: true,
      popular: false,
      tags: ['hospital', 'medical', 'clinic', 'healthcare', 'sterile', 'certified']
    },
    {
      id: 'hospitality',
      name: 'Hotel & Airbnb Turnover',
      category: 'hospitality',
      icon: '🏨',
      description: 'Rapid turnover service for hotels, Airbnbs, and guest houses with express options.',
      basePrice: 3500,
      minPrice: 2000,
      maxPrice: 8000,
      duration: '1-2 hours',
      features: [
        'Express turnaround (30 min)',
        'Linen change service',
        'Restocking amenities',
        'Inventory audit',
        'Quality inspection',
        'Photo documentation'
      ],
      requirements: ['Property access', 'Key/Code', 'Amenity inventory'],
      aiEnabled: true,
      popular: true,
      tags: ['hotel', 'airbnb', 'hostel', 'guesthouse', 'turnover', 'hospitality']
    },
    {
      id: 'industrial',
      name: 'Industrial Hygiene',
      category: 'industrial',
      icon: '🏭',
      description: 'Heavy-duty industrial cleaning for factories, warehouses, and manufacturing facilities.',
      basePrice: 30000,
      minPrice: 15000,
      maxPrice: 150000,
      duration: '4-12 hours',
      features: [
        'Heavy machinery cleaning',
        'Floor care (concrete/epoxy)',
        'High-level dusting',
        'Safety compliance',
        'Hazardous area cleaning',
        'Waste disposal management'
      ],
      requirements: ['Site survey', 'Safety briefing', 'Equipment access'],
      aiEnabled: true,
      popular: false,
      tags: ['industrial', 'factory', 'warehouse', 'manufacturing', 'plant']
    },
    {
      id: 'watertank',
      name: 'Smart Water Tank Cleaning',
      category: 'specialized',
      icon: '💧',
      description: 'Professional water tank cleaning with inspection, testing, and certification.',
      basePrice: 8000,
      minPrice: 5000,
      maxPrice: 25000,
      duration: '2-4 hours',
      features: [
        'Video inspection (mock)',
        'Water quality testing',
        'Sludge removal',
        'Disinfection service',
        'Certification provided',
        'Maintenance recommendations'
      ],
      requirements: ['Tank access', 'Water drain access', 'Site assessment'],
      aiEnabled: true,
      popular: false,
      tags: ['tank', 'water', 'reservoir', 'cleaning', 'inspection']
    },
    {
      id: 'solar',
      name: 'Solar Panel Maintenance',
      category: 'specialized',
      icon: '☀️',
      description: 'Professional solar panel cleaning with efficiency testing and performance monitoring.',
      basePrice: 6000,
      minPrice: 3500,
      maxPrice: 20000,
      duration: '1-3 hours',
      features: [
        'Panel cleaning',
        'Efficiency testing',
        'Connection inspection',
        'Damage report',
        'Performance optimization',
        'Maintenance schedule'
      ],
      requirements: ['Roof access', 'Panel specifications', 'Safety access'],
      aiEnabled: true,
      popular: false,
      tags: ['solar', 'panel', 'renewable', 'energy', 'maintenance']
    },
    {
      id: 'event',
      name: 'Event & Disaster Cleanup',
      category: 'emergency',
      icon: '🎉',
      description: 'Rapid response cleanup for events, parties, disasters, and emergencies.',
      basePrice: 10000,
      minPrice: 5000,
      maxPrice: 100000,
      duration: '2-24 hours',
      features: [
        '24/7 emergency response',
        'Same-day service',
        'Post-event deep clean',
        'Furniture arrangement',
        'Waste removal',
        'Odor treatment'
      ],
      requirements: ['Event type assessment', 'Timeline', 'Scope definition'],
      aiEnabled: true,
      popular: false,
      tags: ['event', 'party', 'disaster', 'emergency', 'cleanup', 'wedding']
    },
    {
      id: 'biohazard',
      name: 'Biohazard & Fumigation',
      category: 'specialized',
      icon: '☣️',
      description: 'Certified biohazard cleanup and fumigation services for hazardous situations.',
      basePrice: 35000,
      minPrice: 20000,
      maxPrice: 200000,
      duration: '4-24 hours',
      features: [
        'Certified technicians',
        'Full PPE equipment',
        'Biohazard containment',
        'Fumigation service',
        'Decontamination',
        'Legal compliance'
      ],
      requirements: ['Hazard assessment', 'Safety protocols', 'Legal permits'],
      aiEnabled: true,
      popular: false,
      tags: ['biohazard', 'fumigation', 'hazardous', 'decontamination', 'certified']
    },
    {
      id: 'green',
      name: 'Green Cleaning (Eco Mode)',
      category: 'eco',
      icon: '🌿',
      description: 'Environmentally friendly cleaning using organic, non-toxic products and sustainable practices.',
      basePrice: 6000,
      minPrice: 3500,
      maxPrice: 18000,
      duration: '2-4 hours',
      features: [
        'Organic cleaning agents',
        'Carbon footprint tracking',
        'Sustainable practices',
        'Pet & child safe',
        'Certification provided',
        'Green compliance'
      ],
      requirements: ['Eco-preferences', 'Organic products'],
      aiEnabled: true,
      popular: true,
      tags: ['eco', 'green', 'organic', 'sustainable', 'environment']
    },
    {
      id: 'deepclean',
      name: 'Specialized Deep Cleaning',
      category: 'specialized',
      icon: '✨',
      description: 'Comprehensive deep cleaning service for thorough sanitization and restoration.',
      basePrice: 8000,
      minPrice: 5000,
      maxPrice: 30000,
      duration: '3-8 hours',
      features: [
        'Room-by-room deep clean',
        'Appliance cleaning',
        'Upholstery refresh',
        'Floor deep clean',
        'High-reach cleaning',
        'Sanitization guarantee'
      ],
      requirements: ['Full access', 'Time allocation', 'Pre-cleaning assessment'],
      aiEnabled: true,
      popular: true,
      tags: ['deep', 'thorough', 'intensive', 'spring clean', 'renovation']
    }
  ],

  /**
   * Get service by ID
   */
  getServiceById(id) {
    return this.services.find(s => s.id === id);
  },

  /**
   * Get services by category
   */
  getServicesByCategory(category) {
    return this.services.filter(s => s.category === category);
  },

  /**
   * Get popular services
   */
  getPopularServices() {
    return this.services.filter(s => s.popular);
  },

  /**
   * Get all categories
   */
  getCategories() {
    return [
      { id: 'residential', name: 'Residential', icon: '🏠' },
      { id: 'commercial', name: 'Commercial', icon: '🏢' },
      { id: 'specialized', name: 'Specialized', icon: '🔬' },
      { id: 'hospitality', name: 'Hospitality', icon: '🏨' },
      { id: 'industrial', name: 'Industrial', icon: '🏭' },
      { id: 'emergency', name: 'Emergency', icon: '🚨' },
      { id: 'eco', name: 'Eco-Friendly', icon: '🌿' }
    ];
  },

  /**
   * Property types for each service
   */
  propertyTypes: {
    residential: ['Bungalow', 'Maisonette', 'Apartment', 'Studio', 'Villa', 'Townhouse'],
    apartment: ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom', 'Penthouse', 'Multi-unit'],
    office: ['Small Office (1-10)', 'Medium Office (11-50)', 'Large Office (51-200)', 'Corporate HQ'],
    hospital: ['Clinic', 'Hospital Ward', 'Operating Theater', 'Laboratory', 'Pharmacy'],
    hospitality: ['Hotel Room', 'Suite', 'Airbnb/VRBO', 'Guest House', 'Hostel'],
    industrial: ['Small Warehouse', 'Factory Floor', 'Storage Facility', 'Manufacturing Plant'],
    watertank: ['Residential (500L)', 'Commercial (2000L)', 'Industrial (10000L+)'],
    solar: ['Residential (3kW)', 'Commercial (10kW)', 'Industrial (50kW+)'],
    event: ['Small (50)', 'Medium (200)', 'Large (500)', 'Venue (1000+)'],
    biohazard: ['Residential', 'Commercial', 'Industrial', 'Vehicle'],
    green: ['Bungalow', 'Maisonette', 'Apartment', 'Villa', 'Office'],
    deepclean: ['1-Room', '2-Room', '3-Room', '4-Room+', 'Full Property']
  },

  /**
   * Additional services/add-ons
   */
  addons: [
    { id: 'express', name: 'Express Service', price: 2000, description: 'Same-day service' },
    { id: 'weekend', name: 'Weekend Service', price: 1500, description: 'Saturday/Sunday booking' },
    { id: 'night', name: 'Night Service', price: 2500, description: 'Evening booking (6PM-10PM)' },
    { id: 'supplies', name: 'Supplies Included', price: 500, description: 'We bring our own supplies' },
    { id: 'organic', name: 'Organic Products', price: 1000, description: 'Eco-friendly cleaning agents' },
    { id: 'fragrance', name: 'Premium Fragrance', price: 500, description: 'Luxury scent options' },
    { id: 'pet', name: 'Pet-Friendly Service', price: 500, description: 'Specialized pet-safe products' },
    { id: 'insurance', name: 'Service Insurance', price: 1000, description: 'Coverage for damages' }
  ],

  /**
   * AI Price Prediction based on various factors
   */
  predictPrice(serviceId, options = {}) {
    const service = this.getServiceById(serviceId);
    if (!service) return service?.basePrice || 5000;

    let price = service.basePrice;
    const { propertySize, floors, rooms, extras = [] } = options;

    // Size multiplier
    if (propertySize === 'small') price *= 0.8;
    else if (propertySize === 'large') price *= 1.5;
    else if (propertySize === 'xlarge') price *= 2.0;

    // Floor multiplier
    if (floors > 1) price *= (1 + (floors - 1) * 0.2);

    // Room multiplier
    if (rooms) {
      const baseRooms = 2;
      if (rooms > baseRooms) price *= (1 + (rooms - baseRooms) * 0.15);
    }

    // Add-ons
    extras.forEach(addonId => {
      const addon = this.addons.find(a => a.id === addonId);
      if (addon) price += addon.price;
    });

    return Math.round(price);
  }
};

// Export for use in other modules
window.EnterpriseServices = EnterpriseServices;
