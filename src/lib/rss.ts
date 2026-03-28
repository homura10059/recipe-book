import type { Recipe } from './microcms';

export type RssItem = {
  title: string;
  link: string;
  pubDate: Date;
};

export function recipeToRssItem(recipe: Recipe, siteUrl: string): RssItem {
  return {
    title: recipe.title,
    link: `${siteUrl}/recipes/${recipe.slug}`,
    pubDate: new Date(recipe.publishedAt),
  };
}
