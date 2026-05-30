import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Text } from '../../components/ui/Text';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../utils/alert';

export default function ProfileScreen() {
  const { user, currency, updateCurrency, signOut } = useAppState();

  // Safety guard for TypeScript type checking
  if (!user) return null;

  const handleAction = (itemTitle: string) => {
    if (itemTitle === 'Currency') {
      // Toggle currency for testability
      const nextCurrency = currency === 'INR' ? 'USD' : currency === 'USD' ? 'EUR' : 'INR';
      const symbols: { [key: string]: string } = { INR: '₹', USD: '$', EUR: '€' };
      updateCurrency(nextCurrency);
      Alert.alert(
        'Currency Switched',
        `Active currency is now set to: ${nextCurrency} (${symbols[nextCurrency]})`
      );
    } else {
      Alert.alert(itemTitle, `WealthWise: "${itemTitle}" configurations are loaded!`, [{ text: 'OK' }]);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of WealthWise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            Alert.alert('Signed Out', 'You have been logged out.');
          },
        },
      ]
    );
  };

  const getCurrencyDisplay = () => {
    if (currency === 'INR') return 'INR (₹)';
    if (currency === 'USD') return 'USD ($)';
    return `${currency} (€)`;
  };

  // Structured menu items matching the design exactly
  const accountGroup = [
    { title: 'Personal Info', icon: 'person-outline' as const },
    { title: 'Payment Methods', icon: 'card-outline' as const },
    { title: 'Notifications', icon: 'notifications-outline' as const },
    { title: 'Security', icon: 'shield-checkmark-outline' as const },
  ];

  const preferencesGroup = [
    { title: 'Currency', icon: 'globe-outline' as const, value: getCurrencyDisplay() },
    { title: 'Export Data', icon: 'download-outline' as const },
  ];

  const supportGroup = [
    { title: 'Help & FAQ', icon: 'help-circle-outline' as const },
    { title: 'Contact Support', icon: 'chatbubble-ellipses-outline' as const },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => handleAction('Settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Block */}
        <View style={styles.userContainer}>
          <View style={styles.largeAvatarCircle}>
            <Text style={styles.largeAvatarText}>{user.avatar}</Text>
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={12} color={Colors.light.primaryDark} style={styles.starIcon} />
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
        </View>

        {/* Stats card */}
        <Card padding="none" style={styles.statsCard}>
          <View style={styles.statsRow}>
            {/* Transactions Count */}
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{user.totalTransactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
            
            <View style={styles.verticalDivider} />
            
            {/* Savings Balance */}
            <View style={styles.statCol}>
              <Text style={styles.statNumberGreen}>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: currency,
                  maximumFractionDigits: 0,
                }).format(user.totalSavings)}
              </Text>
              <Text style={styles.statLabel}>Savings</Text>
            </View>
          </View>
        </Card>

        {/* Group 1: Account */}
        <Text style={styles.groupHeader}>Account</Text>
        <View style={styles.menuBox}>
          {accountGroup.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index < accountGroup.length - 1 ? styles.menuItemBorder : null,
              ]}
              onPress={() => handleAction(item.title)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={Colors.light.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Group 2: Preferences */}
        <Text style={styles.groupHeader}>Preferences</Text>
        <View style={styles.menuBox}>
          {preferencesGroup.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index < preferencesGroup.length - 1 ? styles.menuItemBorder : null,
              ]}
              onPress={() => handleAction(item.title)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={Colors.light.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.title}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Group 3: Support */}
        <Text style={styles.groupHeader}>Support</Text>
        <View style={styles.menuBox}>
          {supportGroup.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index < supportGroup.length - 1 ? styles.menuItemBorder : null,
              ]}
              onPress={() => handleAction(item.title)}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={Colors.light.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.light.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Group 4: Logout Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.light.expenseDark} style={styles.signOutIcon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  scrollContent: {
    paddingBottom: 120, // Clear custom bottom tab bar
  },
  userContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  largeAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  largeAvatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
  },
  starIcon: {
    marginRight: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primaryDark,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statNumberGreen: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.light.cardBorder,
  },
  groupHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuBox: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.cardBorder,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  menuValue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.expenseLight,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    marginBottom: Spacing.huge,
  },
  signOutIcon: {
    marginRight: Spacing.sm,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.expenseDark,
  },
});
