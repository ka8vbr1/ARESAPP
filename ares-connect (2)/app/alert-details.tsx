import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlertStore } from '@/store/alert-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { AlertTriangle, Bell, Info, AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react-native';
import { Alert as AlertType } from '@/types';

export default function AlertDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { alerts, acknowledgeAlert } = useAlertStore();
  const { user } = useAuthStore();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      const foundAlert = alerts.find(a => a.id === id);
      if (foundAlert) {
        setAlert(foundAlert);
        
        // Check if current user has already acknowledged this alert
        if (user && foundAlert.acknowledgments) {
          const userAcknowledged = foundAlert.acknowledgments.some(
            ack => ack.userId === user.id
          );
          setAcknowledged(userAcknowledged);
        }
      }
    }
  }, [id, alerts, user]);
  
  const handleAcknowledge = async () => {
    if (alert && user) {
      await acknowledgeAlert(
        alert.id, 
        user.id, 
        user.fullName, 
        user.callsign
      );
      setAcknowledged(true);
    }
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
  
  const getAlertIcon = (level?: string) => {
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
  
  if (!alert) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <Stack.Screen 
          options={{
            title: 'Alert Details',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        <View style={styles.container}>
          <Card variant="outlined" style={styles.notFoundCard}>
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
          title: 'Alert Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.alertHeader, { backgroundColor: getAlertColor(alert.level) }]}>
          <View style={styles.alertIconContainer}>
            {getAlertIcon(alert.level)}
          </View>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <View style={styles.alertLevelBadge}>
            <Text style={styles.alertLevelText}>{alert.level}</Text>
          </View>
        </View>
        
        <Card variant="elevated" style={styles.detailsCard}>
          <Text style={styles.messageTitle}>Message:</Text>
          <Text style={styles.messageText}>{alert.message}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} style={styles.metaIcon} />
              <Text style={styles.metaText}>
                {new Date(alert.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>
        
        {!acknowledged ? (
          <Button
            title="Acknowledge Alert"
            onPress={handleAcknowledge}
            style={styles.acknowledgeButton}
          />
        ) : (
          <View style={styles.acknowledgedContainer}>
            <CheckCircle size={20} color={colors.success} style={styles.acknowledgedIcon} />
            <Text style={styles.acknowledgedText}>Alert Acknowledged</Text>
          </View>
        )}
        
        {alert.level === 'ACTIVATION' && (
          <Card variant="elevated" style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>
              1. Check your equipment and ensure it is operational
            </Text>
            <Text style={styles.instructionsText}>
              2. Monitor the primary repeater frequency
            </Text>
            <Text style={styles.instructionsText}>
              3. Await further instructions from the EC or AEC
            </Text>
            <Text style={styles.instructionsText}>
              4. Do not self-deploy unless specifically instructed
            </Text>
          </Card>
        )}
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
  alertHeader: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertLevelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  alertLevelText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsCard: {
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaIcon: {
    marginRight: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  acknowledgeButton: {
    marginBottom: 16,
  },
  acknowledgedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  acknowledgedIcon: {
    marginRight: 8,
  },
  acknowledgedText: {
    fontSize: 16,
    color: colors.success,
    fontWeight: '500',
  },
  instructionsCard: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
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