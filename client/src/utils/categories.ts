export type Category = {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'debt_income' | 'debt_expense' | 'both';
  icon: string;
  color: string;
};

export const categories: Category[] = [
  { id: 1, name: 'Зарплата', type: 'income', icon: '💼', color: '#48bb78' },
  { id: 2, name: 'Фриланс', type: 'income', icon: '💻', color: '#4299e1' },
  { id: 3, name: 'Инвестиции', type: 'income', icon: '📈', color: '#ed8936' },
  { id: 4, name: 'Подарки', type: 'income', icon: '🎁', color: '#ed64a6' },
  { id: 5, name: 'Возврат долга', type: 'income', icon: '↩️', color: '#9f7aea' },
  { id: 6, name: 'Продукты', type: 'expense', icon: '🛒', color: '#48bb78' },
  { id: 7, name: 'Транспорт', type: 'expense', icon: '🚗', color: '#4299e1' },
  { id: 8, name: 'Жилье', type: 'expense', icon: '🏠', color: '#ed8936' },
  { id: 9, name: 'Коммуналка', type: 'expense', icon: '💡', color: '#f56565' },
  { id: 10, name: 'Связь', type: 'expense', icon: '📱', color: '#9f7aea' },
  { id: 11, name: 'Рестораны', type: 'expense', icon: '🍽️', color: '#ed64a6' },
  { id: 12, name: 'Развлечения', type: 'expense', icon: '🎬', color: '#805ad5' },
  { id: 13, name: 'Хобби', type: 'expense', icon: '🎨', color: '#38b2ac' },
  { id: 14, name: 'Путешествия', type: 'expense', icon: '✈️', color: '#e53e3e' },
  { id: 15, name: 'Здоровье', type: 'expense', icon: '🏥', color: '#48bb78' },
  { id: 16, name: 'Спорт', type: 'expense', icon: '💪', color: '#4299e1' },
  { id: 17, name: 'Красота', type: 'expense', icon: '💄', color: '#ed64a6' },
  { id: 18, name: 'Образование', type: 'expense', icon: '📚', color: '#ed8936' },
  { id: 19, name: 'Курсы', type: 'expense', icon: '🎓', color: '#9f7aea' },
  { id: 20, name: 'Мне должны', type: 'debt_income', icon: '📥', color: '#48bb78' },
  { id: 21, name: 'Я должен', type: 'debt_expense', icon: '📤', color: '#f56565' },
  { id: 22, name: 'Одежда', type: 'expense', icon: '👕', color: '#a0aec0' },
  { id: 23, name: 'Техника', type: 'expense', icon: '💻', color: '#718096' },
  { id: 24, name: 'Подарки', type: 'expense', icon: '🎁', color: '#ed64a6' },
  { id: 25, name: 'Другое', type: 'both', icon: '📦', color: '#a0aec0' }
];
