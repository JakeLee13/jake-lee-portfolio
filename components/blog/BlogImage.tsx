import Image from "next/image";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function BlogImage({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: BlogImageProps): React.ReactElement {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          quality={90}
          sizes="(max-width: 672px) 100vw, 672px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400 font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
