import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, Calendar, Plus, Clock, MapPin, Edit, Trash } from 'lucide-react-native';
import { Event } from '@/types';

export default function EventsScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Redirect non-admin users
  useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      loadData();
    }
  }, []);

  const loadData = () => {
    // Mock events data
    const mockEvents: Event[] = [
      {
        id: 'event1',
        title: 'Weekly Net',
        description: 'Regular weekly net on the W1ABC repeater',
        startDate: Date.now() + 86400000, // Tomorrow
        endDate: Date.now() + 86400000 + 3600000, // 1 hour duration
        location: 'W1ABC Repeater',
        groupId: user?.groupId,
        createdBy: 'admin1',
      },
      {
        id: 'event2',
        title: 'Field Day Planning',
        description: 'Planning meeting for ARRL Field Day',
        startDate: Date.now() + 259200000, // 3 days from now
        endDate: Date.now() + 259200000 + 7200000, // 2 hours duration
        location: 'Community Center',
        groupId: user?.groupId,
        createdBy: 'admin1',
      },
      {
        id: 'event3',
        title: 'ARES Training',
        description: 'Monthly ARES training session',
        startDate: Date.now() + 604800000, // 1 week from now
        endDate: Date.now() + 604800000 + 10800000, // 3 hours duration
        location: 'Fire Station #3',
        groupId: user?.groupId,
        createdBy: 'admin1',
      },
      {
        id: 'event4',
        title: 'Emergency Exercise',
        description: 'Full-scale emergency communications exercise',
        startDate: Date.now() + 1209600000, // 2 weeks from now
        endDate: Date.now() + 1209600000 + 21600000, // 6 hours duration
        location: 'County EOC',
        groupId: user?.groupId,
        createdBy: 'admin1',
      },
    ];
    
    setEvents(mockEvents);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleCreateEvent = () => {
    router.push('/admin/create-event');
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/admin/edit-event?id=${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API
            setEvents(prev => prev.filter(e => e.id !== eventId));
            Alert.alert('Success', 'Event has been deleted');
          } 
        }
      ]
    );
  };

  const formatEventDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Manage Events',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Events</Text>
            <Text style={styles.subtitle}>
              Manage events for your ARES group
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateEvent}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {events.length > 0 ? (
            events.map(event => (
              <Card key={event.id} variant="elevated" style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditEvent(event.id)}
                    >
                      <Edit size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Trash size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.eventDescription}>{event.description}</Text>
                
                <View style={styles.eventDetailsContainer}>
                  <View style={styles.eventDetailRow}>
                    <Calendar size={16} color={colors.primary} style={styles.eventDetailIcon} />
                    <Text style={styles.eventDetailText}>
                      {formatEventDate(event.startDate)}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetailRow}>
                    <Clock size={16} color={colors.primary} style={styles.eventDetailIcon} />
                    <Text style={styles.eventDetailText}>
                      {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
                    </Text>
                  </View>
                  
                  {event.location && (
                    <View style={styles.eventDetailRow}>
                      <MapPin size={16} color={colors.primary} style={styles.eventDetailIcon} />
                      <Text style={styles.eventDetailText}>
                        {event.location}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No events found</Text>
            </Card>
          )}
        </ScrollView>
      </View>
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
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  eventDetailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailIcon: {
    marginRight: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.text,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});