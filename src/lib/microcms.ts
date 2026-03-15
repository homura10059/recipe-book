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
};

const client = createClient({
  serviceDomain: getEnv('MICROCMS_SERVICE_DOMAIN'),
  apiKey: getEnv('MICROCMS_API_KEY'),
});

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const data = await client.getList<Recipe>({ endpoint: 'recipes', queries: { limit: 100 } });
  return data.contents;
};

export const getRecipe = async (slug: string): Promise<Recipe> => {
  const data = await client.getList<Recipe>({
    endpoint: 'recipes',
    queries: { filters: `slug[equals]${slug}`, limit: 1 },
  });
  return data.contents[0];
};

export const getAllTags = async (): Promise<Tag[]> => {
  const data = await client.getList<Tag>({ endpoint: 'tags', queries: { limit: 100 } });
  return data.contents;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const data = await client.getList<Category>({ endpoint: 'categories', queries: { limit: 100 } });
  return data.contents;
};

export const getRecipesByTag = async (slug: string): Promise<Recipe[]> => {
  const data = await client.getList<Recipe>({
    endpoint: 'recipes',
    queries: { filters: `tags[contains]${slug}`, limit: 100 },
  });
  return data.contents;
};

export const getRecipesByCategory = async (slug: string): Promise<Recipe[]> => {
  const data = await client.getList<Recipe>({
    endpoint: 'recipes',
    queries: { filters: `category[equals]${slug}`, limit: 100 },
  });
  return data.contents;
};
