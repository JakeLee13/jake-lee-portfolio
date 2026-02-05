// Mock embeddings data for 3D visualization
// Positions are designed to cluster semantically like real UMAP-reduced embeddings

export interface EmbeddingNode {
  id: string;
  label: string;
  category: 'blog' | 'project' | 'skill';
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

// Category colors (matching Tailwind aesthetic)
export const CATEGORY_COLORS = {
  blog: 0x3b82f6,    // blue-500
  project: 0x10b981, // green-500
  skill: 0xa855f7,   // purple-500
} as const;

// Mock embedding nodes with semantic clustering
export const embeddingNodes: EmbeddingNode[] = [
  // ML/AI Cluster (upper-right)
  {
    id: 'ml-1',
    label: 'Neural Networks',
    category: 'blog',
    position: [1.8, 1.2, 0.5],
    embedding: [0.9, 0.8, 0.3, 0.7, 0.2, 0.1, 0.4, 0.5],
    color: CATEGORY_COLORS.blog,
  },
  {
    id: 'ml-2',
    label: 'Deep Learning',
    category: 'blog',
    position: [2.0, 1.4, 0.3],
    embedding: [0.85, 0.82, 0.35, 0.72, 0.18, 0.12, 0.38, 0.48],
    color: CATEGORY_COLORS.blog,
  },
  {
    id: 'ml-3',
    label: 'PyTorch Projects',
    category: 'project',
    position: [1.6, 1.0, 0.7],
    embedding: [0.88, 0.75, 0.4, 0.65, 0.25, 0.15, 0.45, 0.52],
    color: CATEGORY_COLORS.project,
  },

  // Web Dev Cluster (left side)
  {
    id: 'web-1',
    label: 'React Development',
    category: 'skill',
    position: [-1.8, 0.5, 0.2],
    embedding: [0.2, 0.3, 0.85, 0.2, 0.7, 0.8, 0.3, 0.4],
    color: CATEGORY_COLORS.skill,
  },
  {
    id: 'web-2',
    label: 'TypeScript',
    category: 'skill',
    position: [-2.0, 0.3, 0.0],
    embedding: [0.15, 0.25, 0.88, 0.18, 0.75, 0.82, 0.28, 0.38],
    color: CATEGORY_COLORS.skill,
  },
  {
    id: 'web-3',
    label: 'Next.js Portfolio',
    category: 'project',
    position: [-1.6, 0.7, 0.4],
    embedding: [0.18, 0.28, 0.9, 0.22, 0.72, 0.78, 0.32, 0.42],
    color: CATEGORY_COLORS.project,
  },

  // Data Science Cluster (lower area)
  {
    id: 'data-1',
    label: 'Data Analysis',
    category: 'skill',
    position: [0.2, -1.8, -0.3],
    embedding: [0.5, 0.6, 0.2, 0.85, 0.3, 0.2, 0.75, 0.8],
    color: CATEGORY_COLORS.skill,
  },
  {
    id: 'data-2',
    label: 'Python & Pandas',
    category: 'skill',
    position: [0.5, -2.0, -0.5],
    embedding: [0.48, 0.58, 0.25, 0.88, 0.28, 0.22, 0.78, 0.82],
    color: CATEGORY_COLORS.skill,
  },
  {
    id: 'data-3',
    label: 'SQL Databases',
    category: 'project',
    position: [0.0, -1.6, -0.1],
    embedding: [0.45, 0.55, 0.3, 0.82, 0.35, 0.25, 0.72, 0.78],
    color: CATEGORY_COLORS.project,
  },

  // Teaching/Academic Cluster (upper-left)
  {
    id: 'teach-1',
    label: 'Teaching Assistant',
    category: 'blog',
    position: [-1.2, 1.5, -0.8],
    embedding: [0.3, 0.4, 0.15, 0.35, 0.4, 0.3, 0.2, 0.88],
    color: CATEGORY_COLORS.blog,
  },
  {
    id: 'teach-2',
    label: 'Statistics',
    category: 'skill',
    position: [-0.8, 1.8, -0.6],
    embedding: [0.52, 0.62, 0.2, 0.78, 0.32, 0.25, 0.68, 0.72],
    color: CATEGORY_COLORS.skill,
  },

  // Business Intelligence (center-right)
  {
    id: 'bi-1',
    label: 'Tableau & Domo',
    category: 'project',
    position: [0.8, 0.2, 1.5],
    embedding: [0.4, 0.5, 0.35, 0.7, 0.45, 0.4, 0.82, 0.75],
    color: CATEGORY_COLORS.project,
  },
  {
    id: 'bi-2',
    label: 'Data Visualization',
    category: 'blog',
    position: [1.0, 0.5, 1.3],
    embedding: [0.42, 0.52, 0.32, 0.68, 0.48, 0.38, 0.85, 0.78],
    color: CATEGORY_COLORS.blog,
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
  // Include high, medium, and some lower similarities for variety
  pairs.sort((a, b) => b.similarity - a.similarity);

  return [
    ...pairs.slice(0, 3),    // Top 3 highest
    ...pairs.slice(10, 13),  // Some medium
    ...pairs.slice(20, 22),  // Some lower
  ];
}

// Get node by ID
export function getNodeById(id: string): EmbeddingNode | undefined {
  return embeddingNodes.find(node => node.id === id);
}
