// Mock embeddings data for 3D visualization
// Positions are designed to cluster semantically like real UMAP-reduced embeddings
// Based on Jake's actual interests and skills

export interface EmbeddingNode {
  id: string;
  label: string;
  category: 'professional' | 'outdoor' | 'lifestyle';
  position: [number, number, number]; // x, y, z coordinates
  embedding: number[]; // 8-dimensional mock embedding vector
  color: number; // Three.js color hex
}

export interface SimilarityPair {
  node1Id: string;
  node2Id: string;
  similarity: number;
}

// Cosine similarity calculation
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
}

// Category colors
export const CATEGORY_COLORS = {
  professional: 0x93c5fd,  // blue-300 - technical/work
  outdoor: 0x6ee7b7,       // green-300 - adventure sports
  lifestyle: 0xfbbf24,     // amber-400 - creative/personal
} as const;

// Embedding dimensions:
// [0] ML/AI Focus, [1] Classical ML, [2] Software Eng, [3] Data Infrastructure,
// [4] Statistical Theory, [5] Visualization/BI, [6] Outdoor/Physical, [7] Creative/Lifestyle

// Mock embedding nodes with semantic clustering
export const embeddingNodes: EmbeddingNode[] = [
  // ========== CENTRAL HUB ==========
  {
    id: 'center',
    label: 'Me',
    category: 'professional',
    position: [0, 0, 0],
    embedding: [0.5, 0.5, 0.3, 0.6, 0.7, 0.7, 0.1, 0.2],
    color: 0x000000, // black - central point
  },

  // ========== CLUSTER 1: Classical ML & Tree Methods (upper-right, tight cluster) ==========
  {
    id: 'xgboost',
    label: 'XGBoost',
    category: 'professional',
    position: [2.0, 1.5, 0.3],
    embedding: [0.4, 0.95, 0.3, 0.4, 0.5, 0.6, 0.05, 0.1],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'random-forests',
    label: 'Random Forests',
    category: 'professional',
    position: [1.9, 1.6, 0.4],
    embedding: [0.35, 0.93, 0.28, 0.38, 0.52, 0.58, 0.05, 0.08],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 2: Deep Learning & Modern AI (right-forward, separated) ==========
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    category: 'professional',
    position: [1.8, 1.1, 1.0],
    embedding: [0.92, 0.45, 0.48, 0.32, 0.36, 0.40, 0.05, 0.13],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'llm',
    label: 'Large Language Models',
    category: 'professional',
    position: [1.5, 0.8, 1.2],
    embedding: [0.95, 0.4, 0.5, 0.3, 0.35, 0.4, 0.05, 0.15],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'embeddings',
    label: 'Embeddings',
    category: 'professional',
    position: [1.6, 0.9, 1.3],
    embedding: [0.93, 0.42, 0.48, 0.31, 0.38, 0.43, 0.05, 0.12],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'ai',
    label: 'Artificial Intelligence',
    category: 'professional',
    position: [1.7, 1.0, 1.1],
    embedding: [0.90, 0.5, 0.45, 0.35, 0.38, 0.42, 0.06, 0.14],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 3: Python Data Science Core (lower-center, foundation) ==========
  {
    id: 'python',
    label: 'Python',
    category: 'professional',
    position: [0.3, -1.5, 0.2],
    embedding: [0.55, 0.65, 0.70, 0.60, 0.50, 0.55, 0.08, 0.15],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'pandas',
    label: 'Pandas',
    category: 'professional',
    position: [0.5, -1.6, 0.1],
    embedding: [0.45, 0.60, 0.65, 0.70, 0.48, 0.60, 0.06, 0.12],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'scikit-learn',
    label: 'Scikit-Learn',
    category: 'professional',
    position: [0.6, -1.4, 0.3],
    embedding: [0.48, 0.75, 0.60, 0.55, 0.52, 0.58, 0.06, 0.11],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'jupyter',
    label: 'Jupyter Notebooks',
    category: 'professional',
    position: [0.1, -1.4, 0.4],
    embedding: [0.42, 0.55, 0.72, 0.62, 0.46, 0.68, 0.08, 0.18],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 4: Statistical Theory (upper-left, academic) ==========
  {
    id: 'statistics',
    label: 'Statistics',
    category: 'professional',
    position: [-1.5, 1.8, -0.2],
    embedding: [0.30, 0.45, 0.20, 0.25, 0.95, 0.50, 0.05, 0.08],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'linear-algebra',
    label: 'Linear Algebra',
    category: 'professional',
    position: [-1.6, 1.9, -0.1],
    embedding: [0.40, 0.50, 0.25, 0.30, 0.92, 0.38, 0.04, 0.06],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'mathematics',
    label: 'Mathematics',
    category: 'professional',
    position: [-1.7, 2.0, 0.0],
    embedding: [0.35, 0.48, 0.22, 0.28, 0.94, 0.35, 0.05, 0.07],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'econometrics',
    label: 'Econometrics',
    category: 'professional',
    position: [-1.4, 1.7, -0.3],
    embedding: [0.25, 0.40, 0.18, 0.30, 0.90, 0.52, 0.06, 0.10],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'economics',
    label: 'Economics',
    category: 'professional',
    position: [-1.3, 1.6, -0.4],
    embedding: [0.20, 0.35, 0.22, 0.32, 0.85, 0.58, 0.08, 0.15],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'survival-analysis',
    label: 'Survival Analysis',
    category: 'professional',
    position: [-1.2, 1.5, -0.2],
    embedding: [0.32, 0.52, 0.24, 0.35, 0.88, 0.55, 0.05, 0.09],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'uncertainty',
    label: 'Uncertainty Estimates',
    category: 'professional',
    position: [-1.4, 1.65, -0.15],
    embedding: [0.35, 0.48, 0.26, 0.33, 0.89, 0.53, 0.05, 0.08],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 5: Data Engineering & Infrastructure (back-center) ==========
  {
    id: 'mysql',
    label: 'MySQL',
    category: 'professional',
    position: [0.2, -0.5, -1.5],
    embedding: [0.15, 0.25, 0.55, 0.90, 0.30, 0.45, 0.05, 0.10],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'redshift',
    label: 'Redshift',
    category: 'professional',
    position: [0.3, -0.4, -1.6],
    embedding: [0.18, 0.28, 0.52, 0.92, 0.32, 0.48, 0.05, 0.09],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'data-engineering',
    label: 'Data Engineering',
    category: 'professional',
    position: [0.1, -0.6, -1.4],
    embedding: [0.22, 0.32, 0.65, 0.88, 0.35, 0.50, 0.06, 0.11],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 6: Business Intelligence & Interpretation (center-forward) ==========
  {
    id: 'domo',
    label: 'Domo',
    category: 'professional',
    position: [0.8, 0.3, 1.3],
    embedding: [0.20, 0.35, 0.45, 0.55, 0.38, 0.85, 0.08, 0.20],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'matplotlib',
    label: 'Matplotlib',
    category: 'professional',
    position: [0.5, 0.1, 1.4],
    embedding: [0.35, 0.48, 0.68, 0.50, 0.42, 0.82, 0.07, 0.16],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    category: 'professional',
    position: [0.4, 0.0, 1.0],
    embedding: [0.42, 0.58, 0.52, 0.62, 0.58, 0.82, 0.07, 0.15],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 7: Web Development Stack (left side) ==========
  {
    id: 'react',
    label: 'React',
    category: 'professional',
    position: [-1.8, 0.3, 0.5],
    embedding: [0.25, 0.20, 0.90, 0.45, 0.22, 0.48, 0.08, 0.22],
    color: CATEGORY_COLORS.professional,
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    category: 'professional',
    position: [-1.9, 0.4, 0.6],
    embedding: [0.28, 0.22, 0.92, 0.48, 0.20, 0.50, 0.09, 0.24],
    color: CATEGORY_COLORS.professional,
  },

  // ========== SPECIAL BRIDGE CONCEPTS ==========
  {
    id: 'graph-theory',
    label: 'Graph Theory',
    category: 'professional',
    position: [-0.8, 1.2, 0.3],
    embedding: [0.48, 0.52, 0.38, 0.42, 0.82, 0.45, 0.06, 0.10],
    color: CATEGORY_COLORS.professional,
  },

  // ========== CLUSTER 8: Outdoor Adventure Sports (lower-right-back) ==========
  {
    id: 'skiing',
    label: 'Skiing',
    category: 'outdoor',
    position: [1.2, -1.3, -1.0],
    embedding: [0.05, 0.08, 0.10, 0.08, 0.12, 0.15, 0.92, 0.35],
    color: CATEGORY_COLORS.outdoor,
  },
  {
    id: 'snowboarding',
    label: 'Snowboarding',
    category: 'outdoor',
    position: [1.3, -1.4, -1.1],
    embedding: [0.05, 0.08, 0.12, 0.09, 0.10, 0.14, 0.90, 0.38],
    color: CATEGORY_COLORS.outdoor,
  },
  {
    id: 'mountain-biking',
    label: 'Mountain Biking',
    category: 'outdoor',
    position: [1.4, -1.2, -0.9],
    embedding: [0.06, 0.09, 0.11, 0.10, 0.11, 0.16, 0.88, 0.40],
    color: CATEGORY_COLORS.outdoor,
  },
  {
    id: 'rock-climbing',
    label: 'Rock Climbing',
    category: 'outdoor',
    position: [1.35, -1.35, -1.05],
    embedding: [0.06, 0.08, 0.10, 0.09, 0.13, 0.17, 0.89, 0.42],
    color: CATEGORY_COLORS.outdoor,
  },
  {
    id: 'trail-running',
    label: 'Trail Running',
    category: 'outdoor',
    position: [1.25, -1.25, -0.95],
    embedding: [0.07, 0.10, 0.11, 0.10, 0.14, 0.18, 0.87, 0.38],
    color: CATEGORY_COLORS.outdoor,
  },
  {
    id: 'surfing',
    label: 'Surfing',
    category: 'outdoor',
    position: [1.5, -1.5, -1.2],
    embedding: [0.05, 0.07, 0.09, 0.08, 0.10, 0.16, 0.85, 0.45],
    color: CATEGORY_COLORS.outdoor,
  },

  // ========== CLUSTER 9: Lifestyle & Location (near outdoor but distinct) ==========
  {
    id: 'utah',
    label: 'Utah',
    category: 'lifestyle',
    position: [1.1, -1.6, -1.3],
    embedding: [0.08, 0.10, 0.12, 0.11, 0.15, 0.20, 0.75, 0.62],
    color: CATEGORY_COLORS.lifestyle,
  },
  {
    id: 'slc',
    label: 'Salt Lake City',
    category: 'lifestyle',
    position: [1.0, -1.65, -1.35],
    embedding: [0.09, 0.11, 0.14, 0.13, 0.16, 0.22, 0.72, 0.65],
    color: CATEGORY_COLORS.lifestyle,
  },
  {
    id: 'coffee',
    label: 'Coffee',
    category: 'lifestyle',
    position: [0.3, -1.0, -1.5],
    embedding: [0.10, 0.12, 0.15, 0.14, 0.12, 0.25, 0.35, 0.85],
    color: CATEGORY_COLORS.lifestyle,
  },
  {
    id: 'traveling',
    label: 'Traveling',
    category: 'lifestyle',
    position: [0.8, -1.4, -1.4],
    embedding: [0.12, 0.14, 0.18, 0.16, 0.18, 0.30, 0.65, 0.78],
    color: CATEGORY_COLORS.lifestyle,
  },
  {
    id: 'film-photography',
    label: 'Film Photography',
    category: 'lifestyle',
    position: [0.5, -0.9, -1.6],
    embedding: [0.15, 0.18, 0.25, 0.20, 0.22, 0.48, 0.30, 0.88],
    color: CATEGORY_COLORS.lifestyle,
  },

  // ========== Business Strategy (bridge between technical and business) ==========
  {
    id: 'business-strategy',
    label: 'Business Strategy',
    category: 'professional',
    position: [-0.5, 0.8, 0.8],
    embedding: [0.22, 0.30, 0.38, 0.45, 0.55, 0.72, 0.12, 0.35],
    color: CATEGORY_COLORS.professional,
  },
];

// Pre-calculate interesting similarity pairs for display
export function getInterestingSimilarityPairs(): SimilarityPair[] {
  const pairs: SimilarityPair[] = [];

  // Calculate all similarities
  for (let i = 0; i < embeddingNodes.length; i++) {
    for (let j = i + 1; j < embeddingNodes.length; j++) {
      const similarity = cosineSimilarity(
        embeddingNodes[i].embedding,
        embeddingNodes[j].embedding
      );

      pairs.push({
        node1Id: embeddingNodes[i].id,
        node2Id: embeddingNodes[j].id,
        similarity,
      });
    }
  }

  // Sort by similarity and return top interesting ones
  pairs.sort((a, b) => b.similarity - a.similarity);

  return [
    ...pairs.slice(0, 5),    // Top 5 highest similarities
    ...pairs.slice(15, 20),  // Some medium similarities
    ...pairs.slice(30, 33),  // Some lower similarities
  ];
}

// Get node by ID
export function getNodeById(id: string): EmbeddingNode | undefined {
  return embeddingNodes.find(node => node.id === id);
}
