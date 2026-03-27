const DEFAULT_OGP_IMAGE = 'https://i.imgur.com/ezjsThN.webp';

export function getOgImageUrl(thumbnailUrl?: string): string {
  return thumbnailUrl ?? DEFAULT_OGP_IMAGE;
}
