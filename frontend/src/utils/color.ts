/** #2f5785 -> "47 87 133"（供 tailwind 的 rgb(var(--x) / alpha) 使用） */
export function hexToRgbTuple(hex: string): string {
  let value = (hex || '').trim().replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map(c => c + c)
      .join('');
  }
  if (value.length !== 6 || /[^0-9a-fA-F]/.test(value)) {
    return '47 87 133';
  }
  const num = parseInt(value, 16);
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}
