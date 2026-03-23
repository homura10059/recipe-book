import { Recipe as CooklangRecipe } from '@cooklang/cooklang-ts';

export type { Ingredient, Step } from '@cooklang/cooklang-ts';

const stripFrontmatter = (body: string): string => {
  if (!body.startsWith('---\n')) return body;
  const end = body.indexOf('\n---\n', 4);
  if (end === -1) return body;
  return body.slice(end + 5);
};

export const parseCooklang = (
  body: string
): { ingredients: CooklangRecipe['ingredients']; steps: CooklangRecipe['steps'] } => {
  const recipe = new CooklangRecipe(stripFrontmatter(body));
  return { ingredients: recipe.ingredients, steps: recipe.steps };
};
