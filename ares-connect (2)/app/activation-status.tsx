import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlertStore } from '@/store/alert-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { AlertTriangle, Bell, Info, AlertCircle, ArrowLeft } from 'lucide-react-native';

export default function ActivationStatusScreen() {
  const { getCurrentStatusAlert } = useAlertStore();
  
  // Get the current status alert
  const currentStatusAlert = getCurrentStatusAlert();
  
  const getLevelColor = (level: string) => {
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
  
  const getLevelIcon = (level: string) => {
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleViewAlertDetails = () => {
    if (currentStatusAlert) {
      router.push(`/alert-details?id=${currentStatusAlert.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Activation Status',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Current Activation Status</Text>
        
        <Card 
          variant="elevated" 
          style={[
            styles.statusCard,
            currentStatusAlert && { backgroundColor: getLevelColor(currentStatusAlert.level) }
          ]}
        >
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              {currentStatusAlert 
                ? getLevelIcon(currentStatusAlert.level)
                : <Info size={24} color="white" />
              }
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>
                {currentStatusAlert ? currentStatusAlert.level : 'NORMAL'} STATUS
              </Text>
              {currentStatusAlert ? (
                <Text style={styles.statusDescription}>
                  {currentStatusAlert.title}
                </Text>
              ) : (
                <Text style={styles.statusDescription}>
                  No active emergencies. Normal operations.
                </Text>
              )}
            </View>
          </View>
          
          {currentStatusAlert && (
            <>
              <View style={styles.divider} />
              <Text style={styles.statusMessage}>
                {currentStatusAlert.message}
              </Text>
              <Text style={styles.statusTimestamp}>
                Last updated: {formatDate(currentStatusAlert.createdAt)}
              </Text>
              
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={handleViewAlertDetails}
              >
                <Text style={styles.detailsButtonText}>View Alert Details</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Activation Levels</Text>
          
          <Card variant="default" style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: colors.alertInfo }]}>
                <Info size={20} color="white" />
              </View>
              <Text style={styles.infoLevel}>INFO</Text>
            </View>
            <Text style={styles.infoDescription}>
              Normal operations. Routine information and announcements.
            </Text>
          </Card>
          
          <Card variant="default" style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: colors.alertDrill }]}>
                <Bell size={20} color="white" />
              </View>
              <Text style={styles.infoLevel}>DRILL</Text>
            </View>
            <Text style={styles.infoDescription}>
              Training exercise or scheduled drill. Not an actual emergency.
            </Text>
          </Card>
          
          <Card variant="default" style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: colors.alertStandby }]}>
                <AlertCircle size={20} color="white" />
              </View>
              <Text style={styles.infoLevel}>STANDBY</Text>
            </View>
            <Text style={styles.infoDescription}>
              Potential emergency developing. Be prepared for possible activation.
            </Text>
          </Card>
          
          <Card variant="default" style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: colors.alertActivation }]}>
                <AlertTriangle size={20} color="white" />
              </View>
              <Text style={styles.infoLevel}>ACTIVATION</Text>
            </View>
            <Text style={styles.infoDescription}>
              Emergency activation. All members should respond according to the emergency plan.
            </Text>
          </Card>
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statusCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusMessage: {
    fontSize: 16,
    color: 'white',
    padding: 16,
    paddingBottom: 8,
  },
  statusTimestamp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  infoSection: {
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  infoLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});