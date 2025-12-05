const crypto = require('crypto');

const orders = [];

class Order {
  constructor(userId, items, totalAmount, shippingAddress) {
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.shippingAddress = shippingAddress;
    this.status = 'pending';
    this.paymentMethod = 'on_delivery'; // Products pay on delivery
    this.paymentStatus = 'pending'; // Will be paid on delivery
    this.createdAt = new Date();
  }

  static create(userId, items, totalAmount, shippingAddress) {
    const order = new Order(userId, items, totalAmount, shippingAddress);
    orders.push(order);
    return order;
  }

  static getByUserId(userId) {
    return orders.filter(o => o.userId === userId);
  }

  static getById(id) {
    return orders.find(o => o.id === id);
  }

  static getAll() {
    return orders;
  }
}

module.exports = Order;
