import type { Step } from '../lib/cooklang';

type StepItem = Step[number];

export function isHighlighted(type: StepItem['type']): boolean {
  return type === 'ingredient' || type === 'cookware';
}

export function stepItemText(item: StepItem): string {
  if (item.type === 'text') return item.value;
  if (item.type === 'ingredient') return item.name;
  if (item.type === 'cookware') return item.name;
  // timer
  const parts = [item.quantity, item.units].filter((v) => v !== undefined);
  return parts.join(' ');
}
