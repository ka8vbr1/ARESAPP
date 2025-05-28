import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import MemberCard from '@/components/MemberCard';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { Search, Users, Phone, Mail } from 'lucide-react-native';
import { User } from '@/types';

export default function RosterScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    loadData();
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
    Alert.alert(
      member.fullName,
      `${member.callsign}`,
      [
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${member.phone}`);
          },
        },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL(`mailto:${member.email}`);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const filteredMembers = members.filter(member => 
    searchQuery === '' ||
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery) ||
    member.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
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
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.statText}>{members.length} Members</Text>
            </View>
            <TouchableOpacity style={styles.contactAllButton}>
              <Phone size={16} color="white" style={styles.contactIcon} />
              <Text style={styles.contactAllText}>Call List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactAllButton}>
              <Mail size={16} color="white" style={styles.contactIcon} />
              <Text style={styles.contactAllText}>Email All</Text>
            </TouchableOpacity>
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
                {searchQuery ? 'No members match your search' : 'No members found'}
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
  contactAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  contactIcon: {
    marginRight: 4,
  },
  contactAllText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
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