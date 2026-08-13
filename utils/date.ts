export function dateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(key: string, amount: number): string {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

export function lastNDays(n: number, end = new Date()): string[] {
  return Array.from({ length: n }, (_, index) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - index));
    return dateKey(d);
  });
}

export function formatShortDate(key: string): string {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
