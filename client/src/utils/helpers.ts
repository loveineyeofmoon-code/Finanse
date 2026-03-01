export function getPriorityText(priority: string) {
  switch (priority) {
    case 'low':
      return 'Низкий';
    case 'medium':
      return 'Средний';
    case 'high':
      return 'Высокий';
    default:
      return 'Неизвестно';
  }
}
