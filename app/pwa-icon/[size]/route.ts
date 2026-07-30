import { createElement } from "react";
import { ImageResponse } from "next/og";
import { BrandIcon } from "@/lib/brand-image";
import { parsePwaIconSize } from "@/lib/brand";

type RouteContext = Readonly<{
  params: Promise<{ size: string }>;
}>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { size: rawSize } = await params;
  const size = parsePwaIconSize(rawSize);

  if (!size) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  const response = new ImageResponse(
    createElement(BrandIcon, { size, maskable: true }),
    {
      width: size,
      height: size,
    },
  );

  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return response;
}
