import { create } from 'zustand';

interface LoadingState {
    loading: boolean;
    toggleLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    loading: false,
    toggleLoading: () => set((state) => ({ loading: !state.loading })),
}));

