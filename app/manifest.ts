import type { MetadataRoute } from "next";

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
  };
}
