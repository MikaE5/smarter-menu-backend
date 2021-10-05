export const isThisWeek = (today: Date, compareDate: Date): boolean => {
  const sundayThisWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 7)
  );

  const sundayMilliseconds = sundayThisWeek.getTime();
  const compareMilliseconds = compareDate.getTime();

  return (
    0 <= sundayMilliseconds - compareMilliseconds &&
    sundayMilliseconds - compareMilliseconds < 7 * 24 * 60 * 60 * 1000
  );
};

export const isThisMonth = (today: Date, compareDate: Date): boolean => {
  return (
    today.getFullYear() === compareDate.getFullYear() &&
    today.getMonth() === compareDate.getMonth()
  );
};

export const isToday = (today: Date, compareDate: Date): boolean => {
  return (
    isThisMonth(today, compareDate) && today.getDate() === compareDate.getDate()
  );
};
