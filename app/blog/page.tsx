import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline text-sm mb-8 inline-block"
      >
        &larr; Back
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
        Blog
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-lg font-medium text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {post.description}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
