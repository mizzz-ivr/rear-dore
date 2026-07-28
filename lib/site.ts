export const DEFAULT_SITE_URL = "https://reardore.ivrm.jp";

export function resolveSiteUrl(rawValue = process.env.NEXT_PUBLIC_SITE_URL): URL {
  if (!rawValue) {
    return new URL(DEFAULT_SITE_URL);
  }

  try {
    const parsed = new URL(rawValue);
    const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
    const hasCredentials = Boolean(parsed.username || parsed.password);
    const hasPath = parsed.pathname !== "/";
    const hasSearch = Boolean(parsed.search);
    const hasHash = Boolean(parsed.hash);

    if (!isHttp || hasCredentials || hasPath || hasSearch || hasHash) {
      return new URL(DEFAULT_SITE_URL);
    }

    return new URL(parsed.origin);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getSiteOrigin(rawValue = process.env.NEXT_PUBLIC_SITE_URL): string {
  return resolveSiteUrl(rawValue).origin;
}
