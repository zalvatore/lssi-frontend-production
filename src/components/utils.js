export const formatNumber = (number) => {
  return number?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function formatDate(dateStr) {
  const [month, day, year] = dateStr.split('/');
  const formattedYear = parseInt(year, 10) < 100 ? `20${year}` : year;
  const date = new Date(`${formattedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`);
  return date.toISOString();
}
