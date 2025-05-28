import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlertStore } from '@/store/alert-store';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, CheckCircle, Clock, User, Users, Search } from 'lucide-react-native';
import { Alert as AlertType, AlertAcknowledgment } from '@/types';

export default function AlertAcknowledgmentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alerts, getAlertAcknowledgments, getAcknowledgmentStats } = useAlertStore();
  const { hasAdminRole } = useAuthStore();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [acknowledgments, setAcknowledgments] = useState<AlertAcknowledgment[]>([]);
  const [stats, setStats] = useState({ total: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }
    
    loadData();
  }, [id]);
  
  const loadData = () => {
    if (id) {
      setIsLoading(true);
      
      // Find the alert
      const foundAlert = alerts.find(a => a.id === id);
      if (foundAlert) {
        setAlert(foundAlert);
        
        // Get acknowledgments
        const acks = getAlertAcknowledgments(id) || [];
        setAcknowledgments(acks);
        
        // Get stats
        const alertStats = getAcknowledgmentStats(id);
        setStats(alertStats);
      } else {
        Alert.alert(
          'Error',
          'Alert not found',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
      
      setIsLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getAlertColor = (level?: string) => {
    if (!level) return colors.alertInfo;
    
    switch (level) {
      case 'INFO':
        return colors.alertInfo;
      case 'DRILL':
        return colors.alertDrill;
      case 'STANDBY':
        return colors.alertStandby;
      case 'ACTIVATION':
        return colors.alertActivation;
      default:
        return colors.alertInfo;
    }
  };
  
  if (!hasAdminRole()) {
    return null;
  }
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <Stack.Screen 
          options={{
            title: 'Acknowledgments',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading acknowledgments...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!alert) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <Stack.Screen 
          options={{
            title: 'Acknowledgments',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.container}>
          <Card variant="default" style={styles.notFoundCard}>
            <Text style={styles.notFoundText}>Alert not found</Text>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Acknowledgments',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Alert Acknowledgments</Text>
          <Text style={styles.subtitle}>
            Track who has acknowledged this alert
          </Text>
        </View>
        
        <Card variant="elevated" style={styles.alertCard}>
          <View 
            style={[
              styles.alertBadge, 
              { backgroundColor: getAlertColor(alert.level) }
            ]}
          >
            <Text style={styles.alertBadgeText}>{alert.level}</Text>
          </View>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertMessage} numberOfLines={2}>
            {alert.message}
          </Text>
        </Card>
        
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.statsTitle}>Response Statistics</Text>
          </View>
          
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Acknowledgments:</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Response Rate:</Text>
              <Text style={styles.statValue}>{stats.percentage}%</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${stats.percentage}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        <View style={styles.acknowledgementsSection}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Member Acknowledgments</Text>
          </View>
          
          {acknowledgments.length > 0 ? (
            acknowledgments.map((ack, index) => (
              <Card 
                key={`${ack.userId}-${index}`} 
                variant="default" 
                style={styles.acknowledgmentCard}
              >
                <View style={styles.acknowledgmentHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <User size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.userName}>{ack.userName}</Text>
                      <Text style={styles.userCallsign}>{ack.userCallsign}</Text>
                    </View>
                  </View>
                  <View style={styles.timestampContainer}>
                    <Clock size={14} color={colors.textSecondary} style={styles.timestampIcon} />
                    <Text style={styles.timestamp}>
                      {formatTimestamp(ack.timestamp)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <Card variant="default" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No acknowledgments yet</Text>
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  backButton: {
    padding: 8,
  },
  header: {
    marginBottom: 20,
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
  alertCard: {
    marginBottom: 16,
    padding: 16,
  },
  alertBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  alertBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  statsContent: {
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  acknowledgementsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  acknowledgmentCard: {
    marginBottom: 12,
    padding: 16,
  },
  acknowledgmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  userCallsign: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampIcon: {
    marginRight: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  notFoundCard: {
    alignItems: 'center',
    paddingVertical: 24,
    margin: 16,
  },
  notFoundText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});