import { create } from 'zustand';

export interface TestResult {
  careerName: string;
  matchPercentage: number;
  reasoning: string;
}

interface CareerStore {
  // Skill Test Results
  testResults: TestResult[];
  setTestResults: (results: TestResult[]) => void;
  
  // Career Comparison
  selectedCareers: string[];
  setSelectedCareers: (careerIds: string[]) => void;
  toggleCareerSelection: (careerId: string) => void;
  clearSelectedCareers: () => void;
}

export const useCareerStore = create<CareerStore>((set) => ({
  testResults: [],
  setTestResults: (results) => set({ testResults: results }),
  
  selectedCareers: [],
  setSelectedCareers: (careerIds) => set({ selectedCareers: careerIds }),
  toggleCareerSelection: (careerId) =>
    set((state) => {
      if (state.selectedCareers.includes(careerId)) {
        return {
          selectedCareers: state.selectedCareers.filter((id) => id !== careerId),
        };
      } else if (state.selectedCareers.length < 2) {
        return {
          selectedCareers: [...state.selectedCareers, careerId],
        };
      }
      return state;
    }),
  clearSelectedCareers: () => set({ selectedCareers: [] }),
}));
