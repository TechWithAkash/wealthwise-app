export const Colors = {
  light: {
    // Brand colors
    primary: '#10B981',       // Sleek vibrant green
    primaryLight: '#E6FDF5',  // Very light green for pills/badges
    primaryDark: '#047857',   // Darker green for text in light pills
    
    // Status colors
    expense: '#EF4444',       // Red for expenses
    expenseLight: '#FEE2E2',  // Light red background
    expenseDark: '#B91C1C',   // Darker red for text
    
    income: '#10B981',        // Green for income
    incomeLight: '#D1FAE5',   // Light green background
    
    // Neutral backgrounds
    background: '#F9FAFB',    // Sleek light grey screen background
    card: '#FFFFFF',          // Card backgrounds
    cardBorder: '#F3F4F6',    // Card border
    border: '#E5E7EB',        // General border color
    inputBackground: '#F3F4F6', // Inputs & Search bar backgrounds
    
    // Text colors
    text: '#111827',          // Charcoal black for titles/primary
    textSecondary: '#6B7280', // Medium gray for captions/secondary
    textMuted: '#9CA3AF',     // Light gray for placeholder
    
    // Accent backgrounds
    accentLight: '#F3F4F6',   // Standard button inactive/gray pill background
    
    // Bottom Tab Bar
    tabActive: '#10B981',
    tabInactive: '#9CA3AF',
    tabBackground: '#FFFFFF',
  },
  dark: {
    // We'll keep it unified to maintain consistency across the app,
    // using the light/medium modern colorway shown in the screens.
    primary: '#10B981',
    primaryLight: '#E6FDF5',
    primaryDark: '#047857',
    expense: '#EF4444',
    expenseLight: '#FEE2E2',
    expenseDark: '#B91C1C',
    income: '#10B981',
    incomeLight: '#D1FAE5',
    background: '#F9FAFB',
    card: '#FFFFFF',
    cardBorder: '#F3F4F6',
    border: '#E5E7EB',
    inputBackground: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    accentLight: '#F3F4F6',
    tabActive: '#10B981',
    tabInactive: '#9CA3AF',
    tabBackground: '#FFFFFF',
  }
};

export type ColorTheme = typeof Colors.light;
