import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadows, Spacing } from '../../constants/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'flat' | 'outline' | 'premium';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`pad_${padding}`],
    style,
  ];

  return (
    <View style={cardStyle}>
      {variant === 'premium' && (
        <>
          {/* Decorative subtle background elements for visual depth */}
          <View style={styles.premiumDecor1} />
          <View style={styles.premiumDecor2} />
        </>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.md,
  },
  flat: {
    backgroundColor: Colors.light.card,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  premium: {
    backgroundColor: Colors.light.primary,
    ...Shadows.lg,
  },
  pad_none: {
    padding: 0,
  },
  pad_sm: {
    padding: Spacing.sm,
  },
  pad_md: {
    padding: Spacing.lg,
  },
  pad_lg: {
    padding: Spacing.xxl,
  },
  premiumDecor1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  premiumDecor2: {
    position: 'absolute',
    bottom: -80,
    left: -30,
    width: 200,
    height: 200,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
export default Card;
