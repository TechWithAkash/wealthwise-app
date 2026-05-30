export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  totalTransactions: number;
  totalSavings: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string; // References Category.name
  date: string;     // ISO String date
  notes?: string;
  account: string;  // References Account.name
}

export interface AppContextType {
  user: UserProfile | null;
  loading: boolean;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  currency: string;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateCurrency: (symbol: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  registerUser: (
    name: string,
    email: string,
    startingMain: number,
    startingSavings: number,
    currency: string
  ) => void;
  signOut: () => void;
}
