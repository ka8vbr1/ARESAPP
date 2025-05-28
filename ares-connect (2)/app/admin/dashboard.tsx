import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { 
  Users, 
  Bell, 
  Calendar, 
  ChevronRight,
  UserCheck,
  UserX,
  FileText,
  ArrowLeft
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalMembers: 0,
    pendingMembers: 0,
    activeAlerts: 0,
    upcomingEvents: 0
  });

  // Redirect non-admin users
  React.useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access the admin portal.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/admin') }]
      );
    } else {
      loadData();
    }
  }, []);

  const loadData = () => {
    // Mock data loading
    setStats({
      totalMembers: 24,
      pendingMembers: 3,
      activeAlerts: 2,
      upcomingEvents: 5
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const navigateTo = (route: string) => {
    router.push(route);
  };

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Admin Portal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/(tabs)/admin')} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>
            Manage your ARES group
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/members')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/pending-members')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <UserCheck size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.pendingMembers}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/alerts')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Bell size={24} color={colors.error} />
            </View>
            <Text style={styles.statValue}>{stats.activeAlerts}</Text>
            <Text style={styles.statLabel}>Active Alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/events')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Calendar size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.upcomingEvents}</Text>
            <Text style={styles.statLabel}>Upcoming Events</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Card variant="elevated" style={styles.actionsCard}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/create-alert')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Bell size={20} color={colors.error} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Create Alert</Text>
                <Text style={styles.actionDescription}>
                  Send notifications to group members
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/create-event')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Calendar size={20} color={colors.success} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Create Event</Text>
                <Text style={styles.actionDescription}>
                  Schedule training or meetings
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/upload-document')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                <FileText size={20} color={colors.info} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Upload Document</Text>
                <Text style={styles.actionDescription}>
                  Add forms, SOPs, or resources
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <Text style={styles.sectionTitle}>Management</Text>

        <Card variant="elevated" style={styles.actionsCard}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/members')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                <Users size={20} color={colors.primary} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Manage Members</Text>
                <Text style={styles.actionDescription}>
                  View and edit member information
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/pending-members')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <UserX size={20} color={colors.warning} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Pending Approvals</Text>
                <Text style={styles.actionDescription}>
                  Review and approve new members
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/alerts')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Bell size={20} color={colors.error} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Manage Alerts</Text>
                <Text style={styles.actionDescription}>
                  View, edit, or cancel alerts
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigateTo('/admin/events')}
          >
            <View style={styles.actionContent}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Calendar size={20} color={colors.success} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Manage Events</Text>
                <Text style={styles.actionDescription}>
                  View, edit, or cancel events
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
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
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  header: {
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  actionsCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
});