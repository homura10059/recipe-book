import { describe, expect, it } from 'vitest';
import { parseCooklang } from './cooklang';

describe('parseCooklang', () => {
  it('空文字列は食材・手順ともに空を返す', () => {
    const { ingredients, steps } = parseCooklang('');
    expect(ingredients).toEqual([]);
    expect(steps).toEqual([]);
  });

  it('食材を正しくパースする', () => {
    const { ingredients } = parseCooklang('Add @salt{1%tsp} to the pan.');
    expect(ingredients).toHaveLength(1);
    expect(ingredients[0].name).toBe('salt');
  });

  it('分量・単位を正しくパースする', () => {
    const { ingredients } = parseCooklang('Use @flour{200%g}.');
    expect(ingredients[0].quantity).toBe(200);
    expect(ingredients[0].units).toBe('g');
  });

  it('複数の食材をパースする', () => {
    const { ingredients } = parseCooklang('Mix @egg{2} and @milk{200%ml}.');
    expect(ingredients).toHaveLength(2);
  });

  it('手順テキストをパースする', () => {
    const { steps } = parseCooklang('Boil water.\nAdd pasta.');
    expect(steps).toHaveLength(2);
  });

  it('手順のアイテム構造をパースする', () => {
    const { steps } = parseCooklang('Add @salt{1%tsp} to the pan.');
    expect(steps[0]).toEqual([
      { type: 'text', value: 'Add ' },
      { type: 'ingredient', name: 'salt', quantity: 1, units: 'tsp' },
      { type: 'text', value: ' to the pan.' },
    ]);
  });

  it('クックウェアをパースする', () => {
    const { steps } = parseCooklang('Heat in #pan.');
    expect(steps[0]).toContainEqual({ type: 'cookware', name: 'pan' });
  });

  it('タイマーをパースする', () => {
    const { steps } = parseCooklang('Simmer for ~{10%minutes}.');
    expect(steps[0]).toContainEqual({ type: 'timer', name: '', quantity: 10, units: 'minutes' });
  });

  it('メタデータをパースする', () => {
    const { metadata } = parseCooklang('>> servings: 4\n>> source: https://example.com');
    expect(metadata).toEqual({ servings: '4', source: 'https://example.com' });
  });

  it('メタデータと手順が共存する', () => {
    const { metadata, steps } = parseCooklang('>> servings: 2\nBoil water.');
    expect(metadata).toEqual({ servings: '2' });
    expect(steps).toHaveLength(1);
  });

  it('メタデータがない場合は空オブジェクトを返す', () => {
    const { metadata } = parseCooklang('Boil water.');
    expect(metadata).toEqual({});
  });

  it('日本語の食材名をパースする', () => {
    const { ingredients } = parseCooklang('@玉ねぎ{2%個} を炒める。');
    expect(ingredients).toHaveLength(1);
    expect(ingredients[0]).toEqual({ name: '玉ねぎ', quantity: 2, units: '個' });
  });

  it('日本語の単語食材名をパースする（ブレースなし）', () => {
    const { ingredients } = parseCooklang('@塩 を加える。');
    expect(ingredients).toHaveLength(1);
    expect(ingredients[0].name).toBe('塩');
  });

  it('フロントマターを手順に含めない', () => {
    const body = '---\ntitle: テストレシピ\n---\nBoil water.';
    const { steps } = parseCooklang(body);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual([{ type: 'text', value: 'Boil water.' }]);
  });
});
