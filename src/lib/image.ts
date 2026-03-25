export const OPTIMIZABLE_IMAGE_DOMAINS = [
  'images.microcms-assets.io',
  'imagedelivery.net', // Cloudflare Images
] as const;

export function isOptimizableImage(url: string): boolean {
  try {
    return (OPTIMIZABLE_IMAGE_DOMAINS as readonly string[]).includes(new URL(url).hostname);
  } catch {
    return false;
  }
}
