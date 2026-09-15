export const CATEGORY_COLORS: Record<string, string> = {
  Government: '#DD403A',
  University: '#7B4B94',
  Foundation: '#B7E3CC',
  Company: '#7D82B8',
  Unknown: '#FFC145',
};

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  Unknown: 'Not Recognized',
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Unknown;
};

export const formatCategoryDisplayName = (category: string): string => {
  return CATEGORY_DISPLAY_NAMES[category] ?? category;
};
