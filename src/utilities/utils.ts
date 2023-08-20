export function isAValidUsername(string: string): boolean {
  return string.length >= 2 && string.length <= 15;
}
