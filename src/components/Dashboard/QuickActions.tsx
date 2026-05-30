import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert } from '../../utils/alert';

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const handleAction = (type: string) => {
    if (type === 'Reports') {
      router.push('/(tabs)/transactions');
    } else {
      Alert.alert(type, `WealthWise: ${type} feature is coming soon!`, [{ text: 'OK' }]);
    }
  };

  const actions = [
    { name: 'Send', icon: 'send-outline' as const, color: '#10B981' },
    { name: 'Receive', icon: 'download-outline' as const, color: '#10B981' },
    { name: 'Wallet', icon: 'wallet-outline' as const, color: '#10B981' },
    { name: 'Reports', icon: 'bar-chart-outline' as const, color: '#10B981' },
  ];

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <TouchableOpacity
          key={act.name}
          style={styles.actionItem}
          onPress={() => handleAction(act.name)}
          activeOpacity={0.8}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={act.icon} size={22} color={act.color} />
          </View>
          <Text style={styles.actionLabel}>{act.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.round,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.sm,
  },
  actionLabel: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
