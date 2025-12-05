import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌿 EkoNzims</Text>
        <Text style={styles.subtitle}>Nettoyage Écologique</Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🛍️</Text>
          <Text style={styles.cardTitle}>E-commerce</Text>
          <Text style={styles.cardText}>Produits de nettoyage bio</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🧹</Text>
          <Text style={styles.cardTitle}>Services Pro</Text>
          <Text style={styles.cardText}>Réservez nos services</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>♻️</Text>
          <Text style={styles.cardTitle}>Écologique</Text>
          <Text style={styles.cardText}>100% naturel et biodégradable</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Commencer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#27ae60',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  featuresContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#f39c12',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
