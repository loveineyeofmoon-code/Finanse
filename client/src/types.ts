// shared data types

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: number;
  description?: string;
  date: string;
  createdAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt?: Date;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  createdAt?: Date;
}

export interface Debt {
  id: string;
  type: 'debt_income' | 'debt_expense';
  amount: number;
  person: string;
  description?: string;
  dueDate?: string;
  createdAt?: Date;
}

export interface Card {
  id: string;
  last4: string;
  expiry: string;
  holder: string;
  addedAt?: Date;
}

export interface Payment {
  id: string;
  userId: string;
  paymentId: string; // ЮКасса payment ID
  amount: number;
  currency: string;
  description: string;
  status: string; // 'succeeded' | 'pending' | 'failed'
  userEmail: string;
  orderId: string;
  product: string;
  createdAt?: Date;
  confirmedAt?: Date | null;
}
