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

// https://imgur.com/gallery/image-sizes
export type ImgurSize = 's' | 'b' | 't' | 'm' | 'l' | 'h';

export function getImgurUrl(url: string, size: ImgurSize = 'h'): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'i.imgur.com') return url;
    parsed.pathname = parsed.pathname.replace(/(\.[^.]+)$/, `${size}$1`);
    return parsed.toString();
  } catch {
    return url;
  }
}
