import { useState, useEffect } from 'react';
import { Task } from '../types';
import { subscribeTasks, addTask, updateTask, deleteTask } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeTasks(user.uid, setTasks);
    return unsub;
  }, [user]);

  const create = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('not_logged_in');
    await addTask(user.uid, task);
  };

  const toggle = async (id: string, completed: boolean) => {
    if (!user) throw new Error('not_logged_in');
    await updateTask(user.uid, id, { completed });
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('not_logged_in');
    await deleteTask(user.uid, id);
  };

  return { tasks, create, toggle, remove };
}
