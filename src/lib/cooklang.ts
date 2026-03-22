import { Recipe as CooklangRecipe } from '@cooklang/cooklang-ts';

export type { Ingredient, Step } from '@cooklang/cooklang-ts';

export const parseCooklang = (
  body: string
): { ingredients: CooklangRecipe['ingredients']; steps: CooklangRecipe['steps'] } => {
  const recipe = new CooklangRecipe(body);
  return { ingredients: recipe.ingredients, steps: recipe.steps };
};
