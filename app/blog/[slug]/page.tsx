import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { getAllSlugs, getPost } from "@/lib/blog";
import { PipelineDiagram } from "@/components/blog/PipelineDiagram";
import { StageTable } from "@/components/blog/StageTable";
import { ComparisonTable } from "@/components/blog/ComparisonTable";
import { CrmGapTable } from "@/components/blog/CrmGapTable";
import { SdkComparison } from "@/components/blog/SdkComparison";
import { ComputeInsightCards } from "@/components/blog/ComputeInsightCards";
import { BottleneckTimeline } from "@/components/blog/BottleneckTimeline";
import { AllocationTable } from "@/components/blog/AllocationTable";
import { Scorecard } from "@/components/blog/Scorecard";
import { SAPortfolioTable } from "@/components/blog/SAPortfolioTable";
import { VerdictBox } from "@/components/blog/VerdictBox";
import { ComputeIndexTracker } from "@/components/blog/ComputeIndexTracker";
import { ComputeIndexPerformance } from "@/components/blog/ComputeIndexPerformance";
import { EUVSupplyChain } from "@/components/blog/EUVSupplyChain";
import { TransistorEvolution } from "@/components/blog/TransistorEvolution";
import { HBMStackDiagram } from "@/components/blog/HBMStackDiagram";
import { GPUEvolution } from "@/components/blog/GPUEvolution";
import { DataCenterDiagram } from "@/components/blog/DataCenterDiagram";
import { InferenceFlow } from "@/components/blog/InferenceFlow";
import { ConsumptionModes } from "@/components/blog/ConsumptionModes";
import { LayerPipeline } from "@/components/blog/revradar/LayerPipeline";
import { ContextFunnel } from "@/components/blog/revradar/ContextFunnel";
import { ActionRoutingFlow } from "@/components/blog/revradar/ActionRoutingFlow";
import { RagPipeline } from "@/components/blog/revradar/RagPipeline";
import { TimelineLanes } from "@/components/blog/revradar/TimelineLanes";
import { ScoringBreakdown } from "@/components/blog/revradar/ScoringBreakdown";
import type { Metadata } from "next";

const mdxComponents = {
  PipelineDiagram,
  StageTable,
  ComparisonTable,
  CrmGapTable,
  SdkComparison,
  ComputeInsightCards,
  BottleneckTimeline,
  AllocationTable,
  Scorecard,
  SAPortfolioTable,
  VerdictBox,
  ComputeIndexTracker,
  ComputeIndexPerformance,
  EUVSupplyChain,
  TransistorEvolution,
  HBMStackDiagram,
  GPUEvolution,
  DataCenterDiagram,
  InferenceFlow,
  ConsumptionModes,
  LayerPipeline,
  ContextFunnel,
  ActionRoutingFlow,
  RagPipeline,
  TimelineLanes,
  ScoringBreakdown,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Jacob Lee`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline text-sm mb-8 inline-block"
      >
        &larr; Blog
      </Link>

      <article>
        <header className="mb-10">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-bold text-black dark:text-white leading-tight">
            {post.title}
          </h1>
        </header>

        {post.headings.length >= 3 && (
          <nav className="mb-10 space-y-1">
            {post.headings
              .filter((h) => h.level === 2)
              .map((h) => (
                <a
                  key={h.slug}
                  href={`#${h.slug}`}
                  className="block font-mono text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors leading-relaxed"
                >
                  {h.text}
                </a>
              ))}
          </nav>
        )}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    {
                      theme: {
                        dark: "github-dark",
                        light: "github-light",
                      },
                      keepBackground: true,
                    },
                  ],
                ],
              },
            }}
          />
        </div>
      </article>
    </div>
  );
}
