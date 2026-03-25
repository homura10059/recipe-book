export const MICROCMS_IMAGE_DOMAIN = 'images.microcms-assets.io';

export function isMicroCMSImage(url: string): boolean {
  try {
    return new URL(url).hostname === MICROCMS_IMAGE_DOMAIN;
  } catch {
    return false;
  }
}
