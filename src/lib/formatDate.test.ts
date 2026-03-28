import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('ISO 8601 文字列を "YYYY年M月D日" 形式に変換して返す', () => {
    expect(formatDate('2024-01-15T00:00:00.000Z')).toBe('2024年1月15日');
  });

  it('月・日が 1 桁の場合でもゼロ埋めしない', () => {
    expect(formatDate('2024-03-05T12:00:00.000Z')).toBe('2024年3月5日');
  });

  it('12月31日を正しく変換する', () => {
    expect(formatDate('2023-12-31T23:59:59.000Z')).toBe('2023年12月31日');
  });
});
