import { ImageResponse } from "next/og";
import { BrandSocialImage, BRAND_IMAGE_ALT } from "@/lib/brand-image";
import { SOCIAL_IMAGE_SIZE } from "@/lib/brand";

export const alt = BRAND_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<BrandSocialImage />, size);
}
