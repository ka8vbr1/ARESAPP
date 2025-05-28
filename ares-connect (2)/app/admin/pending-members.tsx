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
import { ArrowLeft, CheckCircle, XCircle, User } from 'lucide-react-native';
import { User as UserType } from '@/types';

export default function PendingMembersScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [pendingMembers, setPendingMembers] = useState<UserType[]>([]);

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
    // Mock data
    const mockPendingMembers: UserType[] = [
      {
        id: 'pending1',
        fullName: 'Alex Johnson',
        callsign: 'KD9ABC',
        email: 'alex@example.com',
        phone: '555-111-2222',
        address: '123 Maple St, Anytown, USA',
        licenseClass: 'Technician',
        groupId: user?.groupId || '',
        roles: ['Pending'],
        approved: false,
        createdAt: Date.now() - 259200000, // 3 days ago
        lastActive: Date.now() - 259200000,
      },
      {
        id: 'pending2',
        fullName: 'Taylor Wilson',
        callsign: 'N3XYZ',
        email: 'taylor@example.com',
        phone: '555-333-4444',
        address: '456 Oak St, Anytown, USA',
        licenseClass: 'General',
        groupId: user?.groupId || '',
        roles: ['Pending'],
        approved: false,
        createdAt: Date.now() - 172800000, // 2 days ago
        lastActive: Date.now() - 172800000,
      },
      {
        id: 'pending3',
        fullName: 'Jordan Lee',
        callsign: 'W2DEF',
        email: 'jordan@example.com',
        phone: '555-555-6666',
        address: '789 Pine St, Anytown, USA',
        licenseClass: 'Amateur Extra',
        groupId: user?.groupId || '',
        roles: ['Pending'],
        approved: false,
        createdAt: Date.now() - 86400000, // 1 day ago
        lastActive: Date.now() - 86400000,
      },
    ];
    
    setPendingMembers(mockPendingMembers);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleApprove = (memberId: string) => {
    Alert.alert(
      'Approve Member',
      'Are you sure you want to approve this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            // In a real app, this would call an API
            setPendingMembers(prev => prev.filter(m => m.id !== memberId));
            Alert.alert('Success', 'Member has been approved');
          } 
        }
      ]
    );
  };

  const handleReject = (memberId: string) => {
    Alert.alert(
      'Reject Application',
      'Are you sure you want to reject this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API
            setPendingMembers(prev => prev.filter(m => m.id !== memberId));
            Alert.alert('Success', 'Application has been rejected');
          } 
        }
      ]
    );
  };

  const handleViewDetails = (member: UserType) => {
    Alert.alert(
      `${member.fullName} (${member.callsign})`,
      `Email: ${member.email}
Phone: ${member.phone}
Address: ${member.address}
License: ${member.licenseClass}
Application Date: ${new Date(member.createdAt).toLocaleDateString()}`,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => handleApprove(member.id)
        },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => handleReject(member.id)
        }
      ]
    );
  };

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Pending Approvals',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pending Member Approvals</Text>
          <Text style={styles.subtitle}>
            {pendingMembers.length} pending application{pendingMembers.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {pendingMembers.length > 0 ? (
            pendingMembers.map(member => (
              <Card key={member.id} variant="elevated" style={styles.memberCard}>
                <View style={styles.memberHeader}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.fullName}</Text>
                    <Text style={styles.memberCallsign}>{member.callsign}</Text>
                  </View>
                  <Text style={styles.applicationDate}>
                    Applied: {new Date(member.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.memberDetails}>
                  <Text style={styles.memberDetail}>
                    License: {member.licenseClass}
                  </Text>
                  <Text style={styles.memberDetail}>
                    Email: {member.email}
                  </Text>
                  <Text style={styles.memberDetail}>
                    Phone: {member.phone}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => handleViewDetails(member)}
                  >
                    <User size={16} color={colors.primary} />
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleApprove(member.id)}
                  >
                    <CheckCircle size={16} color="white" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.rejectButton}
                    onPress={() => handleReject(member.id)}
                  >
                    <XCircle size={16} color="white" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No pending applications
              </Text>
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
    marginBottom: 16,
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
  contentContainer: {
    paddingBottom: 20,
  },
  memberCard: {
    marginBottom: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  memberCallsign: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  applicationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  memberDetails: {
    marginBottom: 12,
  },
  memberDetail: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
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