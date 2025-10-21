import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ContentMode = 'blog' | 'social' | 'video' | 'email' | 'sales';
export type Platform = 'linkedin' | 'twitter' | 'facebook' | 'instagram';
export type Tone = 'professional' | 'casual' | 'persuasive' | 'friendly';
export type TargetLength = 'short' | 'medium' | 'long';

interface GeneratedContent {
  content: string;
  wordCount: number;
  charCount: number;
  readingTime: number;
  timestamp: Date;
  mode: ContentMode;
  platforms?: Platform[];
}

interface ContentState {
  // Mode & Settings
  activeMode: ContentMode;
  prompt: string;
  tone: Tone;
  targetLength: TargetLength;
  charLimit: number;
  selectedPlatforms: Platform[];
  
  // Generation State
  isGenerating: boolean;
  generationProgress: number;
  generatedContent: GeneratedContent | null;
  error: string | null;
  
  // UI State
  showPreview: boolean;
  showSuccess: boolean;
  
  // Actions
  setActiveMode: (mode: ContentMode) => void;
  setPrompt: (prompt: string) => void;
  setTone: (tone: Tone) => void;
  setTargetLength: (length: TargetLength) => void;
  setCharLimit: (limit: number) => void;
  togglePlatform: (platform: Platform) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: number | ((prev: number) => number)) => void;
  setGeneratedContent: (content: GeneratedContent | null) => void;
  setError: (error: string | null) => void;
  setShowSuccess: (show: boolean) => void;
  reset: () => void;
}

const initialState = {
  activeMode: 'blog' as ContentMode,
  prompt: '',
  tone: 'professional' as Tone,
  targetLength: 'medium' as TargetLength,
  charLimit: 280,
  selectedPlatforms: [] as Platform[],
  isGenerating: false,
  generationProgress: 0,
  generatedContent: null,
  error: null,
  showPreview: true,
  showSuccess: false,
};

export const useContentStore = create<ContentState>()(
  devtools(
    (set) => ({
      ...initialState,

      setActiveMode: (mode) => set({ activeMode: mode, selectedPlatforms: [] }),
      
      setPrompt: (prompt) => set({ prompt }),
      
      setTone: (tone) => set({ tone }),
      
      setTargetLength: (length) => set({ targetLength: length }),
      
      setCharLimit: (limit) => set({ charLimit: limit }),
      
      togglePlatform: (platform) =>
        set((state) => ({
          selectedPlatforms: state.selectedPlatforms.includes(platform)
            ? state.selectedPlatforms.filter((p) => p !== platform)
            : [...state.selectedPlatforms, platform],
        })),
      
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      
      setGenerationProgress: (progress) => 
        set((state) => ({ 
          generationProgress: typeof progress === 'function' ? progress(state.generationProgress) : progress 
        })),
      
      setGeneratedContent: (content) => set({ generatedContent: content }),
      
      setError: (error) => set({ error }),
      
      setShowSuccess: (show) => set({ showSuccess: show }),
      
      reset: () => set(initialState),
    }),
    { name: 'ContentStore' }
  )
);
