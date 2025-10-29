import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour combiner les classes Tailwind CSS
 * Utilise clsx pour gérer les classes conditionnelles et twMerge pour résoudre les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

