export const extractCountFromString = (item: string): number | null => {
  const match = item.match(/\((\d+)\)\s*$/);
  return match ? parseInt(match[1], 10) : null;
};
