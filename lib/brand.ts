export const BRAND_COLORS = {
  background: "#09090b",
  panel: "#18181b",
  foreground: "#fafafa",
  muted: "#a1a1aa",
  accent: "#bef264",
  accentDark: "#18181b",
  sky: "#7dd3fc",
  violet: "#c4b5fd",
} as const;

export const PWA_ICON_SIZES = [192, 512] as const;

export type PwaIconSize = (typeof PWA_ICON_SIZES)[number];

export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export function parsePwaIconSize(value: string): PwaIconSize | null {
  const size = Number(value);

  return PWA_ICON_SIZES.includes(size as PwaIconSize) ? (size as PwaIconSize) : null;
}

export function buildPwaIconPath(size: PwaIconSize): string {
  return `/pwa-icon/${size}`;
}
