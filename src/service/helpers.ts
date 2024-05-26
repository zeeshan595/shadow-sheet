export function stringToNum(str: string): number {
  try {
    const num = Number.parseInt(str);
    if (isNaN(num)) return 0;
    if (num === undefined || num === null) return 0;
    return num;
  } catch (e) {}
  return 0;
}
