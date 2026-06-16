type QueueItem = Record<string, unknown> & { created_at: string };

function readQueue(key: string): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as QueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(key: string, items: QueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function queueLocalAppointment(payload: Record<string, unknown>) {
  const key = "multicut.pending_appointments";
  const items = readQueue(key);
  items.unshift({ ...payload, created_at: new Date().toISOString() });
  writeQueue(key, items.slice(0, 100));
}

export function queueLocalContact(payload: Record<string, unknown>) {
  const key = "multicut.pending_contacts";
  const items = readQueue(key);
  items.unshift({ ...payload, created_at: new Date().toISOString() });
  writeQueue(key, items.slice(0, 100));
}

export function isMissingTableError(error: unknown) {
  const message = typeof error === "string"
    ? error
    : error && typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string"
      ? (error as { message: string }).message
      : error instanceof Error
        ? error.message
        : "";
  return /schema cache|Could not find the table|relation .* does not exist|table .* not found/i.test(message);
}
