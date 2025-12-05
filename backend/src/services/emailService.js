const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * EmailService
 * - Uses Nodemailer when SMTP env variables are provided.
 * - Falls back to console logging when credentials are missing (safe for local dev).
 * - Keeps templates simple, professional and customizable.
 */

class EmailService {
  static _createTransporter() {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '465', 10),
        secure: process.env.EMAIL_SECURE !== 'false',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return null;
  }

  static _from() {
    return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@ekonzims.com';
  }

  static async _send(mailOptions) {
    const transporter = this._createTransporter();
    const defaultOpts = { from: this._from(), ...mailOptions };

    if (transporter) {
      try {
        const info = await transporter.sendMail(defaultOpts);
        console.log('📧 Email sent:', info.messageId);
        return { success: true, info };
      } catch (err) {
        console.error('✖ Error sending email:', err);
        return { success: false, error: err.message };
      }
    }

    // Fallback: write to log file and console for local/dev
    const log = `FALLBACK EMAIL to=${defaultOpts.to} subject=${defaultOpts.subject}\n${defaultOpts.text || defaultOpts.html}\n---\n`;
    console.log(log);
    try {
      const logsDir = path.join(__dirname, '..', '..', 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
      fs.appendFileSync(path.join(logsDir, 'emails.log'), log);
    } catch (e) {
      // ignore logging errors
    }
    return { success: true, fallback: true };
  }

  static _formatCurrency(amount) {
    return Number(amount).toFixed(2);
  }

  static _orderItemsToHtml(items) {
    return (`<ul style="list-style:none;padding:0;">` + items.map(i => `<li style="padding:10px 0;border-bottom:1px solid #eee;"><strong>${i.name}</strong> (x${i.quantity}) — <span style="color:#27ae60;">${this._formatCurrency(i.price * i.quantity)}€</span></li>`).join('') + `</ul>`);
  }

  static _orderItemsToText(items) {
    return items.map(i => `- ${i.name} (x${i.quantity}) — ${this._formatCurrency(i.price * i.quantity)}€`).join('\n');
  }

  static _emailTemplate(content) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EkoNzims</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #27ae60 0%, #229954 100%);padding:30px;text-align:center;border-radius:10px 10px 0 0;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;">🌿 EkoNzims</h1>
              <p style="margin:5px 0 0;color:#ffffff;font-size:14px;">Nettoyage Écologique & Produits Bio</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#2c3e50;padding:30px;text-align:center;border-radius:0 0 10px 10px;">
              <p style="margin:0 0 15px;color:#ffffff;font-size:16px;font-weight:bold;">Suivez-nous</p>
              <div style="margin-bottom:20px;">
                <a href="#" style="color:#ffffff;text-decoration:none;margin:0 10px;font-size:24px;">📘</a>
                <a href="#" style="color:#ffffff;text-decoration:none;margin:0 10px;font-size:24px;">📷</a>
                <a href="#" style="color:#ffffff;text-decoration:none;margin:0 10px;font-size:24px;">🐦</a>
              </div>
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:14px;">📧 contact@ekonzims.com</p>
              <p style="margin:5px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">📞 +243 854 593 921</p>
              <p style="margin:15px 0 0;color:rgba(255,255,255,0.6);font-size:12px;">© 2025 EkoNzims - Tous droits réservés</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  static async sendWelcomeEmail(email, firstName) {
    const subject = `🎉 Bienvenue sur EkoNzims, ${firstName || ''}!`;
    const text = `Bonjour ${firstName || 'Client'},\n\nBienvenue sur EkoNzims ! Nous sommes ravis de vous compter parmi nos clients.\n\n🎁 Profitez de 10% de réduction sur votre première commande avec le code: BIENVENUE10\n\nPour toute question, répondez simplement à cet e-mail.\n\nCordialement,\nL'équipe EkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Bonjour ${firstName || 'Client'} ! 👋</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bienvenue sur <strong>EkoNzims</strong> ! Nous sommes ravis de vous compter parmi nos clients.</p>
      <div style="background-color:#f0f8f4;border-left:4px solid #27ae60;padding:20px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:18px;color:#27ae60;"><strong>🎁 Cadeau de bienvenue</strong></p>
        <p style="margin:10px 0 0;font-size:16px;color:#555;">Profitez de <strong>10% de réduction</strong> sur votre première commande avec le code:</p>
        <p style="margin:15px 0 0;font-size:24px;font-weight:bold;color:#27ae60;letter-spacing:2px;">BIENVENUE10</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Découvrez nos produits écologiques et nos services de nettoyage professionnel.</p>
      <p style="font-size:14px;color:#888;margin-top:30px;">Pour toute question, répondez simplement à cet e-mail.</p>
      <p style="font-size:16px;margin-top:20px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendVerificationEmail(email, firstName, verificationLink) {
    const subject = `✉️ Confirmez votre email — EkoNzims`;
    const text = `Bonjour ${firstName || 'Client'},\n\nMerci de vous être inscrit(e) sur EkoNzims. Pour finaliser votre inscription, veuillez confirmer votre email en cliquant sur le lien ci-dessous :\n\n${verificationLink}\n\nCe lien expirera dans 24 heures.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Bonjour ${firstName || 'Client'} ! 👋</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Merci de vous être inscrit(e) sur <strong>EkoNzims</strong>. Pour finaliser votre inscription, veuillez confirmer votre email en cliquant sur le bouton ci-dessous :</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${verificationLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">✓ Confirmer mon email</a>
      </div>
      <p style="font-size:14px;color:#888;">Ce lien expirera dans <strong>24 heures</strong>.</p>
      <p style="font-size:14px;color:#888;margin-top:20px;">Si vous n'avez pas demandé cette inscription, ignorez ce message.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendOrderConfirmation(email, orderId, items = [], total) {
    const subject = `📦 Confirmation de commande #${orderId} — EkoNzims`;
    const text = `Bonjour,\n\nMerci pour votre commande #${orderId}.\n\nVotre commande sera livrée sous 72 heures.\n\nArticles commandés :\n${this._orderItemsToText(items)}\n\nTotal : ${this._formatCurrency(total)}€\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Merci pour votre commande ! 🎉</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Nous avons bien reçu votre commande <strong>#${orderId}</strong>. Nous la préparons avec soin.</p>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:16px;color:#27ae60;font-weight:bold;">🚚 Livraison estimée sous 72 heures</p>
      </div>
      <h3 style="color:#2c3e50;margin-top:30px;">Articles commandés :</h3>
      ${this._orderItemsToHtml(items)}
      <div style="text-align:right;margin-top:20px;padding-top:15px;border-top:2px solid #27ae60;">
        <p style="font-size:18px;color:#2c3e50;margin:0;"><strong>Total : ${this._formatCurrency(total)}€</strong></p>
      </div>
      <p style="font-size:14px;color:#888;margin-top:30px;">Vous recevrez un email de confirmation lorsque votre commande sera expédiée.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendDeliveryConfirmation(email, orderId, tracking = null) {
    const subject = `✅ Commande #${orderId} — Livrée avec succès`;
    const text = `Bonjour,\n\nVotre commande #${orderId} a été livrée avec succès !\n${tracking ? `Numéro de suivi: ${tracking}\n` : ''}\nNous espérons que vous êtes satisfait(e) de vos produits.\n\nN'hésitez pas à nous laisser un avis !\n\nMerci d'avoir choisi EkoNzims.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre commande a été livrée ! 📦✅</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Votre commande <strong>#${orderId}</strong> a été livrée avec succès. Nous espérons que vous êtes satisfait(e) de vos produits écologiques.</p>
      ${tracking ? `<div style="background-color:#f5f5f5;border-radius:5px;padding:15px;margin:20px 0;"><p style="margin:0;font-size:14px;color:#666;">Numéro de suivi : <strong style="color:#27ae60;">${tracking}</strong></p></div>` : ''}
      <div style="background-color:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#856404;">⭐ Votre avis nous intéresse ! Partagez votre expérience avec nos produits.</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Merci d'avoir choisi <strong style="color:#27ae60;">EkoNzims</strong> pour vos produits écologiques.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendBookingConfirmation(email, bookingId, serviceName, scheduledDate) {
    const subject = `📅 Confirmation de réservation #${bookingId} — ${serviceName}`;
    const text = `Bonjour,\n\nVotre réservation pour ${serviceName} est confirmée !\n\nDate : ${scheduledDate}\nRéférence : ${bookingId}\n\nNous vous enverrons un rappel 24 heures avant votre rendez-vous.\n\nMerci,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Réservation confirmée ! 🎉</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Votre réservation pour <strong style="color:#27ae60;">${serviceName}</strong> est confirmée.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📅 <strong>Date :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${scheduledDate}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">🔖 <strong>Référence :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${bookingId}</strong></td>
          </tr>
        </table>
      </div>
      <p style="font-size:14px;color:#888;">Nous vous enverrons un rappel <strong>24 heures</strong> avant votre rendez-vous.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendPasswordReset(email, resetToken) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    const subject = `🔐 Réinitialisation de mot de passe — EkoNzims`;
    const text = `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe. Pour continuer, cliquez sur le lien suivant :\n\n${resetLink}\n\nCe lien expirera dans 1 heure pour des raisons de sécurité.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez ce message et votre mot de passe restera inchangé.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Réinitialisation de mot de passe 🔐</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Vous avez demandé à réinitialiser votre mot de passe. Pour continuer, cliquez sur le bouton ci-dessous :</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${resetLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Réinitialiser mon mot de passe</a>
      </div>
      <p style="font-size:14px;color:#888;">Ce lien expirera dans <strong>1 heure</strong> pour des raisons de sécurité.</p>
      <div style="background-color:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:14px;color:#856404;">⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez ce message et votre mot de passe restera inchangé.</p>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendAdminNotification(adminEmail, subject, message) {
    const text = `Notification admin:\n\n${message}`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">🔔 Notification Administrateur</h2>
      <div style="background-color:#f5f5f5;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#2c3e50;white-space:pre-wrap;">${message}</p>
      </div>
      <p style="font-size:14px;color:#888;margin-top:20px;">Cette notification a été générée automatiquement par la plateforme EkoNzims.</p>
    `;
    const html = this._emailTemplate(content);
    return this._send({ to: adminEmail, subject, text, html });
  }

  // === NOUVEAUX TYPES D'EMAILS ===

  static async sendShippingNotification(email, firstName, orderId, trackingNumber, estimatedDelivery) {
    const subject = `📦 Votre commande #${orderId} a été expédiée !`;
    const text = `Bonjour ${firstName || 'Client'},\n\nBonne nouvelle ! Votre commande #${orderId} a été expédiée.\n\nNuméro de suivi : ${trackingNumber}\nLivraison estimée : ${estimatedDelivery} (sous 72 heures)\n\nVous pouvez suivre votre colis en temps réel avec le numéro de suivi.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre commande est en route ! 🚚</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonne nouvelle ! Votre commande <strong>#${orderId}</strong> a été expédiée et est en route vers vous.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="margin:0 0 10px 0;font-size:14px;color:#666;">📦 Numéro de suivi :</p>
        <p style="margin:0;font-size:20px;color:#27ae60;font-weight:bold;letter-spacing:1px;">${trackingNumber}</p>
      </div>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:16px;color:#27ae60;font-weight:bold;">🚚 Livraison estimée : ${estimatedDelivery} (sous 72 heures)</p>
      </div>
      <p style="font-size:14px;color:#888;">Vous recevrez une notification lorsque votre colis sera livré.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendDeliveryReminder(email, firstName, orderId, deliveryDate) {
    const subject = `🎉 Votre commande #${orderId} arrive aujourd'hui !`;
    const text = `Bonjour ${firstName || 'Client'},\n\nVotre commande #${orderId} sera livrée aujourd'hui : ${deliveryDate}\n\nAssurez-vous d'être disponible pour réceptionner votre colis.\n\nMerci d'avoir choisi EkoNzims !\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre commande arrive aujourd'hui ! 🎉📦</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Excellente nouvelle ! Votre commande <strong>#${orderId}</strong> sera livrée <strong>aujourd'hui</strong>.</p>
      <div style="background-color:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#856404;">📅 <strong>Date de livraison :</strong> ${deliveryDate}</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Assurez-vous d'être disponible pour réceptionner votre colis. Le livreur pourrait vous contacter.</p>
      <p style="font-size:14px;color:#888;margin-top:20px;">Merci d'avoir choisi <strong>EkoNzims</strong> pour vos produits écologiques !</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendReviewRequest(email, firstName, orderId, orderItems) {
    const subject = `⭐ Partagez votre expérience avec EkoNzims`;
    const reviewLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${orderId}/review`;
    const text = `Bonjour ${firstName || 'Client'},\n\nNous espérons que vous êtes satisfait(e) de votre commande #${orderId}.\n\nVotre avis compte beaucoup pour nous ! Prenez quelques instants pour partager votre expérience :\n\n${reviewLink}\n\nMerci,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre avis nous intéresse ! ⭐</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Nous espérons que vous êtes satisfait(e) de votre commande <strong>#${orderId}</strong>.</p>
      <div style="background-color:#fff3cd;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:18px;color:#856404;font-weight:bold;">⭐⭐⭐⭐⭐</p>
        <p style="margin:0;font-size:15px;color:#856404;">Votre avis compte beaucoup pour nous !</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Prenez quelques instants pour partager votre expérience et aider d'autres clients à faire leur choix.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${reviewLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Laisser un avis</a>
      </div>
      <p style="font-size:14px;color:#888;">Merci d'avoir choisi EkoNzims pour vos produits écologiques.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendCartAbandonmentReminder(email, firstName, cartItems, abandonedDate) {
    const subject = `🛒 Votre panier vous attend sur EkoNzims`;
    const cartLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/cart`;
    const text = `Bonjour ${firstName || 'Client'},\n\nVous avez laissé des articles dans votre panier.\n\nNe les laissez pas s'envoler ! Finalisez votre commande dès maintenant :\n${cartLink}\n\nArticles dans votre panier :\n${this._orderItemsToText(cartItems)}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre panier vous attend ! 🛒</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Vous avez laissé des articles dans votre panier. Ne les laissez pas s'envoler !</p>
      <h3 style="color:#2c3e50;margin-top:30px;">Articles dans votre panier :</h3>
      ${this._orderItemsToHtml(cartItems)}
      <div style="text-align:center;margin:30px 0;">
        <a href="${cartLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Finaliser ma commande</a>
      </div>
      <p style="font-size:14px;color:#888;margin-top:20px;">Ces articles écologiques sont populaires et les stocks sont limités. Commandez avant qu'il ne soit trop tard !</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendServiceReminder(email, firstName, bookingId, serviceName, appointmentDate) {
    const subject = `⏰ Rappel : Votre rendez-vous demain — ${serviceName}`;
    const text = `Bonjour ${firstName || 'Client'},\n\nCeci est un rappel pour votre rendez-vous demain :\n\nService : ${serviceName}\nDate : ${appointmentDate}\nRéférence : ${bookingId}\n\nNous avons hâte de vous servir !\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Rappel de rendez-vous ⏰</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Ceci est un rappel pour votre rendez-vous <strong>demain</strong>.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">🛠️ <strong>Service :</strong></td>
            <td style="padding:8px 0;color:#27ae60;font-size:15px;text-align:right;"><strong>${serviceName}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📅 <strong>Date :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${appointmentDate}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">🔖 <strong>Référence :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${bookingId}</strong></td>
          </tr>
        </table>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Nous avons hâte de vous servir ! Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendPaymentConfirmation(email, firstName, amount, paymentMethod, transactionId) {
    const subject = `💳 Paiement confirmé — EkoNzims`;
    const text = `Bonjour ${firstName || 'Client'},\n\nVotre paiement a été confirmé avec succès.\n\nMontant : ${this._formatCurrency(amount)}€\nMéthode : ${paymentMethod}\nTransaction : ${transactionId}\n\nMerci pour votre confiance.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Paiement confirmé ! ✅</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Votre paiement a été confirmé avec succès.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">💰 <strong>Montant :</strong></td>
            <td style="padding:8px 0;color:#27ae60;font-size:18px;text-align:right;"><strong>${this._formatCurrency(amount)}€</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">💳 <strong>Méthode :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${paymentMethod}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">🔖 <strong>Transaction :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${transactionId}</strong></td>
          </tr>
        </table>
      </div>
      <p style="font-size:14px;color:#888;">Conservez ce message comme reçu de paiement.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Merci pour votre confiance,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendStockAlert(email, firstName, productName, productId) {
    const subject = `🔔 ${productName} est de retour en stock !`;
    const productLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/products/${productId}`;
    const text = `Bonjour ${firstName || 'Client'},\n\nBonne nouvelle ! Le produit "${productName}" que vous attendiez est de retour en stock.\n\nCommandez-le vite avant rupture :\n${productLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Produit de retour en stock ! 🎉</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonne nouvelle ! Le produit <strong style="color:#27ae60;">${productName}</strong> que vous attendiez est de retour en stock.</p>
      <div style="background-color:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#856404;">⚡ Stocks limités ! Commandez vite avant la prochaine rupture.</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${productLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Voir le produit</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendMonthlyNewsletter(email, firstName, promotions = [], newProducts = []) {
    const subject = `🌿 Newsletter EkoNzims — Les nouveautés du mois`;
    const text = `Bonjour ${firstName || 'Client'},\n\nDécouvrez les nouveautés et promotions du mois sur EkoNzims !\n\nVisitez notre site pour en savoir plus.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Les nouveautés du mois 🌿</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonjour <strong>${firstName || 'Client'}</strong>,</p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Découvrez nos dernières nouveautés et promotions exclusives !</p>
      ${promotions.length > 0 ? `
        <h3 style="color:#2c3e50;margin-top:30px;">🎁 Promotions du mois :</h3>
        <ul style="list-style:none;padding:0;">
          ${promotions.map(promo => `<li style="padding:10px 0;border-bottom:1px solid #eee;"><strong style="color:#27ae60;">${promo.title}</strong> — ${promo.description}</li>`).join('')}
        </ul>
      ` : ''}
      ${newProducts.length > 0 ? `
        <h3 style="color:#2c3e50;margin-top:30px;">✨ Nouveaux produits :</h3>
        <ul style="list-style:none;padding:0;">
          ${newProducts.map(product => `<li style="padding:10px 0;border-bottom:1px solid #eee;"><strong>${product.name}</strong> — <span style="color:#27ae60;">${product.price}€</span></li>`).join('')}
        </ul>
      ` : ''}
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/products" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Voir tous les produits</a>
      </div>
      <p style="font-size:14px;color:#888;margin-top:20px;">Merci de faire partie de la communauté EkoNzims !</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS TRANSACTIONNELS AVANCÉS ===

  static async sendInvoice(email, orderId, items, total, invoiceNumber, invoiceDate) {
    const subject = `🧾 Facture #${invoiceNumber} — Commande #${orderId}`;
    const text = `Bonjour,\n\nVeuillez trouver ci-joint votre facture pour la commande #${orderId}.\n\nFacture : ${invoiceNumber}\nDate : ${invoiceDate}\nMontant total : ${this._formatCurrency(total)}€\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre facture 🧾</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Veuillez trouver ci-dessous votre facture pour la commande <strong>#${orderId}</strong>.</p>
      <div style="background-color:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📄 <strong>Facture :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${invoiceNumber}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📅 <strong>Date :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;">${invoiceDate}</td>
          </tr>
        </table>
      </div>
      <h3 style="color:#2c3e50;margin-top:30px;">Articles :</h3>
      ${this._orderItemsToHtml(items)}
      <div style="text-align:right;margin-top:20px;padding-top:15px;border-top:2px solid #27ae60;">
        <p style="font-size:20px;color:#27ae60;margin:0;"><strong>Total : ${this._formatCurrency(total)}€</strong></p>
      </div>
      <p style="font-size:14px;color:#888;margin-top:20px;">Cette facture vous sera envoyée également en pièce jointe au format PDF.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendRefundConfirmation(email, orderId, amount, refundReason, processingDays = 5) {
    const subject = `💰 Remboursement confirmé — Commande #${orderId}`;
    const text = `Bonjour,\n\nVotre demande de remboursement pour la commande #${orderId} a été acceptée.\n\nMontant : ${this._formatCurrency(amount)}€\nRaison : ${refundReason}\nDélai de traitement : ${processingDays} jours ouvrés\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Remboursement confirmé ✅</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Votre demande de remboursement pour la commande <strong>#${orderId}</strong> a été acceptée.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">💰 <strong>Montant :</strong></td>
            <td style="padding:8px 0;color:#27ae60;font-size:18px;text-align:right;"><strong>${this._formatCurrency(amount)}€</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📝 <strong>Raison :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;">${refundReason}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">⏱️ <strong>Délai :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${processingDays} jours ouvrés</strong></td>
          </tr>
        </table>
      </div>
      <p style="font-size:14px;color:#888;">Le remboursement sera effectué sur votre moyen de paiement original.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendPaymentFailure(email, orderId, failureReason) {
    const subject = `⚠️ Échec de paiement — Commande #${orderId}`;
    const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${orderId}/payment`;
    const text = `Bonjour,\n\nLe paiement pour votre commande #${orderId} a échoué.\n\nRaison : ${failureReason}\n\nVeuillez mettre à jour vos informations de paiement : ${paymentLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#e74c3c;margin-top:0;">Échec de paiement ⚠️</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Le paiement pour votre commande <strong>#${orderId}</strong> n'a pas pu être traité.</p>
      <div style="background-color:#fee;border-left:4px solid #e74c3c;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#c0392b;"><strong>Raison :</strong> ${failureReason}</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">Pour finaliser votre commande, veuillez mettre à jour vos informations de paiement :</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${paymentLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Mettre à jour le paiement</a>
      </div>
      <p style="font-size:14px;color:#888;">Votre commande sera annulée automatiquement si le paiement n'est pas effectué sous 48 heures.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendOrderStatusChange(email, orderId, oldStatus, newStatus, statusMessage) {
    const subject = `📦 Mise à jour — Commande #${orderId}`;
    const statusEmoji = {
      'pending': '⏳',
      'processing': '🔄',
      'preparing': '📦',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    const text = `Bonjour,\n\nLe statut de votre commande #${orderId} a été mis à jour.\n\nNouveau statut : ${newStatus}\n${statusMessage}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Mise à jour de commande ${statusEmoji[newStatus] || '📦'}</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Le statut de votre commande <strong>#${orderId}</strong> a été mis à jour.</p>
      <div style="background-color:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#999;font-size:14px;text-decoration:line-through;">Ancien statut :</td>
            <td style="padding:8px 0;color:#999;font-size:14px;text-align:right;text-decoration:line-through;">${oldStatus}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#27ae60;font-size:16px;font-weight:bold;">Nouveau statut :</td>
            <td style="padding:12px 0;color:#27ae60;font-size:16px;text-align:right;font-weight:bold;">${statusEmoji[newStatus] || ''} ${newStatus}</td>
          </tr>
        </table>
      </div>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#2c3e50;">${statusMessage}</p>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS DE FIDÉLISATION ===

  static async sendReferralProgram(email, referralCode, referralLink) {
    const subject = `🎁 Parrainez vos amis et gagnez 10% !`;
    const text = `Bonjour,\n\nPartagez EkoNzims avec vos amis et gagnez 10% de réduction sur votre prochaine commande !\n\nVotre code de parrainage : ${referralCode}\nVotre lien unique : ${referralLink}\n\nVos amis recevront aussi 10% de réduction sur leur première commande.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Parrainez et gagnez ! 🎁</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Partagez EkoNzims avec vos amis et <strong>gagnez 10% de réduction</strong> sur votre prochaine commande !</p>
      <div style="background-color:#fff3cd;border-radius:8px;padding:25px;margin:25px 0;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:14px;color:#856404;">Votre code de parrainage :</p>
        <p style="margin:0;font-size:28px;color:#f39c12;font-weight:bold;letter-spacing:3px;">${referralCode}</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;text-align:center;">Ou partagez ce lien unique :</p>
      <div style="background-color:#f5f5f5;border-radius:5px;padding:15px;margin:20px 0;text-align:center;">
        <a href="${referralLink}" style="color:#27ae60;font-size:14px;word-break:break-all;">${referralLink}</a>
      </div>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#2c3e50;"><strong>Comment ça marche ?</strong></p>
        <p style="margin:10px 0 0 0;font-size:14px;color:#555;">1️⃣ Partagez votre code ou lien<br/>2️⃣ Vos amis reçoivent 10% sur leur 1ère commande<br/>3️⃣ Vous recevez 10% sur votre prochaine commande</p>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendLoyaltyPoints(email, pointsBalance, pointsEarned, rewardsAvailable) {
    const subject = `⭐ Vos points de fidélité EkoNzims`;
    const text = `Bonjour,\n\nVous avez gagné ${pointsEarned} points !\n\nSolde total : ${pointsBalance} points\nRécompenses disponibles : ${rewardsAvailable}\n\nUtilisez vos points pour obtenir des réductions sur vos prochaines commandes.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Vos points de fidélité ⭐</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Félicitations ! Vous avez gagné <strong style="color:#27ae60;">${pointsEarned} points</strong> !</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:25px;margin:25px 0;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:14px;color:#666;">Votre solde :</p>
        <p style="margin:0;font-size:36px;color:#27ae60;font-weight:bold;">${pointsBalance} points</p>
      </div>
      ${rewardsAvailable > 0 ? `
        <div style="background-color:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:5px;">
          <p style="margin:0;font-size:15px;color:#856404;">🎁 Vous avez <strong>${rewardsAvailable} récompense(s)</strong> disponible(s) !</p>
        </div>
      ` : ''}
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/account/rewards" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Voir mes récompenses</a>
      </div>
      <p style="font-size:14px;color:#888;margin-top:20px;text-align:center;">Gagnez des points à chaque achat : 1€ = 1 point</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendBirthdayOffer(email, discountCode, expiryDate) {
    const subject = `🎂 Joyeux anniversaire ! Cadeau spécial de EkoNzims`;
    const text = `Joyeux anniversaire !\n\nPour célébrer votre anniversaire, voici un cadeau spécial : 15% de réduction sur tout le site !\n\nCode promo : ${discountCode}\nValable jusqu'au : ${expiryDate}\n\nProfitez-en vite !\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">🎂 Joyeux anniversaire ! 🎉</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Toute l'équipe EkoNzims vous souhaite un très joyeux anniversaire !</p>
      <div style="background-color:#fff3cd;border-radius:8px;padding:30px;margin:25px 0;text-align:center;">
        <p style="margin:0 0 15px 0;font-size:18px;color:#856404;font-weight:bold;">🎁 Votre cadeau d'anniversaire :</p>
        <p style="margin:0 0 20px 0;font-size:32px;color:#f39c12;font-weight:bold;">15% DE RÉDUCTION</p>
        <p style="margin:0 0 10px 0;font-size:14px;color:#856404;">Code promo :</p>
        <p style="margin:0;font-size:28px;color:#f39c12;font-weight:bold;letter-spacing:3px;">${discountCode}</p>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Valable jusqu'au <strong>${expiryDate}</strong></p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/products" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Profiter de mon cadeau</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Bon anniversaire encore !<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendVIPAccess(email, vipCode, earlyAccessDate) {
    const subject = `👑 Bienvenue dans le Club VIP EkoNzims !`;
    const text = `Félicitations !\n\nVous faites maintenant partie de notre Club VIP et bénéficiez d'avantages exclusifs :\n\n✨ Accès anticipé aux nouveaux produits\n🎁 Offres réservées aux membres VIP\n🚚 Livraison prioritaire\n📞 Support client prioritaire\n\nVotre code VIP : ${vipCode}\nProchain accès anticipé : ${earlyAccessDate}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Bienvenue dans le Club VIP ! 👑</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Félicitations ! Vous faites maintenant partie de notre <strong style="color:#f39c12;">Club VIP</strong> et bénéficiez d'avantages exclusifs.</p>
      <div style="background-color:#f5f5f5;border-radius:8px;padding:25px;margin:25px 0;">
        <h3 style="color:#f39c12;margin-top:0;text-align:center;">✨ Vos avantages VIP ✨</h3>
        <ul style="list-style:none;padding:0;margin:15px 0 0 0;">
          <li style="padding:10px 0;border-bottom:1px solid #ddd;font-size:15px;color:#2c3e50;">🌟 <strong>Accès anticipé</strong> aux nouveaux produits</li>
          <li style="padding:10px 0;border-bottom:1px solid #ddd;font-size:15px;color:#2c3e50;">🎁 <strong>Offres exclusives</strong> réservées aux VIP</li>
          <li style="padding:10px 0;border-bottom:1px solid #ddd;font-size:15px;color:#2c3e50;">🚚 <strong>Livraison prioritaire</strong> gratuite</li>
          <li style="padding:10px 0;font-size:15px;color:#2c3e50;">📞 <strong>Support client prioritaire</strong></li>
        </ul>
      </div>
      <div style="background-color:#fff3cd;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 10px 0;font-size:14px;color:#856404;">Votre code VIP :</p>
        <p style="margin:0;font-size:24px;color:#f39c12;font-weight:bold;letter-spacing:2px;">${vipCode}</p>
      </div>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#2c3e50;">📅 <strong>Prochain accès anticipé :</strong> ${earlyAccessDate}</p>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Bienvenue dans l'élite EkoNzims !<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS DE RÉENGAGEMENT ===

  static async sendInactiveUserOffer(email, daysSinceLastOrder, discountCode) {
    const subject = `💚 On vous a manqué ! 10% pour votre retour`;
    const text = `Bonjour,\n\nCela fait ${daysSinceLastOrder} jours que nous ne vous avons pas vu ! Nous espérons que tout va bien.\n\nPour vous accueillir de nouveau, voici 10% de réduction :\n\nCode : ${discountCode}\n\nNos produits écologiques vous attendent !\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">On vous a manqué ! 💚</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Cela fait <strong>${daysSinceLastOrder} jours</strong> que nous ne vous avons pas vu ! Nous espérons que tout va bien.</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:25px;margin:25px 0;text-align:center;">
        <p style="margin:0 0 15px 0;font-size:18px;color:#27ae60;font-weight:bold;">Pour vous accueillir de nouveau :</p>
        <p style="margin:0 0 20px 0;font-size:28px;color:#27ae60;font-weight:bold;">10% DE RÉDUCTION</p>
        <p style="margin:0 0 10px 0;font-size:14px;color:#666;">Code promo :</p>
        <p style="margin:0;font-size:24px;color:#27ae60;font-weight:bold;letter-spacing:3px;">${discountCode}</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/products" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Découvrir les nouveautés</a>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Nos produits écologiques vous attendent ! 🌿</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendWishlistLowStockAlert(email, productName, productId, stockRemaining) {
    const subject = `⚠️ Dernière chance : ${productName} bientôt en rupture !`;
    const productLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/products/${productId}`;
    const text = `Bonjour,\n\nAttention ! Le produit "${productName}" de votre liste de souhaits est bientôt en rupture de stock.\n\nStock restant : ${stockRemaining} unité(s)\n\nCommandez-le avant qu'il ne soit trop tard :\n${productLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#e74c3c;margin-top:0;">Dernière chance ! ⚠️</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Attention ! Le produit <strong style="color:#27ae60;">${productName}</strong> de votre liste de souhaits est bientôt en rupture de stock.</p>
      <div style="background-color:#fee;border-left:4px solid #e74c3c;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:16px;color:#c0392b;font-weight:bold;">📦 Plus que ${stockRemaining} unité(s) en stock !</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${productLink}" style="background-color:#e74c3c;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(231, 76, 60, 0.3);">Commander maintenant</a>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Ne manquez pas ce produit populaire !</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendNewCategoryAnnouncement(email, categoryName, categoryDescription, categoryLink) {
    const subject = `✨ Nouveau : ${categoryName} disponible sur EkoNzims !`;
    const text = `Bonjour,\n\nDécouvrez notre nouvelle catégorie : ${categoryName}\n\n${categoryDescription}\n\nExplorez-la dès maintenant :\n${categoryLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Nouvelle catégorie disponible ! ✨</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Nous sommes ravis de vous annoncer l'arrivée de notre nouvelle catégorie :</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:25px;margin:25px 0;text-align:center;">
        <p style="margin:0;font-size:28px;color:#27ae60;font-weight:bold;">${categoryName}</p>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#555;">${categoryDescription}</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${categoryLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Découvrir ${categoryName}</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendPriceDropAlert(email, productName, productId, oldPrice, newPrice, savingsPercent) {
    const subject = `💰 Baisse de prix : ${productName} à ${newPrice}€ !`;
    const productLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/products/${productId}`;
    const text = `Bonjour,\n\nBonne nouvelle ! Le prix de "${productName}" a baissé !\n\nAncien prix : ${oldPrice}€\nNouveau prix : ${newPrice}€\nÉconomisez ${savingsPercent}% !\n\nCommandez maintenant :\n${productLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Baisse de prix ! 💰</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Bonne nouvelle ! Le prix de <strong style="color:#27ae60;">${productName}</strong> a baissé !</p>
      <div style="background-color:#fff3cd;border-radius:8px;padding:25px;margin:25px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#999;font-size:16px;text-decoration:line-through;">Ancien prix :</td>
            <td style="padding:10px 0;color:#999;font-size:16px;text-align:right;text-decoration:line-through;">${oldPrice}€</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#27ae60;font-size:24px;font-weight:bold;">Nouveau prix :</td>
            <td style="padding:10px 0;color:#27ae60;font-size:24px;text-align:right;font-weight:bold;">${newPrice}€</td>
          </tr>
        </table>
        <p style="margin:20px 0 0 0;text-align:center;font-size:20px;color:#f39c12;font-weight:bold;">Économisez ${savingsPercent}% !</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${productLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Profiter de l'offre</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS DE SERVICE CLIENT ===

  static async sendSupportTicketOpened(email, ticketId, subject, priority) {
    const priorityColors = { low: '#3498db', medium: '#f39c12', high: '#e74c3c' };
    const priorityColor = priorityColors[priority] || '#3498db';
    const text = `Bonjour,\n\nVotre ticket de support a été créé avec succès.\n\nNuméro : ${ticketId}\nSujet : ${subject}\nPriorité : ${priority}\n\nNotre équipe vous répondra dans les plus brefs délais.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Ticket de support créé ✓</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Votre ticket de support a été créé avec succès. Notre équipe vous répondra dans les plus brefs délais.</p>
      <div style="background-color:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">🎫 <strong>Numéro :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;"><strong>${ticketId}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">📝 <strong>Sujet :</strong></td>
            <td style="padding:8px 0;color:#2c3e50;font-size:15px;text-align:right;">${subject}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#666;font-size:15px;">⚡ <strong>Priorité :</strong></td>
            <td style="padding:8px 0;color:${priorityColor};font-size:15px;text-align:right;font-weight:bold;">${priority}</td>
          </tr>
        </table>
      </div>
      <p style="font-size:14px;color:#888;">Vous recevrez une notification par email dès que nous aurons une réponse.</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html2 = this._emailTemplate(content);

    return this._send({ to: email, subject: `🎫 Ticket #${ticketId} créé — ${subject}`, text, html: html2 });
  }

  static async sendSupportTicketResponse(email, ticketId, responseMessage, responderName = "Support EkoNzims") {
    const ticketLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/support/tickets/${ticketId}`;
    const subject = `💬 Nouvelle réponse à votre ticket #${ticketId}`;
    const text = `Bonjour,\n\nVous avez reçu une nouvelle réponse à votre ticket #${ticketId}.\n\nRéponse :\n${responseMessage}\n\nVoir le ticket complet : ${ticketLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Nouvelle réponse à votre ticket 💬</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Vous avez reçu une nouvelle réponse à votre ticket <strong>#${ticketId}</strong>.</p>
      <div style="background-color:#f5f5f5;border-left:4px solid #27ae60;padding:20px;margin:20px 0;border-radius:5px;">
        <p style="margin:0 0 10px 0;font-size:13px;color:#888;"><strong>${responderName}</strong></p>
        <p style="margin:0;font-size:15px;color:#2c3e50;white-space:pre-wrap;">${responseMessage}</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${ticketLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Voir le ticket</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendSatisfactionSurvey(email, orderId, surveyLink) {
    const subject = `📊 Votre avis compte : enquête de satisfaction`;
    const text = `Bonjour,\n\nNous aimerions connaître votre avis sur votre expérience avec EkoNzims (commande #${orderId}).\n\nRépondez à notre courte enquête (2 minutes) :\n${surveyLink}\n\nVotre feedback nous aide à nous améliorer.\n\nMerci,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre avis nous intéresse ! 📊</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Nous aimerions connaître votre avis sur votre expérience récente avec EkoNzims (commande <strong>#${orderId}</strong>).</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:25px;margin:25px 0;text-align:center;">
        <p style="margin:0 0 15px 0;font-size:18px;color:#27ae60;font-weight:bold;">⏱️ 2 minutes seulement</p>
        <p style="margin:0;font-size:15px;color:#555;">Votre feedback nous aide à nous améliorer</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${surveyLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Répondre à l'enquête</a>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Merci de nous aider à améliorer nos services ! 💚</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS DE SÉCURITÉ ===

  static async sendNewLoginAlert(email, loginDate, deviceInfo, location, ipAddress) {
    const subject = `🔐 Nouvelle connexion détectée sur votre compte`;
    const text = `Bonjour,\n\nUne nouvelle connexion à votre compte EkoNzims a été détectée.\n\nDate : ${loginDate}\nAppareil : ${deviceInfo}\nLocalisation : ${location}\nIP : ${ipAddress}\n\nSi ce n'est pas vous, changez immédiatement votre mot de passe.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#f39c12;margin-top:0;">Nouvelle connexion détectée 🔐</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Une nouvelle connexion à votre compte EkoNzims a été détectée.</p>
      <div style="background-color:#fff3cd;border-radius:8px;padding:20px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#856404;font-size:15px;">📅 <strong>Date :</strong></td>
            <td style="padding:8px 0;color:#856404;font-size:15px;text-align:right;">${loginDate}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#856404;font-size:15px;">📱 <strong>Appareil :</strong></td>
            <td style="padding:8px 0;color:#856404;font-size:15px;text-align:right;">${deviceInfo}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#856404;font-size:15px;">📍 <strong>Localisation :</strong></td>
            <td style="padding:8px 0;color:#856404;font-size:15px;text-align:right;">${location}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#856404;font-size:15px;">🌐 <strong>Adresse IP :</strong></td>
            <td style="padding:8px 0;color:#856404;font-size:15px;text-align:right;">${ipAddress}</td>
          </tr>
        </table>
      </div>
      <div style="background-color:#fee;border-left:4px solid #e74c3c;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#c0392b;">⚠️ <strong>Ce n'est pas vous ?</strong> Changez immédiatement votre mot de passe et contactez notre support.</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/forgot-password" style="background-color:#e74c3c;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(231, 76, 60, 0.3);">Changer mon mot de passe</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  // === EMAILS AUTOMATISÉS INTELLIGENTS ===

  static async sendReorderSuggestion(email, productName, productId, lastOrderDate, daysAgo) {
    const subject = `🔄 Temps de réapprovisionner ? ${productName}`;
    const productLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/products/${productId}`;
    const text = `Bonjour,\n\nVous aviez commandé "${productName}" il y a ${daysAgo} jours (le ${lastOrderDate}).\n\nIl est peut-être temps de vous réapprovisionner ?\n\nCommandez à nouveau :\n${productLink}\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Temps de réapprovisionner ? 🔄</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Vous aviez commandé <strong style="color:#27ae60;">${productName}</strong> il y a <strong>${daysAgo} jours</strong> (le ${lastOrderDate}).</p>
      <div style="background-color:#e8f5e9;border-left:4px solid #27ae60;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#2c3e50;">💡 Il est peut-être temps de vous réapprovisionner ?</p>
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${productLink}" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Commander à nouveau</a>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Vos produits écologiques préférés vous attendent ! 🌿</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendProductRecommendations(email, recommendedProducts, basedOnProduct) {
    const subject = `✨ Produits recommandés pour vous`;
    const text = `Bonjour,\n\nBasé sur votre intérêt pour "${basedOnProduct}", nous vous recommandons ces produits écologiques :\n\n${recommendedProducts.map(p => `- ${p.name} (${p.price}€)`).join('\n')}\n\nDécouvrez-les sur notre site.\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Produits recommandés pour vous ✨</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Basé sur votre intérêt pour <strong style="color:#27ae60;">${basedOnProduct}</strong>, nous vous recommandons :</p>
      <div style="margin:25px 0;">
        ${recommendedProducts.map(product => `
          <div style="background-color:#f5f5f5;border-radius:8px;padding:15px;margin:10px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#2c3e50;font-size:16px;font-weight:bold;">${product.name}</td>
                <td style="text-align:right;color:#27ae60;font-size:18px;font-weight:bold;">${product.price}€</td>
              </tr>
              ${product.description ? `<tr><td colspan="2" style="padding-top:5px;color:#666;font-size:14px;">${product.description}</td></tr>` : ''}
            </table>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/products" style="background-color:#27ae60;color:white;padding:15px 40px;text-decoration:none;border-radius:50px;display:inline-block;font-weight:bold;font-size:16px;box-shadow:0 4px 15px rgba(39, 174, 96, 0.3);">Voir tous les produits</a>
      </div>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }

  static async sendEcoImpactReport(email, monthYear, co2Saved, plasticSaved, orderCount) {
    const subject = `🌍 Votre impact écologique — ${monthYear}`;
    const text = `Bonjour,\n\nVotre impact écologique en ${monthYear} :\n\n🌱 ${co2Saved} kg de CO2 économisés\n♻️ ${plasticSaved} kg de plastique évités\n📦 ${orderCount} commande(s) écologique(s)\n\nMerci de contribuer à un monde plus vert !\n\nCordialement,\nEkoNzims`;
    const content = `
      <h2 style="color:#27ae60;margin-top:0;">Votre impact écologique 🌍</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">Grâce à vos achats écologiques en <strong>${monthYear}</strong>, vous avez contribué à protéger notre planète !</p>
      <div style="background-color:#e8f5e9;border-radius:8px;padding:25px;margin:25px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:15px 0;border-bottom:1px solid #c8e6c9;text-align:center;">
              <p style="margin:0;font-size:36px;color:#27ae60;font-weight:bold;">${co2Saved} kg</p>
              <p style="margin:5px 0 0 0;font-size:14px;color:#666;">🌱 CO2 économisés</p>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 0;border-bottom:1px solid #c8e6c9;text-align:center;">
              <p style="margin:0;font-size:36px;color:#27ae60;font-weight:bold;">${plasticSaved} kg</p>
              <p style="margin:5px 0 0 0;font-size:14px;color:#666;">♻️ Plastique évités</p>
            </td>
          </tr>
          <tr>
            <td style="padding:15px 0;text-align:center;">
              <p style="margin:0;font-size:36px;color:#27ae60;font-weight:bold;">${orderCount}</p>
              <p style="margin:5px 0 0 0;font-size:14px;color:#666;">📦 Commande(s) écologique(s)</p>
            </td>
          </tr>
        </table>
      </div>
      <div style="background-color:#fff3cd;border-left:4px solid #f39c12;padding:15px;margin:20px 0;border-radius:5px;">
        <p style="margin:0;font-size:15px;color:#856404;text-align:center;">🌟 <strong>Merci de contribuer à un monde plus vert !</strong></p>
      </div>
      <p style="font-size:14px;color:#888;text-align:center;">Continuez à faire la différence avec EkoNzims ! 💚</p>
      <p style="font-size:16px;margin-top:30px;color:#555;">Cordialement,<br/><strong style="color:#27ae60;">L'équipe EkoNzims</strong></p>
    `;
    const html = this._emailTemplate(content);

    return this._send({ to: email, subject, text, html });
  }
}

module.exports = EmailService;
