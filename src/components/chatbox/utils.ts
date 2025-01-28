import { PartialMemberDisplay } from './types.js';

/**
 * @deprecated This function is vulnerable to usernames with special characters.
 * Please use the new `getIdMention()`
 * @param textContent text in which to search for a mention
 * @returns a match or null
 */
export const getMention = (textContent: string): RegExpMatchArray | null =>
  textContent.match(
    /<!@(?<name>[\s\w]+)>\[(?<id>[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12})]/i,
  );

export const getIdMention = (textContent: string): RegExpMatchArray | null =>
  textContent.match(
    /<!@(?<id>[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12})>/i,
  );

export const normalizeMentions = (message: string): string => {
  const regexMentions =
    /`<!@([\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12})>\[([\s\w]+)\]`/gi;
  return message.replace(regexMentions, '@$2');
};

export const MENTION_MARKUP = '`<!@__id__>[__display__]`';
