import { GraphBlob } from "@/components/GraphBlob"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-[1fr,1.2fr] gap-16 items-start">
        {/* Left side - Content */}
        <div className="max-w-md">
          {/* Header with name and social links */}
          <header className="mb-12">
            <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Jacob Lee
            </h1>
            <div className="flex gap-4 text-sm">
              <a
                href="https://github.com/JakeLee13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jake-lee-219a3a220/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/indeski_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline"
              >
                X
              </a>
            </div>
          </header>

          {/* About */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">About</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              I&apos;m a software engineer and data scientist interested in building intelligent systems
              and data-driven solutions.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Currently studying at the University of Utah, focusing on machine learning,
              statistics, and software development.
            </p>
          </section>

          {/* Experience */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Experience</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-black dark:text-white">Software Engineering Intern, Domo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Developed data visualization features and analytics tools
                </p>
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white">Teaching Assistant, University of Utah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Statistics, data science, and programming courses
                </p>
              </div>
            </div>
          </section>

          {/* Blog link */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">Blog</h2>
            <Link
              href="/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline"
            >
              Read my thoughts on software and data science →
            </Link>
          </section>
        </div>

        {/* Right side - 3D Graph (positioned to align with middle of content) */}
        <div className="hidden lg:flex items-center h-[600px] relative -mt-20">
          <GraphBlob />
        </div>
      </div>
    </div>
  );
}
