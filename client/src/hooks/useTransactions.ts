import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { subscribeTransactions, addTransaction, deleteTransaction } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeTransactions(user.uid, setTransactions);
    return unsub;
  }, [user]);

  const create = async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('not_logged_in');
    await addTransaction(user.uid, tx);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('not_logged_in');
    await deleteTransaction(user.uid, id);
  };

  return { transactions, create, remove };
}
