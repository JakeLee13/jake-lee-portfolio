interface BlogVideoProps {
  src: string;
  caption?: string;
  autoPlay?: boolean;
}

export function BlogVideo({
  src,
  caption,
  autoPlay = true,
}: BlogVideoProps): React.ReactElement {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <video
          src={src}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          className="w-full h-auto"
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
