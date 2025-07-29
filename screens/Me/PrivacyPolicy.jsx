import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.text}>
            At MJVI Realty, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Collection</Text>
          <Text style={styles.text}>
            We may collect personal information from you when you register on our site, place an inquiry, or interact with our services. This information may include your name, email address, phone number, and any other details you provide.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage of Information</Text>
          <Text style={styles.text}>
            The information we collect may be used in the following ways:
          </Text>
          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• To personalize your experience</Text>
            <Text style={styles.bulletPoint}>• To improve our website and services</Text>
            <Text style={styles.bulletPoint}>• To process transactions</Text>
            <Text style={styles.bulletPoint}>• To send periodic emails regarding your inquiries or other products and services</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.text}>
            We implement a variety of security measures to maintain the safety of your personal information. Your information is stored in secure networks and is only accessible by a limited number of persons who have special access rights.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent</Text>
          <Text style={styles.text}>
            By using our services, you consent to our Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy Updates</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account or by placing a prominent notice on our site.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Email: support@mjvirealty.com
          </Text>
          <Text style={styles.contactInfo}>
            Phone: (123) 456-7890
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomMargin} />
    </View>
  );
};

// ... (keep your existing StyleSheet code)

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F7F7F8', // Light background for iOS style
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5B7931', // Title color
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF', // Section background color
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5B7931', // Section title color
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#1C1C1E', // Text color
    lineHeight: 24,
    textAlign: 'justify', // Justify text alignment
  },
  bulletContainer: {
    marginVertical: 8,
    marginLeft: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#1C1C1E', // Bullet point text color
    lineHeight: 24,
  },
  contactInfo: {
    fontSize: 16,
    color: '#1C1C1E', // Contact info color
    lineHeight: 24,
    marginTop: 12,
  },
  bottomMargin: {
    height: 40, // Medium bottom margin height
  },
});

export default PrivacyPolicy;
