import { describe, expect, it } from 'vitest';
import { isHighlighted, stepItemText } from './stepList';

describe('isHighlighted', () => {
  it('ingredient アイテムはハイライト対象である', () => {
    expect(isHighlighted('ingredient')).toBe(true);
  });

  it('cookware アイテムはハイライト対象である', () => {
    expect(isHighlighted('cookware')).toBe(true);
  });

  it('text アイテムはハイライト対象でない', () => {
    expect(isHighlighted('text')).toBe(false);
  });

  it('timer アイテムはハイライト対象でない', () => {
    expect(isHighlighted('timer')).toBe(false);
  });
});

describe('stepItemText', () => {
  it('text アイテムはそのままの値を返す', () => {
    expect(stepItemText({ type: 'text', value: 'Add ' })).toBe('Add ');
  });

  it('ingredient アイテムは名前を返す', () => {
    expect(stepItemText({ type: 'ingredient', name: 'salt', quantity: 1, units: 'tsp' })).toBe(
      'salt'
    );
  });

  it('cookware アイテムは名前を返す', () => {
    expect(stepItemText({ type: 'cookware', name: 'pan' })).toBe('pan');
  });

  it('timer アイテムは分量と単位を返す', () => {
    expect(stepItemText({ type: 'timer', name: '', quantity: 10, units: 'minutes' })).toBe(
      '10 minutes'
    );
  });

  it('timer アイテムで単位がない場合は分量のみを返す', () => {
    expect(stepItemText({ type: 'timer', name: '', quantity: 5 })).toBe('5');
  });
});
