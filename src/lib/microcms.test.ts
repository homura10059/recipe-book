import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetList = vi.fn();

vi.mock('microcms-js-sdk', () => ({
  createClient: () => ({
    getList: mockGetList,
  }),
}));

vi.stubEnv('MICROCMS_SERVICE_DOMAIN', 'test-domain');
vi.stubEnv('MICROCMS_API_KEY', 'test-api-key');

const { getAllRecipes, getAllTags, getAllCategories, getRecipesByCategory, getRecipesByTag } =
  await import('./microcms');

// ---- shared fixtures ----

const makeRecipe = (id: string) => ({
  id,
  title: `レシピ${id}`,
  slug: `recipe-${id}`,
  body: '',
  tags: [],
  category: { id: 'cat-1', name: 'カテゴリ', slug: 'category' },
  publishedAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

const makeTag = (id: string) => ({ id, name: `タグ${id}`, slug: `tag-${id}` });
const makeCategory = (id: string) => ({ id, name: `カテゴリ${id}`, slug: `category-${id}` });

// ---- getAllRecipes ----

describe('getAllRecipes', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('totalCount が 100 以下の場合、offset:0 で 1 回だけ API を呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 2, limit: 100, offset: 0 });

    await getAllRecipes();

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'recipes',
      queries: { limit: 100, offset: 0 },
    });
  });

  it('totalCount が 100 以下の場合、contents をそのまま返す', async () => {
    const recipes = [makeRecipe('r1'), makeRecipe('r2')];
    mockGetList.mockResolvedValue({ contents: recipes, totalCount: 2, limit: 100, offset: 0 });

    const result = await getAllRecipes();

    expect(result).toEqual(recipes);
  });

  it('totalCount が 100 超の場合、offset を進めて全ページを取得する', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeRecipe(`p1-${i}`));
    const page2 = Array.from({ length: 50 }, (_, i) => makeRecipe(`p2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 150, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 150, limit: 100, offset: 100 });

    await getAllRecipes();

    expect(mockGetList).toHaveBeenCalledTimes(2);
    expect(mockGetList).toHaveBeenNthCalledWith(1, {
      endpoint: 'recipes',
      queries: { limit: 100, offset: 0 },
    });
    expect(mockGetList).toHaveBeenNthCalledWith(2, {
      endpoint: 'recipes',
      queries: { limit: 100, offset: 100 },
    });
  });

  it('totalCount が 100 超の場合、全ページの contents を結合して返す', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeRecipe(`p1-${i}`));
    const page2 = Array.from({ length: 50 }, (_, i) => makeRecipe(`p2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 150, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 150, limit: 100, offset: 100 });

    const result = await getAllRecipes();

    expect(result).toEqual([...page1, ...page2]);
  });
});

// ---- getAllTags ----

describe('getAllTags', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('totalCount が 100 以下の場合、offset:0 で 1 回だけ API を呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 5, limit: 100, offset: 0 });

    await getAllTags();

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'tags',
      queries: { limit: 100, offset: 0 },
    });
  });

  it('totalCount が 100 超の場合、全ページの contents を結合して返す', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeTag(`t1-${i}`));
    const page2 = Array.from({ length: 30 }, (_, i) => makeTag(`t2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 130, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 130, limit: 100, offset: 100 });

    const result = await getAllTags();

    expect(result).toEqual([...page1, ...page2]);
  });
});

// ---- getAllCategories ----

describe('getAllCategories', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('totalCount が 100 以下の場合、offset:0 で 1 回だけ API を呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 3, limit: 100, offset: 0 });

    await getAllCategories();

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'categories',
      queries: { limit: 100, offset: 0 },
    });
  });

  it('totalCount が 100 超の場合、全ページの contents を結合して返す', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeCategory(`c1-${i}`));
    const page2 = Array.from({ length: 20 }, (_, i) => makeCategory(`c2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 120, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 120, limit: 100, offset: 100 });

    const result = await getAllCategories();

    expect(result).toEqual([...page1, ...page2]);
  });
});

// ---- getRecipesByTag ----

describe('getRecipesByTag', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('tags[contains]{id} フィルタと offset:0 で API を呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 0, limit: 100, offset: 0 });

    await getRecipesByTag('tag-id-xyz');

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'recipes',
      queries: { filters: 'tags[contains]tag-id-xyz', limit: 100, offset: 0 },
    });
  });

  it('APIレスポンスの contents を返す', async () => {
    const mockRecipes = [makeRecipe('r1')];
    mockGetList.mockResolvedValue({ contents: mockRecipes, totalCount: 1, limit: 100, offset: 0 });

    const result = await getRecipesByTag('tag-id-xyz');

    expect(result).toEqual(mockRecipes);
  });

  it('totalCount が 100 超の場合、フィルタを保ちつつ全ページの contents を結合して返す', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeRecipe(`p1-${i}`));
    const page2 = Array.from({ length: 40 }, (_, i) => makeRecipe(`p2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 140, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 140, limit: 100, offset: 100 });

    const result = await getRecipesByTag('tag-id-xyz');

    expect(result).toEqual([...page1, ...page2]);
    expect(mockGetList).toHaveBeenNthCalledWith(2, {
      endpoint: 'recipes',
      queries: { filters: 'tags[contains]tag-id-xyz', limit: 100, offset: 100 },
    });
  });
});

// ---- getRecipesByCategory ----

describe('getRecipesByCategory', () => {
  beforeEach(() => {
    mockGetList.mockReset();
  });

  it('category[equals]{id} フィルタと offset:0 で API を呼び出す', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 0, limit: 100, offset: 0 });

    await getRecipesByCategory('category-id-abc');

    expect(mockGetList).toHaveBeenCalledTimes(1);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'recipes',
      queries: { filters: 'category[equals]category-id-abc', limit: 100, offset: 0 },
    });
  });

  it('APIレスポンスの contents を返す', async () => {
    const mockRecipes = [makeRecipe('r1')];
    mockGetList.mockResolvedValue({ contents: mockRecipes, totalCount: 1, limit: 100, offset: 0 });

    const result = await getRecipesByCategory('category-id-abc');

    expect(result).toEqual(mockRecipes);
  });

  it('totalCount が 100 超の場合、フィルタを保ちつつ全ページの contents を結合して返す', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) => makeRecipe(`p1-${i}`));
    const page2 = Array.from({ length: 60 }, (_, i) => makeRecipe(`p2-${i}`));
    mockGetList
      .mockResolvedValueOnce({ contents: page1, totalCount: 160, limit: 100, offset: 0 })
      .mockResolvedValueOnce({ contents: page2, totalCount: 160, limit: 100, offset: 100 });

    const result = await getRecipesByCategory('category-id-abc');

    expect(result).toEqual([...page1, ...page2]);
    expect(mockGetList).toHaveBeenNthCalledWith(2, {
      endpoint: 'recipes',
      queries: { filters: 'category[equals]category-id-abc', limit: 100, offset: 100 },
    });
  });
});
