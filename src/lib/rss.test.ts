import { describe, expect, it } from 'vitest';
import type { Recipe } from './microcms';
import { recipeToRssItem } from './rss';

const baseRecipe: Recipe = {
  id: 'abc123',
  title: 'カレーライス',
  slug: 'curry-rice',
  body: '',
  tags: [],
  category: { id: 'cat1', name: '主食', slug: 'main' },
  publishedAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

describe('recipeToRssItem', () => {
  it('title を返す', () => {
    const item = recipeToRssItem(baseRecipe, 'https://recipe-book.homura10059.dev');
    expect(item.title).toBe('カレーライス');
  });

  it('レシピ詳細ページの link を返す', () => {
    const item = recipeToRssItem(baseRecipe, 'https://recipe-book.homura10059.dev');
    expect(item.link).toBe('https://recipe-book.homura10059.dev/recipes/curry-rice');
  });

  it('publishedAt を Date に変換して返す', () => {
    const item = recipeToRssItem(baseRecipe, 'https://recipe-book.homura10059.dev');
    expect(item.pubDate).toEqual(new Date('2024-01-15T00:00:00.000Z'));
  });

  it('異なる siteUrl でも正しい link を返す', () => {
    const item = recipeToRssItem(baseRecipe, 'https://example.com');
    expect(item.link).toBe('https://example.com/recipes/curry-rice');
  });
});
