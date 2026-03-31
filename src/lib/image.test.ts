import { describe, expect, it } from 'vitest';
import { getImgurUrl, isOptimizableImage } from './image';

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

describe('getImgurUrl', () => {
  it('imgur の URL にサイズサフィックスを付与した URL を返す', () => {
    expect(getImgurUrl('https://i.imgur.com/ezjsThN.webp', 'l')).toBe(
      'https://i.imgur.com/ezjsThNl.webp'
    );
  });

  it('jpg 拡張子の imgur URL にもサイズサフィックスを付与できる', () => {
    expect(getImgurUrl('https://i.imgur.com/abc1234.jpg', 'm')).toBe(
      'https://i.imgur.com/abc1234m.jpg'
    );
  });

  it('サイズを指定しない場合はデフォルトサイズ (h) を使用する', () => {
    expect(getImgurUrl('https://i.imgur.com/ezjsThN.webp')).toBe(
      'https://i.imgur.com/ezjsThNh.webp'
    );
  });

  it('imgur 以外の URL はそのまま返す', () => {
    expect(getImgurUrl('https://example.com/image.png', 'l')).toBe('https://example.com/image.png');
  });
});
