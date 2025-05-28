import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useGroupStore } from '@/store/group-store';
import { useAlertStore } from '@/store/alert-store';
import AlertBanner from '@/components/AlertBanner';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { Calendar, Bell, Info, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react-native';
import { Event, Alert } from '@/types';
import * as Notifications from 'expo-notifications';

// Set up notification handler
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

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { currentGroup, groups, fetchGroups, setCurrentGroup } = useGroupStore();
  const { alerts, fetchAlerts, registerForPushNotifications, getCurrentStatusAlert } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    loadData();
    
    // Set current group based on user's groupId
    if (user && user.groupId && groups.length > 0) {
      setCurrentGroup(user.groupId);
    }
    
    // Register for push notifications
    registerForPushNotificationsAsync();
    
    // Set up notification listeners
    setupNotificationListeners();
    
    // Clean up listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user, groups]);

  const loadData = async () => {
    await fetchGroups();
    if (user && user.groupId) {
      await fetchAlerts(user.groupId);
      fetchMockEvents();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const fetchMockEvents = () => {
    // Mock events data
    const events: Event[] = [
      {
        id: 'event1',
        title: 'Weekly Net',
        description: 'Regular weekly net on the W1ABC repeater',
        startDate: Date.now() + 86400000, // Tomorrow
        endDate: Date.now() + 86400000 + 3600000, // 1 hour duration
        location: 'W1ABC Repeater',
        groupId: user?.groupId || '',
        createdBy: 'admin1',
        attendees: [],
      },
      {
        id: 'event2',
        title: 'Field Day Planning',
        description: 'Planning meeting for ARRL Field Day',
        startDate: Date.now() + 259200000, // 3 days from now
        endDate: Date.now() + 259200000 + 7200000, // 2 hours duration
        location: 'Community Center',
        groupId: user?.groupId || '',
        createdBy: 'admin1',
        attendees: [],
      },
      {
        id: 'event3',
        title: 'ARES Training',
        description: 'Monthly ARES training session',
        startDate: Date.now() + 604800000, // 1 week from now
        endDate: Date.now() + 604800000 + 10800000, // 3 hours duration
        location: 'Fire Station #3',
        groupId: user?.groupId || '',
        createdBy: 'admin1',
        attendees: [],
      },
    ];
    
    setUpcomingEvents(events);
  };

  const formatEventDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAlertAcknowledge = (alertId: string) => {
    // In a real app, this would call the acknowledgeAlert function
    console.log('Alert acknowledged:', alertId);
  };
  
  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'web') {
      return;
    }
    
    const token = await registerForPushNotifications();
    if (token) {
      setExpoPushToken(token);
      console.log('Push token:', token);
      // In a real app, you would send this token to your backend
    }
  };
  
  const setupNotificationListeners = () => {
    if (Platform.OS === 'web') {
      return;
    }
    
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      const alertId = response.notification.request.content.data.alertId;
      if (alertId) {
        // Navigate to alert details
        router.push(`/alert-details?id=${alertId}`);
      }
    });
  };

  const getStatusColor = (level?: string) => {
    if (!level) return colors.info;
    
    switch (level) {
      case 'INFO':
        return colors.info;
      case 'DRILL':
        return colors.success;
      case 'STANDBY':
        return colors.warning;
      case 'ACTIVATION':
        return colors.error;
      default:
        return colors.info;
    }
  };

  const getStatusIcon = (level?: string) => {
    if (!level) return <Info size={24} color="white" />;
    
    switch (level) {
      case 'INFO':
        return <Info size={24} color="white" />;
      case 'DRILL':
        return <Bell size={24} color="white" />;
      case 'STANDBY':
        return <AlertCircle size={24} color="white" />;
      case 'ACTIVATION':
        return <AlertTriangle size={24} color="white" />;
      default:
        return <Info size={24} color="white" />;
    }
  };

  const handleStatusPress = () => {
    const currentStatusAlert = getCurrentStatusAlert();
    if (currentStatusAlert) {
      router.push(`/alert-details?id=${currentStatusAlert.id}`);
    } else {
      // If no current status alert, just show the activation status screen
      router.push('/activation-status');
    }
  };

  // Get the current status alert
  const currentStatusAlert = getCurrentStatusAlert();

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{user?.fullName || 'User'}</Text>
            <Text style={styles.callsignText}>{user?.callsign || 'N/A'}</Text>
          </View>
          <View style={styles.groupBadge}>
            <Text style={styles.groupText}>
              {currentGroup?.name || 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Activation Status Bar */}
        <TouchableOpacity 
          style={[
            styles.activationStatusBar,
            { backgroundColor: getStatusColor(currentStatusAlert?.level) }
          ]}
          onPress={handleStatusPress}
        >
          <View style={styles.activationStatusContent}>
            <View style={styles.activationStatusIconContainer}>
              {getStatusIcon(currentStatusAlert?.level)}
            </View>
            <View style={styles.activationStatusTextContainer}>
              <Text style={styles.activationStatusTitle}>
                {currentStatusAlert?.level || 'NORMAL'} STATUS
              </Text>
              {currentStatusAlert ? (
                <Text style={styles.activationStatusDetail} numberOfLines={1}>
                  {currentStatusAlert.title}
                </Text>
              ) : (
                <Text style={styles.activationStatusDetail}>
                  No active alerts
                </Text>
              )}
            </View>
            <ChevronRight size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Active Alerts</Text>
          </View>
          
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertBanner
                key={alert.id}
                alert={alert}
                onPress={() => router.push(`/alert-details?id=${alert.id}`)}
              />
            ))
          ) : (
            <Card variant="elevated" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No active alerts</Text>
            </Card>
          )}
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>
          
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <Card key={event.id} variant="elevated" style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventDate}>
                    {formatEventDate(event.startDate)}
                  </Text>
                  {event.location && (
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  )}
                </View>
              </Card>
            ))
          ) : (
            <Card variant="elevated" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No upcoming events</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  callsignText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  groupBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  groupText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  activationStatusBar: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activationStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activationStatusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activationStatusTextContainer: {
    flex: 1,
  },
  activationStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  activationStatusDetail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  eventDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});