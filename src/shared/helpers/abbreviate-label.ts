export const abbreviateLabel = (label: string) => {
  return label
    .split('-')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
