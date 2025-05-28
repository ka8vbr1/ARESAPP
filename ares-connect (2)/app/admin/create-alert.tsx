import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, Send, AlertTriangle, Info, Bell } from 'lucide-react-native';

type AlertLevel = 'INFO' | 'DRILL' | 'STANDBY' | 'ACTIVATION';

export default function CreateAlertScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const { createAlert, isLoading } = useAlertStore();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState<AlertLevel>('INFO');

  // Redirect non-admin users
  React.useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  }, []);

  const handleCreateAlert = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the alert');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message for the alert');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create alerts');
      return;
    }

    try {
      await createAlert({
        title,
        message,
        level,
        groupId: user.groupId,
        createdBy: user.id,
      });

      Alert.alert(
        'Success',
        'Alert has been created and sent to members',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create alert. Please try again.');
    }
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

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Create Alert',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Create New Alert</Text>
        <Text style={styles.subHeaderText}>
          Send an alert to all members of your ARES group
        </Text>
        
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
              <Text style={styles.alertTitle}>{title || 'Alert Title'}</Text>
            </View>
            <Text style={styles.alertMessage}>
              {message || 'Alert message will appear here'}
            </Text>
          </View>
        </Card>
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            isLoading && styles.sendButtonDisabled
          ]}
          onPress={handleCreateAlert}
          disabled={isLoading}
        >
          <Send size={20} color="white" />
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Sending...' : 'Send Alert'}
          </Text>
        </TouchableOpacity>
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
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});