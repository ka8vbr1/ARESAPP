import { create } from 'zustand';
import { Alert, AlertAcknowledgment } from '@/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAlerts: (groupId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string, userId: string, userName: string, userCallsign: string) => Promise<void>;
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => Promise<void>;
  registerForPushNotifications: () => Promise<string | null>;
  getAlertAcknowledgments: (alertId: string) => AlertAcknowledgment[] | undefined;
  getAcknowledgmentStats: (alertId: string) => { total: number; percentage: number };
  getCurrentStatusAlert: () => Alert | null;
  deleteAlert: (alertId: string) => Promise<void>;
}

// Configure notifications for non-web platforms
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  isLoading: false,
  error: null,

  fetchAlerts: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock data - would fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockAlerts: Alert[] = [
        {
          id: 'alert1',
          title: 'Weekly Net Reminder',
          message: 'Weekly net tonight at 7:30pm on the W1ABC repeater.',
          level: 'INFO',
          groupId,
          createdAt: Date.now() - 86400000, // 1 day ago
          createdBy: 'admin1',
          acknowledgments: [
            {
              userId: 'user1',
              userName: 'John Smith',
              userCallsign: 'W1ABC',
              timestamp: Date.now() - 80000000
            },
            {
              userId: 'user2',
              userName: 'Jane Doe',
              userCallsign: 'K2XYZ',
              timestamp: Date.now() - 70000000
            }
          ]
        },
        {
          id: 'alert2',
          title: 'Upcoming Training Exercise',
          message: 'Field training exercise this Saturday at City Park. Please RSVP.',
          level: 'DRILL',
          groupId,
          createdAt: Date.now() - 172800000, // 2 days ago
          createdBy: 'admin1',
          acknowledgments: [
            {
              userId: 'user1',
              userName: 'John Smith',
              userCallsign: 'W1ABC',
              timestamp: Date.now() - 160000000
            },
            {
              userId: 'user3',
              userName: 'Bob Johnson',
              userCallsign: 'N3DEF',
              timestamp: Date.now() - 150000000
            },
            {
              userId: 'user4',
              userName: 'Alice Williams',
              userCallsign: 'KD4GHI',
              timestamp: Date.now() - 140000000
            }
          ]
        },
      ];
      
      set({ 
        alerts: mockAlerts, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch alerts', 
        isLoading: false 
      });
    }
  },

  acknowledgeAlert: async (alertId, userId, userName, userCallsign) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would send acknowledgment to the server
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state to mark the alert as acknowledged by this user
      set(state => {
        const updatedAlerts = state.alerts.map(alert => {
          if (alert.id === alertId) {
            // Create a new acknowledgment
            const newAcknowledgment: AlertAcknowledgment = {
              userId,
              userName,
              userCallsign,
              timestamp: Date.now()
            };
            
            // Check if this user has already acknowledged
            const existingAcks = alert.acknowledgments || [];
            const userAlreadyAcknowledged = existingAcks.some(ack => ack.userId === userId);
            
            if (!userAlreadyAcknowledged) {
              return {
                ...alert,
                acknowledgments: [...existingAcks, newAcknowledgment]
              };
            }
          }
          return alert;
        });
        
        return { 
          alerts: updatedAlerts,
          isLoading: false 
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to acknowledge alert', 
        isLoading: false 
      });
    }
  },

  createAlert: async (alertData) => {
    set({ isLoading: true, error: null });
    try {
      // Mock creating an alert - would send to API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert: Alert = {
        ...alertData,
        id: `alert${Date.now()}`,
        createdAt: Date.now(),
        acknowledgments: []
      };
      
      set(state => ({ 
        alerts: [newAlert, ...state.alerts],
        isLoading: false 
      }));
      
      // Send push notification for the new alert
      if (Platform.OS !== 'web') {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: newAlert.title,
              body: newAlert.message,
              data: { alertId: newAlert.id },
            },
            trigger: null, // Send immediately
          });
        } catch (error) {
          console.log('Failed to schedule notification:', error);
        }
      }
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create alert', 
        isLoading: false 
      });
    }
  },
  
  registerForPushNotifications: async () => {
    // Skip push notifications on web
    if (Platform.OS === 'web') {
      console.log('Push notifications not supported on web');
      return null;
    }
    
    try {
      // Skip actual token registration to avoid projectId errors
      // Just simulate the process
      console.log('Simulating push notification registration');
      
      // Check permissions without requesting a token
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permissions');
        return null;
      }
      
      // Return a mock token instead of actually getting one
      // This avoids the projectId error
      return "ExponentPushToken[mock-token]";
      
    } catch (error) {
      console.error('Error setting up notifications:', error);
      return null;
    }
  },

  getAlertAcknowledgments: (alertId) => {
    const alert = get().alerts.find(a => a.id === alertId);
    return alert?.acknowledgments;
  },

  getAcknowledgmentStats: (alertId) => {
    const alert = get().alerts.find(a => a.id === alertId);
    const totalAcks = alert?.acknowledgments?.length || 0;
    
    // In a real app, you would get the total number of users in the group
    // For now, we'll use a mock total of 10 users
    const totalUsers = 10;
    const percentage = totalUsers > 0 ? Math.round((totalAcks / totalUsers) * 100) : 0;
    
    return {
      total: totalAcks,
      percentage
    };
  },

  getCurrentStatusAlert: () => {
    const alerts = get().alerts;
    if (alerts.length === 0) return null;

    // Priority order for levels (highest to lowest)
    const levelPriority = {
      'ACTIVATION': 4,
      'STANDBY': 3,
      'DRILL': 2,
      'INFO': 1
    };

    // Sort alerts by level priority (highest first) and then by creation date (newest first)
    const sortedAlerts = [...alerts].sort((a, b) => {
      const levelDiff = (levelPriority[b.level as keyof typeof levelPriority] || 0) - 
                        (levelPriority[a.level as keyof typeof levelPriority] || 0);
      
      if (levelDiff !== 0) return levelDiff;
      return b.createdAt - a.createdAt;
    });

    // Return the highest priority, most recent alert
    return sortedAlerts[0];
  },

  deleteAlert: async (alertId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock deleting an alert - would send to API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete alert',
        isLoading: false
      });
    }
  }
}));