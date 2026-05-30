import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Text } from '../components/ui/Text';
import { useAppState } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert } from '../utils/alert';

export default function RegisterScreen() {
  const { registerUser } = useAppState();
  const router = useRouter();

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mainBalance, setMainBalance] = useState('10000');
  const [savingsBalance, setSavingsBalance] = useState('2500');
  const [startingCurrency, setStartingCurrency] = useState('INR'); // INR, USD, EUR

  const handleRegister = () => {
    if (name.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter your full name (minimum 2 characters).');
      return;
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    const startingMain = parseFloat(mainBalance);
    const startingSavings = parseFloat(savingsBalance);

    if (isNaN(startingMain) || startingMain < 0) {
      Alert.alert('Invalid Balance', 'Starting Main balance must be a valid positive number.');
      return;
    }

    if (isNaN(startingSavings) || startingSavings < 0) {
      Alert.alert('Invalid Balance', 'Starting Savings balance must be a valid positive number.');
      return;
    }

    // Call state register payload
    registerUser(
      name.trim(),
      email.trim().toLowerCase(),
      startingMain,
      startingSavings,
      startingCurrency
    );

    Alert.alert(
      'Registration Complete',
      `Welcome to WealthWise, ${name}! Your profile has been created successfully.`,
      [
        {
          text: "Let's track!",
          onPress: () => {
            // Navigate directly to tabs dashboard
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const getCurrencySymbol = (curr: string) => {
    if (curr === 'INR') return '₹';
    if (curr === 'USD') return '$';
    return '€';
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Visual */}
          <View style={styles.headerBlock}>
            <View style={styles.iconBackground}>
              <Ionicons name="wallet" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>WealthWise</Text>
            <Text style={styles.subtitle}>
              Take control of your finances. Create your local profile to start tracking expenses, savings, and trends.
            </Text>
          </View>

          {/* Form Container Card */}
          <View style={styles.formCard}>
            {/* Input 1: Full Name */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color={Colors.light.textSecondary} style={styles.fieldIcon} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Alex Johnson"
                placeholderTextColor={Colors.light.textMuted}
                style={styles.textInput}
                autoCorrect={false}
              />
            </View>

            {/* Input 2: Email */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={20} color={Colors.light.textSecondary} style={styles.fieldIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex.johnson@email.com"
                placeholderTextColor={Colors.light.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.textInput}
              />
            </View>

            {/* Starting Balance Inputs */}
            <View style={styles.balanceGrid}>
              {/* Main Balance */}
              <View style={styles.balanceCol}>
                <Text style={styles.inputLabel}>Main Balance</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.currencyPrefix}>{getCurrencySymbol(startingCurrency)}</Text>
                  <TextInput
                    value={mainBalance}
                    onChangeText={setMainBalance}
                    placeholder="10,000"
                    placeholderTextColor={Colors.light.textMuted}
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Savings Balance */}
              <View style={styles.balanceCol}>
                <Text style={styles.inputLabel}>Savings Balance</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.currencyPrefix}>{getCurrencySymbol(startingCurrency)}</Text>
                  <TextInput
                    value={savingsBalance}
                    onChangeText={setSavingsBalance}
                    placeholder="2,500"
                    placeholderTextColor={Colors.light.textMuted}
                    keyboardType="numeric"
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>

            {/* Currency Selector Row */}
            <Text style={styles.inputLabel}>Default Currency</Text>
            <View style={styles.currencyRow}>
              {['INR', 'USD', 'EUR'].map((curr) => {
                const isActive = startingCurrency === curr;
                return (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => setStartingCurrency(curr)}
                    style={[
                      styles.currencyPill,
                      isActive ? styles.currencyActive : styles.currencyInactive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.currencyLabel,
                        isActive ? styles.currencyLabelActive : styles.currencyLabelInactive,
                      ]}
                    >
                      {curr} ({getCurrencySymbol(curr)})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.arrowIcon} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  headerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.md,
  },
  iconBackground: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.md,
    marginBottom: Spacing.xxl,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.text,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBackground,
    borderRadius: BorderRadius.md,
    height: 48,
    paddingHorizontal: Spacing.md,
  },
  fieldIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
    height: '100%',
    padding: 0,
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  balanceCol: {
    flex: 1,
    gap: Spacing.xs,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginRight: Spacing.xs,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  currencyPill: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  currencyActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  currencyInactive: {
    backgroundColor: Colors.light.accentLight,
    borderColor: Colors.light.cardBorder,
  },
  currencyLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  currencyLabelActive: {
    color: '#FFFFFF',
  },
  currencyLabelInactive: {
    color: Colors.light.textSecondary,
  },
  submitButton: {
    height: 52,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: Spacing.xs,
  },
});
