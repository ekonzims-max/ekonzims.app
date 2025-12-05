const crypto = require('crypto');
const { db, isFirebaseEnabled } = require('../config/firebase');

// Fallback: Simple in-memory User store
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
    this.latitude = null;
    this.longitude = null;
    this.createdAt = new Date();
    this.emailVerified = false;
    this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.termsAccepted = false;
    this.termsAcceptedAt = null;
    this.privacyAccepted = false;
    this.privacyAcceptedAt = null;
    this.marketingConsent = false;
    this.geolocalizationConsent = false;
    this.passwordResetToken = null;
    this.passwordResetExpire = null;
    this.role = 'user';
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static validatePassword(password, hash) {
    return crypto.createHash('sha256').update(password).digest('hex') === hash;
  }

  // Firestore: Trouver par email
  static async findByEmail(email) {
    if (isFirebaseEnabled()) {
      try {
        const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate(), emailVerificationExpire: data.emailVerificationExpire?.toDate(), passwordResetExpire: data.passwordResetExpire?.toDate() };
      } catch (error) {
        console.error('Firestore findByEmail error:', error);
        return null;
      }
    }
    // Fallback: in-memory
    return users.find(u => u.email === email);
  }

  // Firestore: Trouver par ID
  static async findById(id) {
    if (isFirebaseEnabled()) {
      try {
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate(), emailVerificationExpire: data.emailVerificationExpire?.toDate(), passwordResetExpire: data.passwordResetExpire?.toDate() };
      } catch (error) {
        console.error('Firestore findById error:', error);
        return null;
      }
    }
    // Fallback: in-memory
    return users.find(u => u.id === id);
  }

  // Firestore: Créer un utilisateur
  static async create(email, password, firstName, lastName, phone = '', street = '', city = '', postalCode = '') {
    if (isFirebaseEnabled()) {
      try {
        // Vérifier si l'email existe déjà
        const existing = await this.findByEmail(email);
        if (existing) {
          throw new Error('Email already exists');
        }

        const user = new User(email, password, firstName, lastName, phone, street, city, postalCode);
        
        // Vérifier si c'est le premier utilisateur (admin)
        const usersSnapshot = await db.collection('users').limit(1).get();
        if (usersSnapshot.empty) {
          user.role = 'admin';
        }

        // Sauvegarder dans Firestore
        await db.collection('users').doc(user.id).set({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          street: user.street,
          city: user.city,
          postalCode: user.postalCode,
          latitude: user.latitude,
          longitude: user.longitude,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          emailVerificationToken: user.emailVerificationToken,
          emailVerificationExpire: user.emailVerificationExpire,
          termsAccepted: user.termsAccepted,
          termsAcceptedAt: user.termsAcceptedAt,
          privacyAccepted: user.privacyAccepted,
          privacyAcceptedAt: user.privacyAcceptedAt,
          marketingConsent: user.marketingConsent,
          geolocalizationConsent: user.geolocalizationConsent,
          passwordResetToken: user.passwordResetToken,
          passwordResetExpire: user.passwordResetExpire,
          role: user.role
        });

        return user;
      } catch (error) {
        console.error('Firestore create error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    const user = new User(email, password, firstName, lastName, phone, street, city, postalCode);
    if (users.length === 0) {
      user.role = 'admin';
    }
    users.push(user);
    return user;
  }

  // Firestore: Vérifier l'email
  static async verifyEmail(token) {
    if (isFirebaseEnabled()) {
      try {
        const snapshot = await db.collection('users')
          .where('emailVerificationToken', '==', token)
          .limit(1)
          .get();

        if (snapshot.empty) {
          throw new Error('Invalid or expired verification token');
        }

        const doc = snapshot.docs[0];
        const user = doc.data();

        if (user.emailVerificationExpire && new Date() > user.emailVerificationExpire.toDate()) {
          throw new Error('Invalid or expired verification token');
        }

        await db.collection('users').doc(doc.id).update({
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpire: null
        });

        return await this.findById(doc.id);
      } catch (error) {
        console.error('Firestore verifyEmail error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    const user = users.find(u => u.emailVerificationToken === token && u.emailVerificationExpire > new Date());
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpire = null;
    return user;
  }

  // Firestore: Générer reset password token
  static async generatePasswordReset(email) {
    if (isFirebaseEnabled()) {
      try {
        const user = await this.findByEmail(email);
        if (!user) {
          throw new Error('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expire = new Date(Date.now() + 60 * 60 * 1000);

        await db.collection('users').doc(user.id).update({
          passwordResetToken: token,
          passwordResetExpire: expire
        });

        return token;
      } catch (error) {
        console.error('Firestore generatePasswordReset error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    user.passwordResetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetExpire = new Date(Date.now() + 60 * 60 * 1000);
    return user.passwordResetToken;
  }

  // Firestore: Reset password
  static async resetPassword(token, newPassword) {
    if (isFirebaseEnabled()) {
      try {
        const snapshot = await db.collection('users')
          .where('passwordResetToken', '==', token)
          .limit(1)
          .get();

        if (snapshot.empty) {
          throw new Error('Invalid or expired password reset token');
        }

        const doc = snapshot.docs[0];
        const user = doc.data();

        if (user.passwordResetExpire && new Date() > user.passwordResetExpire.toDate()) {
          throw new Error('Invalid or expired password reset token');
        }

        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        await db.collection('users').doc(doc.id).update({
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpire: null
        });

        return await this.findById(doc.id);
      } catch (error) {
        console.error('Firestore resetPassword error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    const user = users.find(u => u.passwordResetToken === token && u.passwordResetExpire > new Date());
    if (!user) throw new Error('Invalid or expired password reset token');
    user.password = crypto.createHash('sha256').update(newPassword).digest('hex');
    user.passwordResetToken = null;
    user.passwordResetExpire = null;
    return user;
  }

  // Firestore: Get all users
  static async getAll() {
    if (isFirebaseEnabled()) {
      try {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() };
        });
      } catch (error) {
        console.error('Firestore getAll error:', error);
        return [];
      }
    }

    // Fallback: in-memory
    return users;
  }

  // Firestore: Promouvoir en admin
  static async makeAdmin(userId) {
    if (isFirebaseEnabled()) {
      try {
        const user = await this.findById(userId);
        if (!user) throw new Error('User not found');

        await db.collection('users').doc(userId).update({ role: 'admin' });
        return await this.findById(userId);
      } catch (error) {
        console.error('Firestore makeAdmin error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.role = 'admin';
    return user;
  }

  // Vérifier si admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Firestore: Supprimer tous les utilisateurs
  static async deleteAll() {
    if (isFirebaseEnabled()) {
      try {
        const snapshot = await db.collection('users').get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        return true;
      } catch (error) {
        console.error('Firestore deleteAll error:', error);
        throw error;
      }
    }

    // Fallback: in-memory
    users.length = 0;
    return true;
  }

  toJSON() {
    const { password, firstName, lastName, ...user } = this;
    const allowFull = process.env.ALLOW_FULL_NAME === 'true';
    if (allowFull) {
      return { firstName, lastName, ...user };
    }
    const displayName = firstName && lastName ? `${firstName} ${lastName[0]}.` : (firstName || 'Client');
    return { displayName, ...user };
  }
}

module.exports = User;
