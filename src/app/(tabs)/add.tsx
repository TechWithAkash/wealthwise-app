import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Text } from '../../components/ui/Text';
import { useAppState } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Keypad } from '../../components/AddExpense/Keypad';
import { Alert } from '../../utils/alert';

export default function AddExpenseScreen() {
  const { categories, accounts, addTransaction } = useAppState();
  const router = useRouter();

  // Keypad input string state
  const [amountStr, setAmountStr] = useState('0');
  
  // Transaction parameter states
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [notes, setNotes] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('Main Account');

  // Keypad state machine functions
  const handleDigitPress = (digit: string) => {
    setAmountStr((prev) => {
      if (prev === '0') {
        return digit;
      }
      
      // If there's a decimal, restrict to 2 decimal places
      if (prev.includes('.')) {
        const [, decimal] = prev.split('.');
        if (decimal && decimal.length >= 2) {
          return prev; // Ignore extra numbers
        }
      }

      // Restrict total characters to 9 to prevent layout issues
      if (prev.length >= 9) {
        return prev;
      }

      return prev + digit;
    });
  };

  const handleDecimalPress = () => {
    setAmountStr((prev) => {
      if (prev.includes('.')) {
        return prev; // Ignore double decimals
      }
      return prev + '.';
    });
  };

  const handleBackspacePress = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  };

  // Convert keypad string state to formatted display amount
  const displayAmount = () => {
    if (amountStr === '0') {
      return '₹0.00';
    }

    if (amountStr.includes('.')) {
      const [integer, decimal] = amountStr.split('.');
      const formattedInt = new Intl.NumberFormat('en-IN').format(Number(integer));
      
      if (decimal === undefined || decimal.length === 0) {
        return `₹${formattedInt}.`;
      }
      if (decimal.length === 1) {
        return `₹${formattedInt}.${decimal}`;
      }
      return `₹${formattedInt}.${decimal}`;
    }

    const formattedInt = new Intl.NumberFormat('en-IN').format(Number(amountStr));
    return `₹${formattedInt}.00`;
  };

  // Clear inputs and reset
  const handleReset = () => {
    setAmountStr('0');
    setNotes('');
    setSelectedCategory('Food');
    setTxType('expense');
  };

  // Persist Transaction flow
  const handleSave = () => {
    const finalAmount = parseFloat(amountStr);
    
    if (isNaN(finalAmount) || finalAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than zero.', [{ text: 'OK' }]);
      return;
    }

    // Prepare transaction payload
    const txPayload = {
      title: notes.trim().length > 0 ? notes.trim() : (txType === 'expense' ? `Spent on ${selectedCategory}` : `Received as ${selectedCategory}`),
      amount: finalAmount,
      type: txType,
      category: selectedCategory,
      date: new Date().toISOString(), // Persists as active system timestamp
      notes: notes.trim(),
      account: selectedAccount,
    };

    // Save transaction globally
    addTransaction(txPayload);

    Alert.alert(
      'Transaction Saved',
      `Successfully added ${txType} of ₹${finalAmount.toFixed(2)} under "${selectedCategory}"!`,
      [
        {
          text: 'Awesome',
          onPress: () => {
            handleReset();
            // Redirect to Dashboard index tab
            router.push('/(tabs)');
          },
        },
      ]
    );
  };

  // Set category list elements (excluding Income category for expenses toggle)
  const availableCategories = categories.filter(c => {
    if (txType === 'expense') {
      return c.name.toLowerCase() !== 'income';
    }
    return true; // Income can see income categories
  });

  const activeAccount = accounts.find(a => a.name === selectedAccount) || accounts[0];
  const activeAccountBalance = activeAccount ? activeAccount.balance : 12480.50;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.light.textSecondary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Add Expense</Text>
        
        <TouchableOpacity
          style={styles.saveButtonCircle}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-sharp" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Amount Input Pad Indicator */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountSubtitle}>Enter Amount</Text>
          <Text style={styles.amountText} numberOfLines={1}>
            {displayAmount()}
          </Text>
        </View>

        {/* Expense vs Income Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleBackground}>
            <TouchableOpacity
              onPress={() => {
                setTxType('expense');
                setSelectedCategory('Food');
              }}
              style={[
                styles.togglePill,
                txType === 'expense' ? styles.toggleActive : null,
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  txType === 'expense' ? styles.toggleLabelActive : styles.toggleLabelInactive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTxType('income');
                setSelectedCategory('Income');
              }}
              style={[
                styles.togglePill,
                txType === 'income' ? styles.toggleActive : null,
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  txType === 'income' ? styles.toggleLabelActive : styles.toggleLabelInactive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Header & Horizontal Scroll Selection */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {availableCategories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            
            // Icon mapping
            let iconName: any = 'restaurant-outline';
            switch (cat.name.toLowerCase()) {
              case 'food': iconName = 'restaurant-outline'; break;
              case 'transport': iconName = 'car-outline'; break;
              case 'shopping': iconName = 'bag-handle-outline'; break;
              case 'health': iconName = 'heart-outline'; break;
              case 'fun': iconName = 'happy-outline'; break;
              case 'income': iconName = 'wallet-outline'; break;
            }

            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.name)}
                style={[
                  styles.categoryCard,
                  isActive ? styles.categoryCardActive : styles.categoryCardInactive,
                ]}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconCircle, isActive ? styles.categoryIconCircleActive : null]}>
                  <Ionicons
                    name={iconName}
                    size={20}
                    color={isActive ? Colors.light.primary : Colors.light.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive ? styles.categoryLabelActive : styles.categoryLabelInactive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Form Details Section */}
        <View style={styles.detailsGroup}>
          {/* Notes field */}
          <View style={styles.detailItemRow}>
            <View style={styles.detailIconWrapper}>
              <Ionicons name="document-text-outline" size={20} color={Colors.light.textSecondary} />
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a note..."
              placeholderTextColor={Colors.light.textMuted}
              style={styles.detailInput}
              autoCorrect={true}
            />
          </View>

          {/* Date Picker Button */}
          <TouchableOpacity
            style={styles.detailItemRow}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Date Picker', 'Date is automatically set to active system today.')}
          >
            <View style={styles.detailIconWrapper}>
              <Ionicons name="calendar-outline" size={20} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.detailText}>
              Today, Dec 14
            </Text>
          </TouchableOpacity>

          {/* Account Selector Button */}
          <TouchableOpacity
            style={styles.detailItemRow}
            activeOpacity={0.7}
            onPress={() => {
              const alternative = selectedAccount === 'Main Account' ? 'Savings Account' : 'Main Account';
              setSelectedAccount(alternative);
              Alert.alert('Account Selected', `Payment account switched to: ${alternative}`);
            }}
          >
            <View style={styles.detailIconWrapper}>
              <Ionicons name="card-outline" size={20} color={Colors.light.textSecondary} />
            </View>
            <Text style={[styles.detailText, { flex: 1 }]}>
              {selectedAccount} — ₹{new Intl.NumberFormat('en-IN').format(activeAccountBalance)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.light.textMuted} style={styles.detailChevron} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Keypad entry */}
        <Keypad
          onPressDigit={handleDigitPress}
          onPressDecimal={handleDecimalPress}
          onPressBackspace={handleBackspacePress}
        />
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
  backButton: {
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  saveButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContent: {
    paddingBottom: 110, // padding to clear bottom tab bar
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  amountSubtitle: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  amountText: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  toggleRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  toggleBackground: {
    flexDirection: 'row',
    backgroundColor: Colors.light.accentLight,
    padding: 4,
    borderRadius: BorderRadius.round,
    width: 200,
    height: 44,
  },
  togglePill: {
    flex: 1,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.light.primary,
    ...Shadows.sm,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleLabelActive: {
    color: '#FFFFFF',
  },
  toggleLabelInactive: {
    color: Colors.light.textSecondary,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  categoryCard: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    gap: Spacing.xs,
  },
  categoryCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFFFF',
  },
  categoryCardInactive: {
    borderColor: Colors.light.cardBorder,
    backgroundColor: '#FFFFFF',
  },
  categoryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconCircleActive: {
    backgroundColor: Colors.light.primaryLight,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: Colors.light.primary,
  },
  categoryLabelInactive: {
    color: Colors.light.textSecondary,
  },
  detailsGroup: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: Spacing.md,
  },
  detailIconWrapper: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  detailInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
    height: '100%',
    padding: 0,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.text,
  },
  detailChevron: {
    marginLeft: 'auto',
  },
});
