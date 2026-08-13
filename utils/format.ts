export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatKm(value: number): string {
  return `${value.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remaining = mins % 60;
  return hrs > 0 ? `${hrs}h ${remaining}m` : `${mins}m`;
}

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
