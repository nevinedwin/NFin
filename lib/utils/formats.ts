import { AccountType } from "@/generated/prisma/client";
import { format, parseISO, parse } from "date-fns";

export const formatUnderScoredString = (str: string) => {
  const formatted = str.replace(/_/g, " ");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}


export const formatUnderScoredStringCut = (str: string) => {
  const formatted = str.split("_")[0];
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}


export const formDataConverter = (formData: FormData) => {
  return Object.fromEntries(formData.entries());
};


export const formatDateTime = (date: Date | string | null | undefined) => {
  if (!date) return "";

  let d: Date;

  if (typeof date === "string") {
    d = date.includes("/")
      ? parse(date, "d/M/yyyy, h:mm:s a", new Date())
      : parseISO(date);
  } else {
    d = date;
  }

  if (isNaN(d.getTime())) return "";

  return format(d, "h:mm a, do MMM yyyy");
};

export const formatTimeDate = (date: Date) =>
  format(date, "h:mm a, do MMM");

export function serializeDecimal<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const formatType = (type: AccountType) => {
  switch (type) {
    case AccountType.BANK: return "Bank Accounts";
    case AccountType.CREDIT_CARD: return "Credit Cards";
    case AccountType.CASH: return "Cash in Hand";
    case AccountType.WALLET: return "Wallet";
    default: return type;
  }
};

export const ORDER_MAP: Record<AccountType, number> = {
  BANK: 0,
  CREDIT_CARD: 1,
  WALLET: 2,
  CASH: 3
};
export const balanceFormating = (value: number): [string, string] => {
  const formatted = Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [int, dec] = formatted.split(".");
  return [int, dec];
};


export const formatDate = (date: Date) => {
  return date.toDateString().split("T")[0];
};


export const formateUTCDate = (date: Date) => {
  return date.toISOString();
}

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

export function getMonthRangeUTC(date = new Date()) {
  const startLocal = new Date(date.getFullYear(), date.getMonth(), 1);
  const endLocal = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return {
    startUTC: new Date(startLocal.getTime() - IST_OFFSET),
    endUTC: new Date(endLocal.getTime() - IST_OFFSET),
  };
}

export const getIndianDateTime = (date: Date) => {
  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });
}

export const getIndianDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Get an IST "wall clock" date object (use UTC methods on it)
export function toISTDate(utcMs: number): Date {
  return new Date(utcMs + IST_OFFSET_MS);
}

// Format as YYYY-MM-DD using IST wall clock
export function formatDateIST(date: Date): string {
  // date here should already be IST-shifted (use UTC getters)
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}