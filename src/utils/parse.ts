export function getStartOfMonth(distance: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - distance);
  return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${1}`);
}

export function getStartOfDay(distance: number) {
  const date = new Date();
  date.setDate(date.getDate() - distance);
  return new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  );
}
