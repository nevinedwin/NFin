import { format as dfFormat, parseISO, isValid } from 'date-fns';

export type DateInput = string | number | Date | null | undefined;

export const DEFAULT_FORMAT = 'yyyy-MM-dd HH:mm:ssxxx';

export function toDate(input: DateInput): Date | null {
  if (input == null) return null;
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  if (typeof input === 'string') {
    // Try ISO first
    try {
      const d = parseISO(input);
      if (isValid(d)) return d;
    } catch {}

    const d2 = new Date(input);
    return isValid(d2) ? d2 : null;
  }
  return null;
}

export function formatDate(input: DateInput, fmt = DEFAULT_FORMAT): string {
  const d = toDate(input);
  if (!d) return '';
  try {
    return dfFormat(d, fmt);
  } catch {
    return d.toString();
  }
}

export function formatTime(input: DateInput): string {
  const d = toDate(input);
  if (!d) return '';
  try {
    return dfFormat(d, 'h:mm a');
  } catch {
    return dfFormat(d, 'h:mm a');
  }
}

export function formatDateShort(input: DateInput): string {
  const d = toDate(input);
  if (!d) return '';
  try {
    return dfFormat(d, 'dd MMM yyyy');
  } catch {
    return dfFormat(d, 'dd MMM yyyy');
  }
}

export function toISOStringUTC(input: DateInput): string | null {
  const d = toDate(input);
  return d ? d.toISOString() : null;
}

export default {
  toDate,
  formatDate,
  formatTime,
  formatDateShort,
  toISOStringUTC,
};
