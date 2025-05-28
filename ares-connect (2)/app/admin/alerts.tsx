import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  Alert as RNAlert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import AlertBanner from '@/components/AlertBanner';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, Bell, Plus, Users, CheckCircle } from 'lucide-react-native';

export default function AlertsScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const { alerts, fetchAlerts, getAcknowledgmentStats, deleteAlert } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!hasAdminRole()) {
      RNAlert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (user) {
      await fetchAlerts(user.groupId);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAlertPress = (alertId: string) => {
    router.push(`/admin/edit-alert?id=${alertId}`);
  };

  const handleCreateAlert = () => {
    router.push('/admin/create-alert');
  };

  const handleDeleteAlert = (alertId: string) => {
    RNAlert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAlert(alertId);
              RNAlert.alert('Success', 'Alert has been deleted');
            } catch (error) {
              RNAlert.alert('Error', 'Failed to delete alert');
            }
          } 
        }
      ]
    );
  };

  const handleViewAcknowledgments = (alertId: string) => {
    router.push(`/admin/alert-acknowledgments?id=${alertId}`);
  };

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Manage Alerts',
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
            <Text style={styles.title}>Alerts</Text>
            <Text style={styles.subtitle}>
              Manage alerts for your ARES group
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateAlert}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create Alert</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Active Alerts</Text>
            </View>
            
            {alerts.length > 0 ? (
              alerts.map(alert => {
                const stats = getAcknowledgmentStats(alert.id);
                
                return (
                  <View key={alert.id} style={styles.alertContainer}>
                    <AlertBanner
                      alert={alert}
                      onPress={() => handleAlertPress(alert.id)}
                    />
                    
                    <View style={styles.alertActions}>
                      <TouchableOpacity 
                        style={styles.acknowledgementsButton}
                        onPress={() => handleViewAcknowledgments(alert.id)}
                      >
                        <View style={styles.ackButtonContent}>
                          <CheckCircle size={16} color={colors.primary} />
                          <Text style={styles.acknowledgementsText}>
                            {stats.total} Acknowledgments ({stats.percentage}%)
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAlert(alert.id)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Card variant="default" style={styles.emptyCard}>
                <Text style={styles.emptyText}>No active alerts</Text>
              </Card>
            )}
          </View>
          
          <Text style={styles.infoText}>
            Creating a new alert with a higher level (STANDBY or ACTIVATION) will automatically 
            update the group's activation status.
          </Text>
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
  alertContainer: {
    marginBottom: 12,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  acknowledgementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  ackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acknowledgementsText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '500',
    fontSize: 14,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});