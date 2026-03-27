import { describe, expect, it } from 'vitest';
import { getOgImageUrl } from './ogp';

describe('getOgImageUrl', () => {
  it('サムネイルURLがある場合はそれを返す', () => {
    expect(getOgImageUrl('https://example.com/thumb.jpg')).toBe('https://example.com/thumb.jpg');
  });

  it('サムネイルURLがない場合はデフォルト画像URLを返す', () => {
    expect(getOgImageUrl(undefined)).toBe('https://i.imgur.com/ezjsThN.webp');
  });
});
