import type { MetadataRoute } from "next";
import { buildPwaIconPath, PWA_ICON_SIZES } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "レアどれ？",
    short_name: "レアどれ？",
    description: "みんなが選ばなそうな答えを選ぶ、少数派予測型のデイリーゲーム。",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    lang: "ja",
    icons: PWA_ICON_SIZES.flatMap((size) => [
      {
        src: buildPwaIconPath(size),
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any" as const,
      },
      {
        src: buildPwaIconPath(size),
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "maskable" as const,
      },
    ]),
  };
}
