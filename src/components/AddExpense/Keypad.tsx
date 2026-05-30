import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';

export interface KeypadProps {
  onPressDigit: (digit: string) => void;
  onPressDecimal: () => void;
  onPressBackspace: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onPressDigit,
  onPressDecimal,
  onPressBackspace,
}) => {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace'],
  ];

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell) => {
            const isBackspace = cell === 'backspace';
            const isDecimal = cell === '.';

            const handlePress = () => {
              if (isBackspace) {
                onPressBackspace();
              } else if (isDecimal) {
                onPressDecimal();
              } else {
                onPressDigit(cell);
              }
            };

            return (
              <TouchableOpacity
                key={cell}
                onPress={handlePress}
                activeOpacity={0.7}
                style={[
                  styles.cellButton,
                  isBackspace ? styles.backspaceButton : null,
                ]}
              >
                {isBackspace ? (
                  <Ionicons name="backspace-outline" size={24} color={Colors.light.text} />
                ) : (
                  <Text style={styles.cellText}>{cell}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    ...Shadows.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  cellButton: {
    flex: 1,
    height: 54,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backspaceButton: {
    backgroundColor: Colors.light.accentLight,
  },
  cellText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
});
export default Keypad;
