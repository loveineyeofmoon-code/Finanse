/**
 * Вычисляет количество дней подряд, в которые пользователь вёл учёт (есть хотя бы одна транзакция).
 * Streak считается от сегодня (или вчера, если сегодня ещё не было записей) назад.
 */
export function getTrackingStreak(transactionDates: string[]): number {
  if (transactionDates.length === 0) return 0;

  const dateSet = new Set(
    transactionDates
      .map(d => {
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
      })
      .filter(Boolean)
  );

  if (dateSet.size === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let startDate: Date;
  if (dateSet.has(todayStr)) {
    startDate = new Date(today);
  } else if (dateSet.has(yesterdayStr)) {
    startDate = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;
  let check = new Date(startDate);
  check.setHours(0, 0, 0, 0);

  while (dateSet.has(check.toISOString().split('T')[0])) {
    streak++;
    check.setDate(check.getDate() - 1);
  }

  return streak;
}
