export function applyEllipsis(name: string, maxLength = 18): { text: string; tooltip: string } {
  if (name.length <= maxLength) {
    return { text: name, tooltip: name };
  }
  const truncated = `${name.slice(0, maxLength - 1)}…`;
  return { text: truncated, tooltip: name };
}
