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