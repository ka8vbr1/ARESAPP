import { create } from 'zustand';
import { Group } from '@/types';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchGroups: () => Promise<void>;
  setCurrentGroup: (groupId: string) => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock data - would fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockGroups: Group[] = [
        {
          id: 'group1',
          name: 'Anytown ARES',
          region: 'Northeast',
          description: 'Serving Anytown and surrounding communities',
          adminIds: ['admin1'],
        },
        {
          id: 'group2',
          name: 'Metro City ARES',
          region: 'Midwest',
          description: 'Emergency communications for Metro City',
          adminIds: ['admin2'],
        },
        {
          id: 'group3',
          name: 'Coastal ARES',
          region: 'Southeast',
          description: 'Supporting coastal communities during emergencies',
          adminIds: ['admin3'],
        },
      ];
      
      set({ 
        groups: mockGroups, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch groups', 
        isLoading: false 
      });
    }
  },

  setCurrentGroup: (groupId) => {
    const { groups } = get();
    const group = groups.find(g => g.id === groupId);
    if (group) {
      set({ currentGroup: group });
    }
  },
}));