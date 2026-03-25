import { describe, expect, it } from 'vitest';
import { isMicroCMSImage } from './image';

describe('isMicroCMSImage', () => {
  it('microCMS の画像ドメインの URL は true を返す', () => {
    expect(isMicroCMSImage('https://images.microcms-assets.io/assets/foo/bar.jpg')).toBe(true);
  });

  it('imgur の URL は false を返す', () => {
    expect(isMicroCMSImage('https://i.imgur.com/ezjsThN.webp')).toBe(false);
  });

  it('空文字列は false を返す', () => {
    expect(isMicroCMSImage('')).toBe(false);
  });

  it('他の外部ドメインは false を返す', () => {
    expect(isMicroCMSImage('https://example.com/image.png')).toBe(false);
  });
});
