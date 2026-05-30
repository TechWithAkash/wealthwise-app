import { Alert as RNAlert, Platform } from 'react-native';

export interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean }
  ) => {
    if (Platform.OS === 'web') {
      // On web, display standard browser alert or confirm
      const fullMessage = message ? `${title}\n\n${message}` : title;

      if (buttons && buttons.length > 0) {
        // If it looks like a confirm dialog (contains destructive or cancel choices)
        const isConfirm = buttons.some(
          (b) => b.style === 'destructive' || b.style === 'cancel' || b.text === 'Delete' || b.text === 'Sign Out'
        );

        if (isConfirm) {
          const accepted = window.confirm(fullMessage);
          if (accepted) {
            // Find positive or destructive action button
            const confirmBtn = buttons.find(
              (b) => b.style === 'destructive' || b.text === 'Delete' || b.text === 'Sign Out' || b.text === 'OK' || b.text === 'Awesome' || b.text === 'Delete'
            ) || buttons.find((b) => b.style !== 'cancel') || buttons[0];

            if (confirmBtn && confirmBtn.onPress) {
              confirmBtn.onPress();
            }
          } else {
            // Find cancel button and trigger it
            const cancelBtn = buttons.find((b) => b.style === 'cancel');
            if (cancelBtn && cancelBtn.onPress) {
              cancelBtn.onPress();
            }
          }
        } else {
          // Regular alert but has action callbacks
          window.alert(fullMessage);
          const firstActionBtn = buttons.find((b) => b.style !== 'cancel') || buttons[0];
          if (firstActionBtn && firstActionBtn.onPress) {
            firstActionBtn.onPress();
          }
        }
      } else {
        // Simple alert with no buttons
        window.alert(fullMessage);
      }
    } else {
      // On native mobile platforms, use standard React Native Alert
      RNAlert.alert(title, message, buttons, options);
    }
  },
};
export default Alert;
