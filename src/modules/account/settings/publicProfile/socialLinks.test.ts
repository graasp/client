import { describe, expect, test } from 'vitest';

import {
  extractProfileId,
  isSocialLinkValid,
  socialLinkFor,
} from './socialLinks';

describe('isSocialLinkValid', () => {
  describe('facebook', () => {
    test.each([
      'https://www.facebook.com/test',
      'https://facebook.com/test',
      'https://facebook.com/test/',
      'https://facebook.com/tes_hekt/',
    ])('allows %s', (link) => {
      expect(isSocialLinkValid('facebook', link)).toBe(true);
    });
    test.each([
      'https://face.book.com/test',
      'http://facebook.com/test',
      'https://facebook.com/',
      'https://www.facebook.com/',
    ])('rejects %s', (link) => {
      expect(isSocialLinkValid('facebook', link)).toBe(false);
    });
  });
  describe('twitter', () => {
    test.each([
      'https://www.twitter.com/test',
      'https://twitter.com/test',
      'https://twitter.com/test/',
      'https://twitter.com/tes_hekt/',
      'https://twitter.com/tes_hekt/?query=test',
      'https://x.com/tes_hekt/',
      'https://www.x.com/tes_hekt/',
    ])('allows %s', (link) => {
      expect(isSocialLinkValid('twitter', link)).toBe(true);
    });
    test.each([
      'https://twitr.com/test',
      'http://twitter.com/test',
      'https://twitter.com/',
      'https://twitter.com/sampl*ple',
      'https://x.com/',
    ])('rejects %s', (link) => {
      expect(isSocialLinkValid('twitter', link)).toBe(false);
    });
  });
  describe('linkedin', () => {
    test.each([
      'https://www.linkedin.com/in/test',
      'https://linkedin.com/in/test',
      'https://linkedin.com/in/test/',
      'https://linkedin.com/in/tes_hekt/?query=test',
      'https://linkedin.com/in/tes_hekt/',
      'https://www.linkedin.com/in/tes_hekt/',
    ])('allows %s', (link) => {
      expect(isSocialLinkValid('linkedin', link)).toBe(true);
    });
    test.each([
      'https://linedin.com/test',
      'http://linkedin.com/test',
      'https://linkedin.com/',
      'https://linkedin.com/sampl*ple',
      'https://linkedin.com/',
      'https://link@edin.com/in/test',
    ])('rejects %s', (link) => {
      expect(isSocialLinkValid('linkedin', link)).toBe(false);
    });
  });
});

describe('extractProfileId', () => {
  describe('linkedin', () => {
    test.each([
      ['https://www.linkedin.com/in/test', 'test'],
      ['https://linkedin.com/in/test', 'test'],
      ['https://linkedin.com/in/test/', 'test'],
      ['https://linkedin.com/in/test/?query=string', 'test'],
    ])('extracts %s', (link, expected) => {
      expect(extractProfileId('linkedin', link)).toBe(expected);
    });
  });
  describe('twitter', () => {
    test.each([
      ['https://twitter.com/test', 'test'],
      ['https://twitter.com/test/', 'test'],
      ['https://x.com/test/', 'test'],
      ['https://twitter.com/test/?query=string', 'test'],
    ])('extracts %s', (link, expected) => {
      expect(extractProfileId('twitter', link)).toBe(expected);
    });
  });
  describe('facebook', () => {
    test.each([
      ['https://www.facebook.com/', ''],
      ['https://facebook.com/test', 'test'],
      ['https://facebook.com/test/', 'test'],
      ['https://facebook.com/test/?query=string', 'test'],
    ])('extracts %s', (link, expected) => {
      expect(extractProfileId('facebook', link)).toBe(expected);
    });
  });
});

describe('socialLinkFor', () => {
  test('linkedin', () => {
    expect(socialLinkFor('linkedin', 'test')).toBe(
      'https://linkedin.com/in/test',
    );
  });
  test('twitter', () => {
    expect(socialLinkFor('twitter', 'test')).toBe('https://twitter.com/test');
  });
  test('facebook', () => {
    expect(socialLinkFor('facebook', 'test')).toBe('https://facebook.com/test');
  });
});
