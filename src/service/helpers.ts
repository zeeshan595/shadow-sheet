export function stringToNum(str: string): number {
  try {
    const num = Number.parseInt(str);
    if (isNaN(num)) return 0;
    if (num === undefined || num === null) return 0;
    return num;
  } catch (e) {}
  return 0;
}

export function statToModifier(stat: string): string {
  const mod = Math.floor(stringToNum(stat) / 2) - 5;
  if (mod >= 0) {
    return `+${mod}`;
  } else {
    return `${mod}`;
  }
}

export function modifierToStat(modifier: string): string {
  const stat = stringToNum(modifier) * 2 + 10;
  return `${stat}`;
}
