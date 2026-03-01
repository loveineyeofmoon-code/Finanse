export function formatDate(dateInput?: any): string {
  if (!dateInput) return 'Не указана';
  
  let dateObj: Date;
  
  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
  } else if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    // Firestore Timestamp object with toDate method
    dateObj = dateInput.toDate();
  } else if (dateInput.seconds && dateInput.nanoseconds) {
    // Firestore Timestamp object (plain object with seconds and nanoseconds)
    dateObj = new Date(dateInput.seconds * 1000 + Math.floor(dateInput.nanoseconds / 1000000));
  } else if (typeof dateInput === 'number') {
    dateObj = new Date(dateInput);
  } else {
    // Fallback: try to parse as Date
    dateObj = new Date(dateInput);
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }
  
  return dateObj.toLocaleDateString('ru-RU');
}

export function formatCurrency(amount: number) {
  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' ₽'
  );
}
