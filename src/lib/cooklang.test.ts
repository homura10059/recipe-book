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

  it('title メタデータが手順に含まれない', () => {
    const { steps } = parseCooklang('>> title: My Recipe\nBoil water.');
    expect(steps).toHaveLength(1);
  });

  it('servings メタデータが手順に含まれない', () => {
    const { steps } = parseCooklang('>> servings: 4\nBoil water.');
    expect(steps).toHaveLength(1);
  });

  it('title と servings の両メタデータが混在しても手順に含まれない', () => {
    const { steps } = parseCooklang(
      '>> title: Pasta\n>> servings: 4\nBoil water.\nAdd @salt{1%tsp}.'
    );
    expect(steps).toHaveLength(2);
  });

  it('frontmatter の title が手順に含まれない', () => {
    const body = '---\ntitle: My Recipe\n---\nBoil water.';
    const { steps } = parseCooklang(body);
    expect(steps).toHaveLength(1);
  });

  it('frontmatter の servings が手順に含まれない', () => {
    const body = '---\nservings: 4\n---\nBoil water.';
    const { steps } = parseCooklang(body);
    expect(steps).toHaveLength(1);
  });

  it('frontmatter の title・servings が混在しても手順に含まれない', () => {
    const body = '---\ntitle: Pasta\nservings: 4\n---\nBoil water.\nAdd @salt{1%tsp}.';
    const { steps } = parseCooklang(body);
    expect(steps).toHaveLength(2);
  });

  it('frontmatter があっても食材を正しくパースする', () => {
    const body = '---\ntitle: My Recipe\n---\nAdd @salt{1%tsp} to the pan.';
    const { ingredients } = parseCooklang(body);
    expect(ingredients).toHaveLength(1);
    expect(ingredients[0].name).toBe('salt');
  });
});
