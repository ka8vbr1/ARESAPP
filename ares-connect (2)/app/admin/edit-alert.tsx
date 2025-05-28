import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, Save, Trash2, AlertTriangle, Info, Bell, CheckCircle, Users } from 'lucide-react-native';
import { Alert as AlertType } from '@/types';

type AlertLevel = 'INFO' | 'DRILL' | 'STANDBY' | 'ACTIVATION';

export default function EditAlertScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, hasAdminRole } = useAuthStore();
  const { alerts, getAcknowledgmentStats } = useAlertStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState<AlertLevel>('INFO');
  const [acknowledgmentStats, setAcknowledgmentStats] = useState({ total: 0, percentage: 0 });

  // Redirect non-admin users
  useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      loadAlertData();
    }
  }, [id]);

  const loadAlertData = () => {
    const foundAlert = alerts.find(a => a.id === id);
    
    if (foundAlert) {
      setAlert(foundAlert);
      setTitle(foundAlert.title);
      setMessage(foundAlert.message);
      setLevel(foundAlert.level);
      
      // Get acknowledgment stats
      const stats = getAcknowledgmentStats(foundAlert.id);
      setAcknowledgmentStats(stats);
    } else {
      Alert.alert(
        'Error',
        'Alert not found',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleUpdateAlert = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the alert');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message for the alert');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to update alerts');
      return;
    }

    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the alert in the backend
      
      Alert.alert(
        'Success',
        'Alert has been updated',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update alert. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this alert? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                'Success',
                'Alert has been deleted',
                [{ text: 'OK', onPress: () => router.back() }]
              );
              
            } catch (error) {
              Alert.alert('Error', 'Failed to delete alert');
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleViewAcknowledgments = () => {
    router.push(`/admin/alert-acknowledgments?id=${id}`);
  };

  const getLevelColor = (alertLevel: AlertLevel) => {
    switch (alertLevel) {
      case 'INFO':
        return colors.info;
      case 'DRILL':
        return colors.success;
      case 'STANDBY':
        return colors.warning;
      case 'ACTIVATION':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  if (!hasAdminRole() || !alert) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Edit Alert',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Edit Alert</Text>
        <Text style={styles.subHeaderText}>
          Update alert information
        </Text>
        
        <TouchableOpacity 
          style={styles.acknowledgmentsCard}
          onPress={handleViewAcknowledgments}
        >
          <View style={styles.acknowledgmentsHeader}>
            <CheckCircle size={20} color={colors.primary} />
            <Text style={styles.acknowledgmentsTitle}>Acknowledgments</Text>
          </View>
          <View style={styles.acknowledgmentsStats}>
            <Text style={styles.acknowledgmentsCount}>
              {acknowledgmentStats.total} members acknowledged
            </Text>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${acknowledgmentStats.percentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.acknowledgmentsPercentage}>
              {acknowledgmentStats.percentage}% response rate
            </Text>
          </View>
          <View style={styles.viewDetailsButton}>
            <Users size={16} color={colors.primary} />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.formSection}>
          <Text style={styles.label}>Alert Level</Text>
          <View style={styles.levelSelector}>
            <TouchableOpacity 
              style={[
                styles.levelOption, 
                level === 'INFO' && styles.selectedLevel,
                level === 'INFO' && { borderColor: getLevelColor('INFO') }
              ]}
              onPress={() => setLevel('INFO')}
            >
              <Info size={20} color={level === 'INFO' ? getLevelColor('INFO') : colors.textSecondary} />
              <Text 
                style={[
                  styles.levelText, 
                  level === 'INFO' && { color: getLevelColor('INFO') }
                ]}
              >
                Info
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.levelOption, 
                level === 'DRILL' && styles.selectedLevel,
                level === 'DRILL' && { borderColor: getLevelColor('DRILL') }
              ]}
              onPress={() => setLevel('DRILL')}
            >
              <Bell size={20} color={level === 'DRILL' ? getLevelColor('DRILL') : colors.textSecondary} />
              <Text 
                style={[
                  styles.levelText, 
                  level === 'DRILL' && { color: getLevelColor('DRILL') }
                ]}
              >
                Drill
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.levelOption, 
                level === 'STANDBY' && styles.selectedLevel,
                level === 'STANDBY' && { borderColor: getLevelColor('STANDBY') }
              ]}
              onPress={() => setLevel('STANDBY')}
            >
              <AlertTriangle size={20} color={level === 'STANDBY' ? getLevelColor('STANDBY') : colors.textSecondary} />
              <Text 
                style={[
                  styles.levelText, 
                  level === 'STANDBY' && { color: getLevelColor('STANDBY') }
                ]}
              >
                Standby
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.levelOption, 
                level === 'ACTIVATION' && styles.selectedLevel,
                level === 'ACTIVATION' && { borderColor: getLevelColor('ACTIVATION') }
              ]}
              onPress={() => setLevel('ACTIVATION')}
            >
              <AlertTriangle size={20} color={level === 'ACTIVATION' ? getLevelColor('ACTIVATION') : colors.textSecondary} />
              <Text 
                style={[
                  styles.levelText, 
                  level === 'ACTIVATION' && { color: getLevelColor('ACTIVATION') }
                ]}
              >
                Activate
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Alert Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter alert title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.label}>Alert Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter alert message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <Card variant="elevated" style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View 
            style={[
              styles.alertPreview, 
              { backgroundColor: `${getLevelColor(level)}20` }
            ]}
          >
            <View style={styles.alertHeader}>
              <View 
                style={[
                  styles.alertBadge, 
                  { backgroundColor: getLevelColor(level) }
                ]}
              >
                <Text style={styles.alertBadgeText}>{level}</Text>
              </View>
              <Text style={styles.alertTitle}>{title}</Text>
            </View>
            <Text style={styles.alertMessage}>{message}</Text>
          </View>
        </Card>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.saveButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleUpdateAlert}
            disabled={isLoading}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.deleteButton,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleDeleteAlert}
            disabled={isLoading}
          >
            <Trash2 size={20} color="white" />
            <Text style={styles.deleteButtonText}>Delete Alert</Text>
          </TouchableOpacity>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  acknowledgmentsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  acknowledgmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  acknowledgmentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  acknowledgmentsStats: {
    marginBottom: 12,
  },
  acknowledgmentsCount: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  acknowledgmentsPercentage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  viewDetailsText: {
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  levelSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedLevel: {
    borderWidth: 2,
    backgroundColor: 'white',
  },
  levelText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
  },
  previewCard: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  alertPreview: {
    borderRadius: 8,
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  alertBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.text,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});