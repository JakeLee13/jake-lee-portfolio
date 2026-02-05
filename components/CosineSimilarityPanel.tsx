'use client';

import { useEffect, useState } from 'react';
import { getInterestingSimilarityPairs, getNodeById, SimilarityPair } from '@/lib/embeddings-mock-data';

export default function CosineSimilarityPanel() {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [pairs, setPairs] = useState<SimilarityPair[]>([]);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Get interesting pairs on mount
    setPairs(getInterestingSimilarityPairs());
  }, []);

  useEffect(() => {
    if (pairs.length === 0) return;

    // Rotate through pairs every 4 seconds
    const interval = setInterval(() => {
      setFadeIn(false);

      // After fade out, change pair and fade in
      setTimeout(() => {
        setCurrentPairIndex((prev) => (prev + 1) % pairs.length);
        setFadeIn(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [pairs.length]);

  if (pairs.length === 0) return null;

  const currentPair = pairs[currentPairIndex];
  const node1 = getNodeById(currentPair.node1Id);
  const node2 = getNodeById(currentPair.node2Id);

  if (!node1 || !node2) return null;

  const similarityPercent = Math.round(currentPair.similarity * 100);

  return (
    <div className="absolute top-6 right-6 w-80">
      {/* Glass-morphism panel */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-5 shadow-2xl">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xs font-mono text-white/60 uppercase tracking-wider mb-1">
            Semantic Similarity
          </h3>
          <div className="font-mono text-[10px] text-white/40">
            cos(θ) = A · B / (||A|| ||B||)
          </div>
        </div>

        {/* Current pair display with fade animation */}
        <div
          className={`transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Node pair */}
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `#${node1.color.toString(16).padStart(6, '0')}` }}
              />
              <span className="text-white/90 text-sm font-medium">
                {node1.label}
              </span>
              <span className="text-white/40 text-xs ml-auto">
                {node1.category}
              </span>
            </div>

            <div className="flex justify-center text-white/40 text-lg">↔</div>

            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: `#${node2.color.toString(16).padStart(6, '0')}` }}
              />
              <span className="text-white/90 text-sm font-medium">
                {node2.label}
              </span>
              <span className="text-white/40 text-xs ml-auto">
                {node2.category}
              </span>
            </div>
          </div>

          {/* Similarity score */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-white/60 text-xs font-mono">Similarity</span>
              <span className="text-white font-mono text-2xl font-bold">
                {currentPair.similarity.toFixed(3)}
              </span>
            </div>

            {/* Visual bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${similarityPercent}%` }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-white/40 text-xs font-mono">
                {similarityPercent}%
              </span>
            </div>
          </div>

          {/* Embedding vectors preview (first 4 dimensions) */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-white/40 text-[10px] font-mono space-y-1">
              <div className="flex justify-between">
                <span>A:</span>
                <span>[{node1.embedding.slice(0, 4).map(v => v.toFixed(2)).join(', ')}, ...]</span>
              </div>
              <div className="flex justify-between">
                <span>B:</span>
                <span>[{node2.embedding.slice(0, 4).map(v => v.toFixed(2)).join(', ')}, ...]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-4 pt-3 border-t border-white/5">
          {pairs.slice(0, 8).map((_, index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === currentPairIndex % 8
                  ? 'bg-white/80 w-3'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
