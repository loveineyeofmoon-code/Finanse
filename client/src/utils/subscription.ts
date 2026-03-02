import { UserData } from '../hooks/useUserData';

export interface SubscriptionLimits {
  maxTransactions: number;
  maxTasks: number;
  maxGoals: number;
  maxDebts: number;
  canUseAnalytics: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    maxTransactions: Infinity,
    maxTasks: Infinity,
    maxGoals: Infinity,
    maxDebts: Infinity,
    canUseAnalytics: false
  },
  trial: {
    maxTransactions: 999,
    maxTasks: 999,
    maxGoals: 999,
    maxDebts: 999,
    canUseAnalytics: true
  },
  premium: {
    maxTransactions: 999,
    maxTasks: 999,
    maxGoals: 999,
    maxDebts: 999,
    canUseAnalytics: true
  }
};

/**
 * Получить тип подписки пользователя (обработка истечения trial)
 */
export function getActiveSubscriptionType(userData: UserData | null): 'free' | 'trial' | 'premium' {
  if (!userData) return 'free';
  
  // Если премиум активна
  if (userData.subscription === 'premium' && userData.subscriptionActive) {
    return 'premium';
  }
  
  // Если тестовая подписка
  if (userData.subscription === 'trial' && userData.trialEndDate) {
    const now = new Date();
    const end = new Date(userData.trialEndDate);
    if (now < end) {
      return 'trial';
    }
  }
  
  // Если премиум истекла
  if (userData.subscription === 'premium' && userData.subscriptionEndDate) {
    const now = new Date();
    const end = new Date(userData.subscriptionEndDate);
    if (now > end) {
      return 'free';
    }
    return 'premium';
  }
  
  return 'free';
}

/**
 * Получить лимиты для текущей подписки
 */
export function getLimits(userData: UserData | null): SubscriptionLimits {
  const subscriptionType = getActiveSubscriptionType(userData);
  return SUBSCRIPTION_LIMITS[subscriptionType];
}

/**
 * Проверить достигнут ли лимит
 */
export function isLimitReached(
  currentCount: number,
  userData: UserData | null,
  featureType: 'transactions' | 'tasks' | 'goals' | 'debts'
): boolean {
  const limits = getLimits(userData);
  
  switch (featureType) {
    case 'transactions':
      return currentCount >= limits.maxTransactions;
    case 'tasks':
      return currentCount >= limits.maxTasks;
    case 'goals':
      return currentCount >= limits.maxGoals;
    case 'debts':
      return currentCount >= limits.maxDebts;
    default:
      return false;
  }
}

/**
 * Получить информацию о лимите для вывода пользователю
 */
export function getLimitInfo(userData: UserData | null, currentCount: number, featureType: 'transactions' | 'tasks' | 'goals' | 'debts'): string {
  const subscriptionType = getActiveSubscriptionType(userData);
  const limits = getLimits(userData);
  
  if (subscriptionType === 'premium') {
    return 'Безлимитно';
  }
  
  if (subscriptionType === 'trial') {
    const trialEndDate = userData?.trialEndDate;
    if (trialEndDate) {
      const now = new Date();
      const end = new Date(trialEndDate);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Пробный период: ${daysLeft} дней осталось (безлимитно)`;
    }
    return 'Безлимитно';
  }
  
  // free
  let limit = 0;
  switch (featureType) {
    case 'transactions':
      limit = limits.maxTransactions;
      break;
    case 'tasks':
      limit = limits.maxTasks;
      break;
    case 'goals':
      limit = limits.maxGoals;
      break;
    case 'debts':
      limit = limits.maxDebts;
      break;
  }
  
  return `${currentCount}/${limit} (обновите до Премиум)`;
}

/**
 * Получить сообщение об ошибке при превышении лимита
 */
export function getLimitErrorMessage(featureType: 'transactions' | 'tasks' | 'goals' | 'debts'): string {
  const messages: Record<string, string> = {
    transactions: 'Достигнут лимит транзакций. Обновитесь до Премиум для безлимитного доступа.',
    tasks: 'Достигнут лимит задач. Обновитесь до Премиум для безлимитного доступа.',
    goals: 'Достигнут лимит целей. Обновитесь до Премиум для безлимитного доступа.',
    debts: 'Достигнут лимит записей о долгах. Обновитесь до Премиум для безлимитного доступа.'
  };
  return messages[featureType] || 'Достигнут лимит. Обновитесь до Премиум.';
}
