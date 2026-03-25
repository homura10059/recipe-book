import { describe, expect, it } from 'vitest';
import { isOptimizableImage } from './image';

describe('isOptimizableImage', () => {
  it('microCMS の画像ドメインの URL は true を返す', () => {
    expect(isOptimizableImage('https://images.microcms-assets.io/assets/foo/bar.jpg')).toBe(true);
  });

  it('Cloudflare Images の URL は true を返す', () => {
    expect(isOptimizableImage('https://imagedelivery.net/abc123/img-id/public')).toBe(true);
  });

  it('imgur の URL は false を返す', () => {
    expect(isOptimizableImage('https://i.imgur.com/ezjsThN.webp')).toBe(false);
  });

  it('空文字列は false を返す', () => {
    expect(isOptimizableImage('')).toBe(false);
  });

  it('他の外部ドメインは false を返す', () => {
    expect(isOptimizableImage('https://example.com/image.png')).toBe(false);
  });
});
