import { useState, useEffect } from 'react';
import { Goal } from '../types';
import { subscribeGoals, addGoal, updateGoal, deleteGoal } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeGoals(user.uid, setGoals);
    return unsub;
  }, [user]);

  const create = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('not_logged_in');
    await addGoal(user.uid, goal);
  };

  const update = async (id: string, data: Partial<Goal>) => {
    if (!user) throw new Error('not_logged_in');
    await updateGoal(user.uid, id, data);
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('not_logged_in');
    await deleteGoal(user.uid, id);
  };

  return { goals, create, update, remove };
}
