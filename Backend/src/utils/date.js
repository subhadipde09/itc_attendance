const toDateKey = (date = new Date()) => new Date(date).toISOString().slice(0, 10);

const currentShift = (date = new Date()) => {
  const ist = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hour = ist.getHours();
  if (hour >= 6 && hour < 14) return 'Morning';
  if (hour >= 14 && hour < 22) return 'Evening';
  return 'Night';
};

const dayName = (date = new Date()) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' });

module.exports = { toDateKey, currentShift, dayName };
