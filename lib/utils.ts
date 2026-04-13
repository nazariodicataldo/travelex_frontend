import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionExpiredError } from "./backend";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof SessionExpiredError
    ? error.message
    : error instanceof Error
      ? error.message
      : fallbackMessage;
}
