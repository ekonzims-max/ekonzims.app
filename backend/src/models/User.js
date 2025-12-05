const crypto = require('crypto');

// Simple in-memory User store
const users = [];

class User {
  constructor(email, password, firstName, lastName, phone = '', street = '', city = '', postalCode = '') {
    this.id = crypto.randomUUID();
    this.email = email;
    this.password = this.hashPassword(password);
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.street = street;
    this.city = city;
    this.postalCode = postalCode;
    this.latitude = null; // Geolocation
    this.longitude = null; // Geolocation
    this.createdAt = new Date();
    this.emailVerified = false;
    this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    this.termsAccepted = false;
    this.termsAcceptedAt = null;
    this.privacyAccepted = false;
    this.privacyAcceptedAt = null;
    this.marketingConsent = false;
    this.geolocalizationConsent = false;
    this.passwordResetToken = null;
    this.passwordResetExpire = null;
    this.role = 'user'; // 'user' or 'admin'
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static validatePassword(password, hash) {
    return crypto.createHash('sha256').update(password).digest('hex') === hash;
  }

  static findByEmail(email) {
    return users.find(u => u.email === email);
  }

  static findById(id) {
    return users.find(u => u.id === id);
  }

  static create(email, password, firstName, lastName, phone = '', street = '', city = '', postalCode = '') {
    if (this.findByEmail(email)) {
      throw new Error('Email already exists');
    }
    const user = new User(email, password, firstName, lastName, phone, street, city, postalCode);
    // Le premier utilisateur devient automatiquement admin
    if (users.length === 0) {
      user.role = 'admin';
    }
    users.push(user);
    return user;
  }

  static verifyEmail(token) {
    const user = users.find(u => u.emailVerificationToken === token && u.emailVerificationExpire > new Date());
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpire = null;
    return user;
  }

  static generatePasswordReset(email) {
    const user = this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    user.passwordResetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return user.passwordResetToken;
  }

  static resetPassword(token, newPassword) {
    const user = users.find(u => u.passwordResetToken === token && u.passwordResetExpire > new Date());
    if (!user) throw new Error('Invalid or expired password reset token');
    user.password = user.hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetExpire = null;
    return user;
  }

  static getAll() {
    return users;
  }

  static makeAdmin(userId) {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');
    user.role = 'admin';
    return user;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  static deleteAll() {
    users.length = 0;
    return true;
  }

  toJSON() {
    const { password, firstName, lastName, ...user } = this;
    // By default do not expose full personal names in API responses to protect privacy.
    // If ALLOW_FULL_NAME=true in environment, include firstName/lastName as before.
    const allowFull = process.env.ALLOW_FULL_NAME === 'true';
    if (allowFull) {
      return { firstName, lastName, ...user };
    }

    // Otherwise provide a safe displayName (firstName + initial) and hide full names
    const displayName = firstName && lastName ? `${firstName} ${lastName[0]}.` : (firstName || 'Client');
    return { displayName, ...user };
  }
}

module.exports = User;
