function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
}

export function createRangeString(from: number, to: number): string {
  return `${formatNumber(from)}-${formatNumber(to)}`;
}

function parseFormattedNumber(str: string): number {
  // Check if the formatted number uses 'k' notation
  if (str.endsWith('k')) {
    const numberPart = str.slice(0, -1); // remove the 'k'
    const thousandValue = parseInt(numberPart, 10);
    return thousandValue * 1000;
  }

  // Otherwise, it's a plain number
  return parseInt(str, 10);
}

export function parseRangeString(range: string): { from: number; to: number } {
  const [fromStr, toStr] = range.split('-');
  const fromValue = parseFormattedNumber(fromStr);
  const toValue = parseFormattedNumber(toStr);

  return { from: fromValue, to: toValue };
}
