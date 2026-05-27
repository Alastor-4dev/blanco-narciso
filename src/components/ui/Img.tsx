import NextImage, { ImageProps } from "next/image";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Drop-in replacement for next/image that prepends the basePath to
 * absolute-path srcs. Needed because next/image + unoptimized:true
 * does not honour basePath when generating static HTML.
 */
export default function Img({ src, ...props }: ImageProps) {
  const resolvedSrc =
    typeof src === "string" && src.startsWith("/") ? `${base}${src}` : src;
  return <NextImage src={resolvedSrc} {...props} />;
}
