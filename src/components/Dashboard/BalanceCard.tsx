import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/currency';

export const BalanceCard: React.FC = () => {
  const { accounts, transactions } = useAppState();
  
  // Calculate dynamic totals from newly added transactions
  // plus the baseline values from the mockups
  const mainAccount = accounts.find(a => a.name === 'Main Account') || accounts[0];
  const totalBalance = mainAccount ? mainAccount.balance : 12480.50;

  // Let's calculate total income and expense additions beyond the defaults
  const newTxIncome = transactions
    .filter(tx => tx.id.startsWith('t_') && tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const newTxExpense = transactions
    .filter(tx => tx.id.startsWith('t_') && tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const displayIncome = 18200.00 + newTxIncome;
  const displayExpense = 5719.00 + newTxExpense;

  return (
    <Card variant="premium" padding="lg" style={styles.card}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
      </View>
      
      <Text style={styles.balanceValue}>
        {formatCurrency(totalBalance)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        {/* Income Stat */}
        <View style={styles.statPillContainer}>
          <View style={styles.statIconWrapperGreen}>
            <Ionicons name="arrow-down-outline" size={16} color="#10B981" />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValueIncome}>
              {formatCurrency(displayIncome).split('.')[0]}
            </Text>
          </View>
        </View>

        {/* Vertical divider */}
        <View style={styles.verticalDivider} />

        {/* Expense Stat */}
        <View style={styles.statPillContainer}>
          <View style={styles.statIconWrapperRed}>
            <Ionicons name="arrow-up-outline" size={16} color="#EF4444" />
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statValueExpense}>
              {formatCurrency(displayExpense).split('.')[0]}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  balanceHeader: {
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  balanceTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statPillContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIconWrapperGreen: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrapperRed: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  statValueIncome: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  statValueExpense: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: Spacing.md,
  },
});
