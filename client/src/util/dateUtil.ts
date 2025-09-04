export function formatDate(date: string) {
  const dateObj = new Date(date);
  const currentYear = new Date().getFullYear();
  const dateYear = dateObj.getFullYear();
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(dateYear !== currentYear && { year: 'numeric' }),
  });
}
