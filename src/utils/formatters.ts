export function formatTime(date: Date): string {
  const h = date.getHours();
  const hour = h % 12 === 0 ? 12 : h % 12;
  const minute = date.getMinutes().toString().padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${hour}:${minute} ${suffix}`;
}
