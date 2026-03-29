import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllRecipes } from '../lib/microcms';
import { recipeToRssItem } from '../lib/rss';

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error('site が astro.config.mjs に設定されていません');
  }
  const siteUrl = context.site.toString().replace(/\/$/, '');
  const recipes = await getAllRecipes();
  return rss({
    title: "homura's recipe book",
    description: '新着レシピをお届けします',
    site: context.site,
    items: recipes.map((r) => recipeToRssItem(r, siteUrl)),
  });
}
