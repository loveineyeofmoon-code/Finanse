import { db } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  Unsubscribe,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { Transaction, Task, Goal, Debt, Card } from '../types';

// common helper to build queries for a user
function userCollectionPath<T>(name: string, userId: string) {
  return collection(db, name);
}

export async function createUserDocument(userId: string, email: string, name?: string) {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  await setDoc(doc(db, 'users', userId), {
    email,
    name: name || email?.split('@')[0] || 'Пользователь',
    createdAt: serverTimestamp(),
    emailVerified: false,
    trialEndDate: trialEnd.toISOString().split('T')[0],
    subscription: 'free',
    subscriptionActive: false
  }, { merge: true });
}

// set verification code for a user (expires in `ttlSeconds` seconds)
export async function setVerificationCode(userId: string, code: string, ttlSeconds = 60 * 60) {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await setDoc(doc(db, 'users', userId), {
    verificationCode: code,
    verificationExpiresAt: expiresAt,
    emailVerified: false
  }, { merge: true });
}

// verify the code; returns true if successful and marks emailVerified=true
export async function verifyVerificationCode(userId: string, code: string) {
  const ref = doc(db, 'users', userId);
  const snap = await (await import('firebase/firestore')).getDoc(ref);
  if (!snap.exists()) throw new Error('Пользователь не найден');
  const data = snap.data() as any;
  if (!data.verificationCode) throw new Error('Код не найден');
  const now = new Date();
  const expires = data.verificationExpiresAt ? new Date(data.verificationExpiresAt) : null;
  if (expires && now > expires) {
    throw new Error('Код истёк');
  }
  if (String(data.verificationCode) !== String(code)) {
    throw new Error('Неверный код');
  }
  // mark verified and remove code fields
  await setDoc(ref, { emailVerified: true, verificationCode: null, verificationExpiresAt: null }, { merge: true });
  return true;
}

// Helper function to safely convert Firestore timestamps to Date
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp.seconds && timestamp.nanoseconds) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date(timestamp);
};

// Helper to convert Firestore timestamp to date string (YYYY-MM-DD)
const convertToDateString = (value: any): string => {
  if (!value) return '';
  let date: Date;
  if (value.toDate && typeof value.toDate === 'function') {
    date = value.toDate();
  } else if (value.seconds && value.nanoseconds) {
    date = new Timestamp(value.seconds, value.nanoseconds).toDate();
  } else if (typeof value === 'string') {
    // If it's already a string, try to parse to ensure correct format
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return value.split('T')[0]; // Return only date part if ISO string
    }
    return value;
  } else if (value instanceof Date) {
    date = value;
  } else {
    // Try to parse as date anyway
    date = new Date(value);
  }
  if (isNaN(date.getTime())) {
    console.warn('Invalid date value:', value);
    return '';
  }
  return date.toISOString().split('T')[0];
};

// transactions
export function subscribeTransactions(userId: string, callback: (items: Transaction[]) => void): Unsubscribe {
  const q = query(
    userCollectionPath('transactions', userId),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          ...data,
          date: convertToDateString(data.date),
          createdAt: convertTimestamp(data.createdAt)
        });
      });
      callback(list);
    },
    (error) => {
      console.error('Error fetching transactions:', error);
      callback([]);
    }
  );
}

export async function addTransaction(userId: string, tx: Omit<Transaction, 'id' | 'createdAt'>) {
  const docRef = await addDoc(userCollectionPath('transactions', userId), {
    ...tx,
    userId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteTransaction(userId: string, txId: string) {
  await deleteDoc(doc(db, 'transactions', txId));
}

// tasks
export function subscribeTasks(userId: string, callback: (items: Task[]) => void): Unsubscribe {
  const q = query(
    userCollectionPath('tasks', userId),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Task[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          ...data,
          dueDate: data.dueDate ? convertToDateString(data.dueDate) : undefined,
          createdAt: convertTimestamp(data.createdAt)
        });
      });
      callback(list);
    },
    (error) => {
      console.error('Error fetching tasks:', error);
      callback([]);
    }
  );
}

export async function addTask(userId: string, task: Omit<Task, 'id' | 'createdAt'>) {
  const docRef = await addDoc(userCollectionPath('tasks', userId), {
    ...task,
    userId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateTask(userId: string, taskId: string, data: Partial<Task>) {
  await updateDoc(doc(db, 'tasks', taskId), data);
}

export async function deleteTask(userId: string, taskId: string) {
  await deleteDoc(doc(db, 'tasks', taskId));
}

// goals
export function subscribeGoals(userId: string, callback: (items: Goal[]) => void): Unsubscribe {
  const q = query(
    userCollectionPath('goals', userId),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Goal[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          ...data,
          targetDate: convertToDateString(data.targetDate),
          createdAt: convertTimestamp(data.createdAt)
        });
      });
      callback(list);
    },
    (error) => {
      console.error('Error fetching goals:', error);
      callback([]);
    }
  );
}

export async function addGoal(userId: string, goal: Omit<Goal, 'id' | 'createdAt'>) {
  const docRef = await addDoc(userCollectionPath('goals', userId), {
    ...goal,
    userId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateGoal(userId: string, goalId: string, data: Partial<Goal>) {
  await updateDoc(doc(db, 'goals', goalId), data);
}

export async function deleteGoal(userId: string, goalId: string) {
  await deleteDoc(doc(db, 'goals', goalId));
}

// debts
export function subscribeDebts(userId: string, callback: (items: Debt[]) => void): Unsubscribe {
  const q = query(
    userCollectionPath('debts', userId),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Debt[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          ...data,
          dueDate: data.dueDate ? convertToDateString(data.dueDate) : undefined,
          createdAt: convertTimestamp(data.createdAt)
        });
      });
      callback(list);
    },
    (error) => {
      console.error('Error fetching debts:', error);
      callback([]);
    }
  );
}

export async function addDebt(userId: string, debt: Omit<Debt, 'id' | 'createdAt'>) {
  const docRef = await addDoc(userCollectionPath('debts', userId), {
    ...debt,
    userId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteDebt(userId: string, debtId: string) {
  await deleteDoc(doc(db, 'debts', debtId));
}

// cards
export function subscribeCards(userId: string, callback: (items: Card[]) => void): Unsubscribe {
  const q = query(
    userCollectionPath('cards', userId),
    where('userId', '==', userId),
    orderBy('addedAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Card[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        list.push({
          id: docSnap.id,
          ...data
        });
      });
      callback(list);
    },
    (error) => {
      console.error('Error fetching cards:', error);
      callback([]);
    }
  );
}

export async function addCard(userId: string, card: Omit<Card, 'id'>) {
  const docRef = await addDoc(userCollectionPath('cards', userId), {
    ...card,
    userId,
    addedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteCard(userId: string, cardId: string) {
  await deleteDoc(doc(db, 'cards', cardId));
}
// delete user's main document (does not attempt to cascade-delete subcollections)
export async function deleteUserDocument(userId: string) {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (err) {
    console.warn('Failed to delete user document', err);
    throw err;
  }

}
