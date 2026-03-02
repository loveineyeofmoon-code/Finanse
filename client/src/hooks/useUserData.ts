import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { checkAndUpdateTrialStatus } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export interface UserData {
  uid: string;
  name?: string;
  email?: string;
  subscription?: string;
  subscriptionActive?: boolean;
  trialEndDate?: string;
  subscriptionEndDate?: string;
  [key: string]: any;
}

export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }

    // Проверяем trial/premium статус при загрузке
    checkAndUpdateTrialStatus(user.uid).catch(console.error);

    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData({ ...(snap.data() as UserData), uid: user.uid });
      } else {
        setData(null);
      }
    });
    return unsub;
  }, [user]);

  return data;
}
