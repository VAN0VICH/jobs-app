export function formatDateToMinsk(dateString: Date | string): string {
  const date = new Date(dateString);
  // Define the options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Europe/Minsk',
  };

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}
