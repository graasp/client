export function isSocialLinkValid(socialProfile: string, val: string): boolean {
  if (URL.canParse(val)) {
    switch (socialProfile) {
      case 'linkedin':
        return (
          val.match(
            /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_]+\/?(\?.+)?$/,
          ) !== null
        );
      case 'twitter':
        return (
          val.match(
            /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?(\?.+)?$/,
          ) !== null
        );
      case 'facebook':
        return (
          val.match(
            /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+\/?(\?.+)?$/,
          ) !== null
        );
      default:
        return false;
    }
  }
  return true;
}

export function extractProfileId(socialProfile: string, val: string): string {
  if (URL.canParse(val)) {
    const url = new URL(val);
    // remove trailing slash from pathname
    const pathname = url.pathname.replace(/\/+$/g, '');
    switch (socialProfile) {
      case 'linkedin':
        return pathname.split('/').pop()!;
      case 'twitter':
        return pathname.split('/').pop()!;
      case 'facebook':
        return pathname.split('/').pop()!;
      default:
        return val;
    }
  }
  return val;
}

export function socialLinkFor(
  socialProfile: string,
  id: string | undefined,
): string | undefined {
  switch (socialProfile) {
    case 'linkedin':
      return `https://linkedin.com/in/${id}`;
    case 'twitter':
      return `https://twitter.com/${id}`;
    case 'facebook':
      return `https://facebook.com/${id}`;
    default:
      return id;
  }
}
