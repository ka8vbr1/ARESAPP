import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import MemberCard from '@/components/MemberCard';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { Search, Users, ArrowLeft, UserPlus, Filter } from 'lucide-react-native';
import { User } from '@/types';

export default function MembersScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<string | null>(null);

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
    const mockMembers: User[] = [
      {
        id: 'user1',
        fullName: 'John Smith',
        callsign: 'W1ABC',
        email: 'john@example.com',
        phone: '555-123-4567',
        address: '123 Main St, Anytown, USA',
        licenseClass: 'Amateur Extra',
        groupId: user?.groupId || '',
        roles: ['EC', 'Admin'],
        approved: true,
        createdAt: Date.now() - 31536000000, // 1 year ago
        lastActive: Date.now() - 86400000, // 1 day ago
      },
      {
        id: 'user2',
        fullName: 'Jane Doe',
        callsign: 'KD2XYZ',
        email: 'jane@example.com',
        phone: '555-987-6543',
        address: '456 Oak Ave, Anytown, USA',
        licenseClass: 'General',
        groupId: user?.groupId || '',
        roles: ['AEC'],
        approved: true,
        createdAt: Date.now() - 15768000000, // 6 months ago
        lastActive: Date.now() - 172800000, // 2 days ago
      },
      {
        id: 'user3',
        fullName: 'Bob Johnson',
        callsign: 'KA1DEF',
        email: 'bob@example.com',
        phone: '555-456-7890',
        address: '789 Pine St, Anytown, USA',
        licenseClass: 'Technician',
        groupId: user?.groupId || '',
        roles: ['Member'],
        approved: true,
        createdAt: Date.now() - 7884000000, // 3 months ago
        lastActive: Date.now() - 604800000, // 1 week ago
      },
      {
        id: 'user4',
        fullName: 'Sarah Williams',
        callsign: 'N2GHI',
        email: 'sarah@example.com',
        phone: '555-789-0123',
        address: '101 Elm St, Anytown, USA',
        licenseClass: 'Amateur Extra',
        groupId: user?.groupId || '',
        roles: ['PIO'],
        approved: true,
        createdAt: Date.now() - 5256000000, // 2 months ago
        lastActive: Date.now() - 259200000, // 3 days ago
      },
      {
        id: 'user5',
        fullName: 'Michael Brown',
        callsign: 'K3JKL',
        email: 'michael@example.com',
        phone: '555-321-6547',
        address: '202 Cedar St, Anytown, USA',
        licenseClass: 'General',
        groupId: user?.groupId || '',
        roles: ['Member'],
        approved: true,
        createdAt: Date.now() - 2628000000, // 1 month ago
        lastActive: Date.now() - 432000000, // 5 days ago
      },
    ];
    
    setMembers(mockMembers);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleMemberPress = (member: User) => {
    router.push(`/admin/member-details?id=${member.id}`);
  };

  const handleAddMember = () => {
    router.push('/admin/add-member');
  };

  const handleFilter = () => {
    Alert.alert(
      'Filter Members',
      'Select a role to filter by:',
      [
        { text: 'All Members', onPress: () => setFilterRole(null) },
        { text: 'EC', onPress: () => setFilterRole('EC') },
        { text: 'AEC', onPress: () => setFilterRole('AEC') },
        { text: 'PIO', onPress: () => setFilterRole('PIO') },
        { text: 'Member', onPress: () => setFilterRole('Member') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      searchQuery === '' ||
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);
    
    const matchesFilter = 
      filterRole === null || 
      member.roles.includes(filterRole as any);
    
    return matchesSearch && matchesFilter;
  });

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Manage Members',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={handleFilter}
            >
              <Filter size={20} color={colors.primary} />
              <Text style={styles.filterText}>
                {filterRole ? filterRole : 'All'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <UserPlus size={20} color="white" />
              <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.statText}>{members.length} Total Members</Text>
            </View>
            {filterRole && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  Filtered by: {filterRole}
                </Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onPress={handleMemberPress} 
              />
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {searchQuery || filterRole ? 'No members match your criteria' : 'No members found'}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterText: {
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: colors.text,
    fontWeight: '500',
  },
  filterBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  contentContainer: {
    paddingBottom: 20,
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