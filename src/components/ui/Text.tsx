import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/theme';

export interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'bodySemibold' | 'small' | 'smallSemibold' | 'code' | 'amount';
  color?: string;
  style?: TextStyle | TextStyle[];
}

export const Text: React.FC<ThemedTextProps> = ({
  type = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[type],
    color ? { color } : null,
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: Colors.light.text,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.xxl,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.lg,
  },
  body: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.md,
  },
  bodySemibold: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.md,
  },
  small: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.sm,
    color: Colors.light.textSecondary,
  },
  smallSemibold: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.sm,
  },
  code: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.xs,
    color: Colors.light.textSecondary,
  },
  amount: {
    fontSize: Typography.fontSize.huge,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.huge,
    letterSpacing: -1,
  },
});
export default Text;
