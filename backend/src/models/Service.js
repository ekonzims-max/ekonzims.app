const crypto = require('crypto');

const services = [
  { id: '1', name: 'Nettoyage Appartement', basePrice: 50, duration: 120, category: 'residential' },
  { id: '2', name: 'Nettoyage Maison', basePrice: 100, duration: 240, category: 'residential' },
  { id: '3', name: 'Nettoyage Bureau', basePrice: 75, duration: 180, category: 'commercial' },
  { id: '4', name: 'Nettoyage Fenêtres', basePrice: 30, duration: 60, category: 'speciality' },
];

const bookings = [];

class Service {
  static getAll() {
    return services;
  }

  static getById(id) {
    return services.find(s => s.id === id);
  }

  static create(name, basePrice, duration, category) {
    const service = {
      id: crypto.randomUUID(),
      name,
      basePrice,
      duration,
      category,
    };
    services.push(service);
    return service;
  }

  static createBooking(userId, serviceId, scheduledDate, address, paymentMethod = 'online', cardNumber = null, phone = null) {
    const service = this.getById(serviceId);
    if (!service) throw new Error('Service not found');

    const booking = {
      id: crypto.randomUUID(),
      userId,
      serviceId,
      scheduledDate,
      address,
      phone,
      status: 'pending',
      price: service.basePrice,
      paymentMethod: paymentMethod || 'online', // 'online' for services
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      cardNumber: cardNumber ? `****${cardNumber.slice(-4)}` : null,
      createdAt: new Date(),
    };
    bookings.push(booking);
    return booking;
  }

  static getBookingsByUserId(userId) {
    return bookings.filter(b => b.userId === userId);
  }

  static getBookingById(id) {
    return bookings.find(b => b.id === id);
  }

  static getAllBookings() {
    return bookings;
  }
}

module.exports = Service;
