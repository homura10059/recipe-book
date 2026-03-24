export function formatIngredientQuantity(
  quantity: number | string | undefined,
  units: string | undefined
): string {
  const hasQuantity = quantity !== null && quantity !== undefined && quantity !== '';
  const hasUnits = units !== null && units !== undefined && units !== '';

  if (hasQuantity && hasUnits) return `${quantity} ${units}`;
  if (hasQuantity) return `${quantity}`;
  if (hasUnits) return units;
  return '';
}
