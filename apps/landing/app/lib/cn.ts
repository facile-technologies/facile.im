/**
 * Minimal className combiner — joins truthy values with a space.
 * Kept dependency-free; later classes win by source order, so order intentionally.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
