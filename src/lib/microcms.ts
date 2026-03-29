import { createClient } from 'microcms-js-sdk';

function getEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `[microcms] 環境変数 ${key} が設定されていません。.env ファイルを確認してください。\n  参考: .env.example`
    );
  }
  if (value.includes('://')) {
    throw new Error(
      `[microcms] ${key} には URL ではなく subdomain のみを設定してください。\n  NG: https://your-service.microcms.io\n  OK: your-service`
    );
  }
  return value;
}

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Recipe = {
  id: string;
  title: string;
  slug: string;
  body: string;
  thumbnail?: { url: string; width: number; height: number };
  tags: Tag[];
  category: Category;
  publishedAt: string;
  updatedAt: string;
};

const client = createClient({
  serviceDomain: getEnv('MICROCMS_SERVICE_DOMAIN'),
  apiKey: getEnv('MICROCMS_API_KEY'),
});

const PAGE_LIMIT = 100;

async function fetchAllContents<T>(
  endpoint: string,
  extraQueries?: { filters?: string }
): Promise<T[]> {
  const first = await client.getList<T>({
    endpoint,
    queries: { ...extraQueries, limit: PAGE_LIMIT, offset: 0 },
  });
  const { contents, totalCount } = first;
  if (totalCount <= PAGE_LIMIT) return contents;

  const pages = Math.ceil(totalCount / PAGE_LIMIT);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      client.getList<T>({
        endpoint,
        queries: { ...extraQueries, limit: PAGE_LIMIT, offset: (i + 1) * PAGE_LIMIT },
      })
    )
  );
  return [...contents, ...rest.flatMap((r) => r.contents)];
}

export const getAllRecipes = (): Promise<Recipe[]> => fetchAllContents<Recipe>('recipes');

export const getRecipe = async (slug: string): Promise<Recipe> => {
  const data = await client.getList<Recipe>({
    endpoint: 'recipes',
    queries: { filters: `slug[equals]${slug}`, limit: 1 },
  });
  return data.contents[0];
};

export const getAllTags = (): Promise<Tag[]> => fetchAllContents<Tag>('tags');

export const getAllCategories = (): Promise<Category[]> => fetchAllContents<Category>('categories');

export const getRecipesByTag = (id: string): Promise<Recipe[]> =>
  fetchAllContents<Recipe>('recipes', { filters: `tags[contains]${id}` });

export const getRecipesByCategory = (id: string): Promise<Recipe[]> =>
  fetchAllContents<Recipe>('recipes', { filters: `category[equals]${id}` });
