import { GraphBlob } from "@/components/GraphBlob"
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope } from "react-icons/fa6"

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center px-6 pt-20">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-20 items-start">
        {/* Left side - Content */}
        <div className="max-w-md justify-self-end pt-12">
          {/* Header with name */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Jake Lee
            </h1>
          </header>

          {/* About text without heading */}
          <section className="mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              I&apos;m interested in lots of data things (see right for more). Studied Statistics and Quantitative Analysis at the University of Utah. Currently doing analytics at Domo.
            </p>
          </section>

          {/* Social links */}
          <section>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:jacob.g.lee13@gmail.com"
                className="flex items-center gap-2 group"
              >
                <FaEnvelope className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">jacob.g.lee13@gmail.com</span>
              </a>
              <a
                href="https://x.com/indeski_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <FaXTwitter className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">@indeski_</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jake-lee-219a3a220/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <FaLinkedin className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">jake-lee</span>
              </a>
              <a
                href="https://github.com/JakeLee13"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <FaGithub className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">JakeLee13</span>
              </a>
            </div>
          </section>
        </div>

        {/* Right side - 3D Graph (naturally centered) */}
        <div className="hidden lg:flex items-center justify-center h-[700px]">
          <GraphBlob />
        </div>
      </div>
    </div>
  );
}
