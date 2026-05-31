export const todayKey = () => new Date().toISOString().slice(0, 10);

export const formatIST = (date = new Date()) =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
