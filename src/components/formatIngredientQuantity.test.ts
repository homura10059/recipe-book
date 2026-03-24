import { describe, expect, it } from 'vitest';
import { formatIngredientQuantity } from './formatIngredientQuantity';

describe('formatIngredientQuantity', () => {
  it('quantityもunitsもundefinedのとき空文字を返す', () => {
    expect(formatIngredientQuantity(undefined, undefined)).toBe('');
  });

  it('quantityだけあるとき数量のみ返す', () => {
    expect(formatIngredientQuantity(2, undefined)).toBe('2');
  });

  it('quantityが0のとき0を返す', () => {
    expect(formatIngredientQuantity(0, undefined)).toBe('0');
  });

  it('quantityとunitsがあるとき空白で結合して返す', () => {
    expect(formatIngredientQuantity(2, 'g')).toBe('2 g');
  });

  it('quantity が0でunitsがあるとき0と単位を結合して返す', () => {
    expect(formatIngredientQuantity(0, 'g')).toBe('0 g');
  });

  it('unitsだけあるとき単位のみ返す', () => {
    expect(formatIngredientQuantity(undefined, 'g')).toBe('g');
  });

  it('quantityが空文字のとき空文字を返す', () => {
    expect(formatIngredientQuantity('', undefined)).toBe('');
  });

  it('quantityが文字列のとき文字列を返す', () => {
    expect(formatIngredientQuantity('適量', undefined)).toBe('適量');
  });
});
