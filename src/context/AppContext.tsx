import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppContextType, Transaction, UserProfile, Category, Account } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  USER: '@wealthwise_user',
  TRANSACTIONS: '@wealthwise_transactions',
  ACCOUNTS: '@wealthwise_accounts',
  CURRENCY: '@wealthwise_currency',
};

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);

  // Load persisted session on app launch
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedUser, storedTx, storedAccounts, storedCurrency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
          AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS),
          AsyncStorage.getItem(STORAGE_KEYS.CURRENCY),
        ]);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedTx) {
          setTransactions(JSON.parse(storedTx));
        }
        if (storedAccounts) {
          setAccounts(JSON.parse(storedAccounts));
        }
        if (storedCurrency) {
          setCurrency(storedCurrency);
        }
      } catch (err) {
        console.error('WealthWise Session Restoration Error:', err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const registerUser = async (
    name: string,
    email: string,
    startingMain: number,
    startingSavings: number,
    startingCurrency: string
  ) => {
    // Generate initials for avatar
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUserProfile: UserProfile = {
      name,
      email,
      avatar: initials.length > 0 ? initials : 'WW',
      isPremium: true, // Gift every registered user premium status by default!
      totalTransactions: 0,
      totalSavings: startingSavings,
    };

    const newAccountsList: Account[] = [
      { id: 'a1', name: 'Main Account', balance: startingMain },
      { id: 'a2', name: 'Savings Account', balance: startingSavings },
    ];

    setUser(newUserProfile);
    setAccounts(newAccountsList);
    setTransactions([]);
    setCurrency(startingCurrency);

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUserProfile)),
        AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(newAccountsList)),
        AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([])),
        AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, startingCurrency),
      ]);
    } catch (err) {
      console.error('WealthWise Registration Save Error:', err);
    }
  };

  const addTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);

    const updatedAccounts = accounts.map((acc) => {
      if (acc.name === newTx.account) {
        const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
        return { ...acc, balance: Number((acc.balance + delta).toFixed(2)) };
      }
      return acc;
    });
    setAccounts(updatedAccounts);

    let updatedSavings = user ? user.totalSavings : 0;
    if (newTx.type === 'income' && newTx.account === 'Savings Account') {
      updatedSavings += newTx.amount;
    }

    const updatedUserProfile = user
      ? {
          ...user,
          totalTransactions: user.totalTransactions + 1,
          totalSavings: Number(updatedSavings.toFixed(2)),
        }
      : null;
    setUser(updatedUserProfile);

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTxList)),
        AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts)),
        updatedUserProfile
          ? AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUserProfile))
          : Promise.resolve(),
      ]);
    } catch (err) {
      console.error('WealthWise Add Transaction Save Error:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    const txToDelete = transactions.find((tx) => tx.id === id);
    if (!txToDelete) return;

    const updatedTxList = transactions.filter((tx) => tx.id !== id);
    setTransactions(updatedTxList);

    const updatedAccounts = accounts.map((acc) => {
      if (acc.name === txToDelete.account) {
        const delta = txToDelete.type === 'income' ? -txToDelete.amount : txToDelete.amount;
        return { ...acc, balance: Number((acc.balance + delta).toFixed(2)) };
      }
      return acc;
    });
    setAccounts(updatedAccounts);

    let updatedSavings = user ? user.totalSavings : 0;
    if (txToDelete.type === 'income' && txToDelete.account === 'Savings Account') {
      updatedSavings -= txToDelete.amount;
    }

    const updatedUserProfile = user
      ? {
          ...user,
          totalTransactions: Math.max(0, user.totalTransactions - 1),
          totalSavings: Number(Math.max(0, updatedSavings).toFixed(2)),
        }
      : null;
    setUser(updatedUserProfile);

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTxList)),
        AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts)),
        updatedUserProfile
          ? AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUserProfile))
          : Promise.resolve(),
      ]);
    } catch (err) {
      console.error('WealthWise Delete Transaction Save Error:', err);
    }
  };

  const updateCurrency = async (symbol: string) => {
    setCurrency(symbol);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, symbol);
    } catch (err) {
      console.error('WealthWise Currency Save Error:', err);
    }
  };

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUserProfile = { ...user, ...profileUpdate };
    setUser(updatedUserProfile);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUserProfile));
    } catch (err) {
      console.error('WealthWise Profile Update Save Error:', err);
    }
  };

  const signOut = async () => {
    setUser(null);
    setTransactions([]);
    setAccounts([]);
    setCurrency('INR');

    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.ACCOUNTS,
        STORAGE_KEYS.CURRENCY,
      ]);
    } catch (err) {
      console.error('WealthWise Clear Session Save Error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        transactions,
        categories,
        accounts,
        currency,
        addTransaction,
        deleteTransaction,
        updateCurrency,
        updateUserProfile,
        registerUser,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
