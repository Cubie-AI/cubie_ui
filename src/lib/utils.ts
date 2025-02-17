import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sendRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ error: string; data: T | null }> {
  let result = { error: "", data: null };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      result.data = data;
    } else {
      console.log("Request failed", data);
      result.error = data?.error || "An unknown error occurred";
    }
    console.log("Request successful", data);
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "An unknown error occurred";
  }
  return result as { error: string; data: T | null };
}
