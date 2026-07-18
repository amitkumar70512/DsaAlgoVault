export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Status = 'Solved' | 'Learning' | 'Todo'
export type ProblemMeta = { slug: string; title: string; leetcode?: number; difficulty: Difficulty; pattern: string; algorithm: string; datastructure: string; companies: string[]; tags: string[]; status: Status; favorite: boolean; confidence: number; revision?: string; lastSolved?: string; timeComplexity?: string; spaceComplexity?: string; youtube?: string; resources?: { label: string; url: string }[] }
export type Problem = ProblemMeta & { body: string; readingTime: number }
export type Draft = Omit<ProblemMeta, 'slug'> & { slug: string; sections: Record<string, string>; code: Record<string, string> }
