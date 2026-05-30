import { Category, Transaction, UserProfile, Account } from '../types';

export const DEFAULT_USER: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'AX',
  isPremium: true,
  totalTransactions: 248,
  totalSavings: 4200.00,
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'restaurant-outline', color: '#10B981' },
  { id: '2', name: 'Transport', icon: 'car-outline', color: '#3B82F6' },
  { id: '3', name: 'Shopping', icon: 'bag-handle-outline', color: '#EC4899' },
  { id: '4', name: 'Health', icon: 'heart-outline', color: '#EF4444' },
  { id: '5', name: 'Fun', icon: 'happy-outline', color: '#F59E0B' },
  { id: '6', name: 'Income', icon: 'wallet-outline', color: '#10B981' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Main Account', balance: 12480.50 },
  { id: 'a2', name: 'Savings Account', balance: 4200.00 },
];

// Seed transactions to exactly match the mockups
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: 'Grocery Store',
    amount: 1240.00,
    type: 'expense',
    category: 'Shopping',
    date: new Date(2026, 5, 31, 14, 30).toISOString(), // May 31, 2026 2:30 PM (Today)
    notes: 'Weekly fresh vegetables and pantry stock',
    account: 'Main Account',
  },
  {
    id: 't2',
    title: 'Starbucks',
    amount: 5.40,
    type: 'expense',
    category: 'Food',
    date: new Date(2026, 5, 31, 10, 15).toISOString(), // May 31, 2026 10:15 AM (Today)
    notes: 'Morning iced macchiato',
    account: 'Main Account',
  },
  {
    id: 't3',
    title: 'Amazon',
    amount: 34.99,
    type: 'expense',
    category: 'Shopping',
    date: new Date(2026, 5, 31, 11, 20).toISOString(), // May 31, 2026 11:20 AM (Today)
    notes: 'Mechanical keyboard keys switches',
    account: 'Main Account',
  },
  {
    id: 't4',
    title: 'Salary Deposit',
    amount: 3200.00,
    type: 'income',
    category: 'Income',
    date: new Date(2026, 5, 30, 9, 0).toISOString(), // May 30, 2026 9:00 AM (Yesterday)
    notes: 'Freelance design layout gig milestone',
    account: 'Main Account',
  },
  {
    id: 't5',
    title: 'Netflix',
    amount: 15.99,
    type: 'expense',
    category: 'Fun',
    date: new Date(2026, 5, 30, 20, 0).toISOString(), // May 30, 2026 8:00 PM (Yesterday)
    notes: 'Monthly standard subscription plans',
    account: 'Main Account',
  },
  {
    id: 't6',
    title: 'Uber Ride',
    amount: 12.50,
    type: 'expense',
    category: 'Transport',
    date: new Date(2026, 5, 29, 15, 45).toISOString(), // May 29, 2026 3:45 PM
    notes: 'Commute to co-working space',
    account: 'Main Account',
  },
];
