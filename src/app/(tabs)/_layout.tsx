import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Text } from '../../components/ui/Text';
import { BorderRadius, Spacing } from '../../constants/theme';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../../context/AppContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { user, loading } = useAppState();
  const insets = useSafeAreaInsets();

  // Route protection: Guard tabs from unauthenticated users
  if (!loading && !user) {
    return <Redirect href="/register" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const { state, descriptors, navigation } = props;

        return (
          <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
            <SafeAreaView edges={['bottom']} style={styles.safeArea}>
              <View style={styles.tabBarRow}>
                {state.routes.map((route, index) => {
                  const { options } = descriptors[route.key];
                  const isFocused = state.index === index;

                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name, route.params);
                    }
                  };

                  const onLongPress = () => {
                    navigation.emit({
                      type: 'tabLongPress',
                      target: route.key,
                    });
                  };

                  // Map route name to icons and labels
                  let iconName: any = 'home-outline';
                  let activeIconName: any = 'home';
                  let label = 'Home';

                  if (route.name === 'index') {
                    iconName = 'home-outline';
                    activeIconName = 'home';
                    label = 'Home';
                  } else if (route.name === 'transactions') {
                    iconName = 'swap-horizontal-outline';
                    activeIconName = 'swap-horizontal';
                    label = 'Transactions';
                  } else if (route.name === 'add') {
                    iconName = 'add-outline';
                    activeIconName = 'add';
                    label = 'Add';
                  } else if (route.name === 'profile') {
                    iconName = 'person-outline';
                    activeIconName = 'person';
                    label = 'Profile';
                  }

                  return (
                    <TouchableOpacity
                      key={route.key}
                      accessibilityState={isFocused ? { selected: true } : {}}
                      accessibilityLabel={options.tabBarAccessibilityLabel}
                      testID={options.tabBarButtonTestID}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      activeOpacity={0.85}
                      style={styles.tabButton}
                    >
                      {isFocused ? (
                        <View style={styles.activeCircle}>
                          <Ionicons name={activeIconName} size={26} color="#FFFFFF" />
                        </View>
                      ) : (
                        <View style={styles.inactiveContainer}>
                          <Ionicons name={iconName} size={24} color={Colors.light.tabInactive} />
                          <Text style={styles.inactiveLabel}>
                            {label}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SafeAreaView>
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="add" options={{ title: 'Add' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Colors.light.tabBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.light.cardBorder,
    paddingTop: Spacing.sm,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  safeArea: {
    width: '100%',
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeCircle: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.tabActive,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.tabActive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inactiveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  inactiveLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.light.tabInactive,
  },
});
