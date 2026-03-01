import { useState, useEffect } from 'react';
import { Debt } from '../types';
import { subscribeDebts, addDebt, deleteDebt } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeDebts(user.uid, setDebts);
    return unsub;
  }, [user]);

  const create = async (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('not_logged_in');
    await addDebt(user.uid, debt);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('not_logged_in');
    await deleteDebt(user.uid, id);
  };

  return { debts, create, remove };
}
