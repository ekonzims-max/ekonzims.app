const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const User = require('./User'); // Fallback in-memory

class UserSupabase {
  // Trouver un utilisateur par email
  static async findByEmail(email) {
    if (!supabase) return User.findByEmail(email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    if (!supabase) return User.findById(id);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Créer un utilisateur
  static async create(email, password, firstName, lastName) {
    if (!supabase) return User.create(email, password, firstName, lastName);
    
    // Vérifier si c'est le premier utilisateur
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    const isFirstUser = !existingUsers || existingUsers.length === 0;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        role: isFirstUser ? 'admin' : 'user',
        email_verified: false,
        verification_token: verificationToken,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Vérifier l'email
  static async verifyEmail(token) {
    if (!supabase) return User.verifyEmail(token);
    
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .single();
    
    if (findError || !user) return null;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email_verified: true, 
        verification_token: null 
      })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    return user;
  }

  // Générer un token de reset
  static async generatePasswordReset(email) {
    if (!supabase) return User.generatePasswordReset(email);
    
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 heure
    
    const { error } = await supabase
      .from('users')
      .update({ 
        reset_token: resetToken,
        reset_token_expires: resetExpires
      })
      .eq('id', user.id);
    
    if (error) throw error;
    return resetToken;
  }

  // Réinitialiser le mot de passe
  static async resetPassword(token, newPassword) {
    if (!supabase) return User.resetPassword(token, newPassword);
    
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token)
      .gt('reset_token_expires', new Date().toISOString())
      .single();
    
    if (findError || !user) return false;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null
      })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    return true;
  }

  // Obtenir tous les utilisateurs
  static async getAll() {
    if (!supabase) return User.getAll();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Promouvoir en admin
  static async makeAdmin(userId) {
    if (!supabase) return User.makeAdmin(userId);
    
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Supprimer tous les utilisateurs
  static async deleteAll() {
    if (!supabase) return User.deleteAll();
    
    const { error } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) throw error;
    return true;
  }
}

module.exports = UserSupabase;
