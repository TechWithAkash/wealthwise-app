import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Typography } from '../../constants/theme';

export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'light' | 'outline' | 'danger' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    disabled ? styles.disabled : null,
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`label_${variant}`],
    disabled ? styles.labelDisabled : null,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : Colors.light.primary} />
      ) : (
        <Text style={labelStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.accentLight,
  },
  light: {
    backgroundColor: Colors.light.primaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  danger: {
    backgroundColor: Colors.light.expenseLight,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: Colors.light.border,
    opacity: 0.6,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  label_primary: {
    color: '#FFFFFF',
  },
  label_secondary: {
    color: Colors.light.text,
  },
  label_light: {
    color: Colors.light.primaryDark,
  },
  label_outline: {
    color: Colors.light.primary,
  },
  label_danger: {
    color: Colors.light.expenseDark,
  },
  label_ghost: {
    color: Colors.light.textSecondary,
  },
  labelDisabled: {
    color: Colors.light.textMuted,
  },
});
export default Button;
