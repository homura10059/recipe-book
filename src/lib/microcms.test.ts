import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetList = vi.fn();

vi.mock('microcms-js-sdk', () => ({
  createClient: () => ({
    getList: mockGetList,
  }),
}));

vi.stubEnv('MICROCMS_SERVICE_DOMAIN', 'test-domain');
vi.stubEnv('MICROCMS_API_KEY', 'test-api-key');

const { getRecipesByCategory, getRecipesByTag } = await import('./microcms');

describe('getRecipesByCategory', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('category[equals]{id} フィルタでAPIを呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [] });

    await getRecipesByCategory('category-id-abc');

    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'recipes',
      queries: { filters: 'category[equals]category-id-abc', limit: 100 },
    });
  });

  it('APIレスポンスの contents を返す', async () => {
    const mockRecipes = [
      {
        id: 'r1',
        title: 'テストレシピ',
        slug: 'test-recipe',
        body: '',
        tags: [],
        category: { id: 'category-id-abc', name: 'カテゴリ', slug: 'category' },
        publishedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    mockGetList.mockResolvedValue({ contents: mockRecipes });

    const result = await getRecipesByCategory('category-id-abc');

    expect(result).toEqual(mockRecipes);
  });
});

describe('getRecipesByTag', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('tags[contains]{id} フィルタでAPIを呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [] });

    await getRecipesByTag('tag-id-xyz');

    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'recipes',
      queries: { filters: 'tags[contains]tag-id-xyz', limit: 100 },
    });
  });

  it('APIレスポンスの contents を返す', async () => {
    const mockRecipes = [
      {
        id: 'r1',
        title: 'テストレシピ',
        slug: 'test-recipe',
        body: '',
        tags: [{ id: 'tag-id-xyz', name: 'タグ', slug: 'tag' }],
        category: { id: 'cat-1', name: 'カテゴリ', slug: 'category' },
        publishedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    mockGetList.mockResolvedValue({ contents: mockRecipes });

    const result = await getRecipesByTag('tag-id-xyz');

    expect(result).toEqual(mockRecipes);
  });
});
