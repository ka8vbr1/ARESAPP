import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import colors from '@/constants/colors';
import { 
  ShieldAlert, 
  Lock, 
  Users, 
  Bell, 
  Calendar,
  FileText,
  ChevronRight
} from 'lucide-react-native';

export default function AdminScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Check if user already has admin role
  useEffect(() => {
    if (hasAdminRole()) {
      setIsAuthenticated(true);
    }
  }, [hasAdminRole]);

  const handleAuthenticate = () => {
    // Simple password check - in a real app, this would be more secure
    const adminPassword = 'admin123'; // This would be stored securely in a real app
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setAttempts(attempts + 1);
      setError('Incorrect password');
      
      // Lock out after 5 attempts
      if (attempts >= 4) {
        Alert.alert(
          'Too Many Attempts',
          'You have exceeded the maximum number of login attempts. Please try again later.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    }
  };

  const navigateTo = (route: string) => {
    router.push(route);
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.authContainer}>
              <View style={styles.iconContainer}>
                <Lock size={40} color={colors.primary} />
              </View>
              
              <Text style={styles.title}>Admin Access</Text>
              <Text style={styles.subtitle}>
                Enter the admin password to access administrative functions
              </Text>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              <Input
                label="Admin Password"
                placeholder="Enter admin password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              
              <Button
                title="Authenticate"
                onPress={handleAuthenticate}
                style={styles.button}
              />
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <Text style={styles.helpText}>
                If you need admin access, please contact your EC or AEC.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Admin dashboard
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.dashboardTitle}>Admin Portal</Text>
          <Text style={styles.dashboardSubtitle}>
            Manage your ARES group
          </Text>
        </View>

        <Card variant="elevated" style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/members')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Members</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/alerts')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Bell size={24} color={colors.error} />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/events')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Calendar size={24} color={colors.success} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigateTo('/admin/pending-members')}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Users size={24} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </Card>

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
                <Users size={20} color={colors.warning} />
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  authContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  cancelButton: {
    marginTop: 16,
    padding: 8,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  helpText: {
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
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