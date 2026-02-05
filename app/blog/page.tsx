import Link from "next/link"

export default function Blog() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline text-sm mb-8 inline-block"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
        Blog
      </h1>

      <div className="text-gray-600 dark:text-gray-400">
        <p>Coming soon...</p>
      </div>
    </div>
  );
}
