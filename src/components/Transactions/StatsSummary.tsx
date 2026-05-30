import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/theme';
import { Text } from '../ui/Text';

export interface StatsSummaryProps {
  income: number;
  expense: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ income, expense }) => {
  const net = income - expense;
  
  const formatValue = (amount: number, isNet = false) => {
    const absVal = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, // Round to whole numbers as in Screen 5
    }).format(absVal);

    if (isNet) {
      return amount >= 0 ? `+${formatted}` : `-${formatted}`;
    }
    return formatted;
  };

  return (
    <View style={styles.container}>
      {/* Income Column */}
      <View style={styles.column}>
        <Text style={styles.label}>Income</Text>
        <Text style={[styles.value, styles.incomeText]}>
          +{formatValue(income)}
        </Text>
      </View>

      <View style={styles.verticalDivider} />

      {/* Expense Column */}
      <View style={styles.column}>
        <Text style={styles.label}>Expenses</Text>
        <Text style={[styles.value, styles.expenseText]}>
          -{formatValue(expense)}
        </Text>
      </View>

      <View style={styles.verticalDivider} />

      {/* Net Column */}
      <View style={styles.column}>
        <Text style={styles.label}>Net</Text>
        <Text style={[styles.value, net >= 0 ? styles.netPositiveText : styles.netNegativeText]}>
          {formatValue(net, true)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  incomeText: {
    color: Colors.light.income,
  },
  expenseText: {
    color: Colors.light.expense,
  },
  netPositiveText: {
    color: Colors.light.text,
  },
  netNegativeText: {
    color: Colors.light.expense,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.light.cardBorder,
  },
});
export default StatsSummary;
