import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Text } from '../../components/ui/Text';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { BalanceCard } from '../../components/Dashboard/BalanceCard';
import { QuickActions } from '../../components/Dashboard/QuickActions';
import { SpendingChart } from '../../components/Dashboard/SpendingChart';
import { RecentTransactions } from '../../components/Dashboard/RecentTransactions';

export default function DashboardScreen() {
  const { user } = useAppState();
  const [refreshing, setRefreshing] = useState(false);

  // Safety guard for TypeScript type checking
  if (!user) return null;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Custom Header Bar */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          {/* Avatar circle containing 'AX' exactly as shown in screenshot */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.welcomeLabel}>Welcome back</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>
        
        {/* Notification Bell with indicator dot */}
        <View style={styles.bellWrapper}>
          <View style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={22} color={Colors.light.text} />
          </View>
          <View style={styles.bellIndicator} />
        </View>
      </View>

      {/* Scrollable Dashboard Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      >
        <BalanceCard />
        <QuickActions />
        <SpendingChart />
        <RecentTransactions />
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  profileText: {
    justifyContent: 'center',
  },
  welcomeLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  bellWrapper: {
    position: 'relative',
  },
  bellButton: {
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
  bellIndicator: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.round,
    backgroundColor: '#10B981', // green notification indicator
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 110, // padding to clear bottom absolute floating tab bar
  },
});
