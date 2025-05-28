import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Role-based permission helpers
  hasAdminRole: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock login for now - would connect to backend
          if (email === 'demo@example.com' && password === 'password') {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockUser: User = {
              id: '1',
              fullName: 'Demo User',
              callsign: 'W1AW',
              email: 'demo@example.com',
              phone: '555-123-4567',
              address: '123 Main St, Anytown, USA',
              licenseClass: 'General',
              groupId: 'group1',
              roles: ['Member'],
              approved: true,
              createdAt: Date.now(),
              lastActive: Date.now(),
            };
            
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else if (email === 'ec@example.com' && password === 'password') {
            // EC role login
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockECUser: User = {
              id: '2',
              fullName: 'EC User',
              callsign: 'K1EC',
              email: 'ec@example.com',
              phone: '555-987-6543',
              address: '456 Oak St, Anytown, USA',
              licenseClass: 'Amateur Extra',
              groupId: 'group1',
              roles: ['EC', 'Admin'],
              approved: true,
              createdAt: Date.now(),
              lastActive: Date.now(),
            };
            
            set({ 
              user: mockECUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else if (email === 'aec@example.com' && password === 'password') {
            // AEC role login
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockAECUser: User = {
              id: '3',
              fullName: 'AEC User',
              callsign: 'K1AEC',
              email: 'aec@example.com',
              phone: '555-456-7890',
              address: '789 Pine St, Anytown, USA',
              licenseClass: 'Amateur Extra',
              groupId: 'group1',
              roles: ['AEC'],
              approved: true,
              createdAt: Date.now(),
              lastActive: Date.now(),
            };
            
            set({ 
              user: mockAECUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else if (email === 'admin@example.com' && password === 'admin123') {
            // Default admin account
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const defaultAdmin: User = {
              id: 'admin1',
              fullName: 'System Administrator',
              callsign: 'W1SYS',
              email: 'admin@example.com',
              phone: '555-000-0000',
              address: '1 Admin Plaza, Anytown, USA',
              licenseClass: 'Amateur Extra',
              groupId: 'group1',
              roles: ['EC', 'Admin'],
              approved: true,
              createdAt: Date.now() - 31536000000, // 1 year ago
              lastActive: Date.now(),
            };
            
            set({ 
              user: defaultAdmin, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else if (email === 'admin' && password === 'admin') {
            // Super simple admin account for testing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const simpleAdmin: User = {
              id: 'admin2',
              fullName: 'Admin User',
              callsign: 'W1ADM',
              email: 'admin@ares.org',
              phone: '555-111-1111',
              address: '1 Admin St, Anytown, USA',
              licenseClass: 'Amateur Extra',
              groupId: 'group1',
              roles: ['EC', 'Admin'],
              approved: true,
              createdAt: Date.now() - 31536000000, // 1 year ago
              lastActive: Date.now(),
            };
            
            set({ 
              user: simpleAdmin, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration - would connect to backend
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, we would send the data to the backend
          // and get a response with the created user
          
          set({ 
            isLoading: false,
            // Don't authenticate yet - admin approval required
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed', 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      clearError: () => {
        set({ error: null });
      },
      
      // Helper to check if user has admin privileges (EC, AEC, or Admin role)
      hasAdminRole: () => {
        const { user } = get();
        if (!user) return false;
        return user.roles.some(role => ['EC', 'AEC', 'Admin'].includes(role));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);