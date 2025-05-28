import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
  Switch
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Shield, 
  Save,
  Trash2,
  UserX
} from 'lucide-react-native';
import { User as UserType, Role } from '@/types';

export default function MemberDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, hasAdminRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [member, setMember] = useState<UserType | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseClass, setLicenseClass] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);

  // Redirect non-admin users
  useEffect(() => {
    if (!hasAdminRole()) {
      Alert.alert(
        'Access Denied',
        'You do not have permission to access this feature.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      loadMemberData();
    }
  }, [id]);

  const loadMemberData = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock member data
      const mockMember: UserType = {
        id: id || 'user1',
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
      };
      
      setMember(mockMember);
      
      // Initialize form state
      setFullName(mockMember.fullName);
      setCallsign(mockMember.callsign);
      setEmail(mockMember.email);
      setPhone(mockMember.phone);
      setAddress(mockMember.address);
      setLicenseClass(mockMember.licenseClass);
      setRoles(mockMember.roles);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load member data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim() || !callsign.trim() || !email.trim()) {
      Alert.alert('Error', 'Name, callsign, and email are required');
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (member) {
        const updatedMember = {
          ...member,
          fullName,
          callsign,
          email,
          phone,
          address,
          licenseClass,
          roles,
        };
        setMember(updatedMember);
      }
      
      setIsEditing(false);
      Alert.alert('Success', 'Member information updated');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update member information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this member? This action cannot be undone.',
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
                'Member has been deleted',
                [{ text: 'OK', onPress: () => router.back() }]
              );
              
            } catch (error) {
              Alert.alert('Error', 'Failed to delete member');
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRoleToggle = (role: Role) => {
    setRoles(currentRoles => {
      if (currentRoles.includes(role)) {
        return currentRoles.filter(r => r !== role);
      } else {
        return [...currentRoles, role];
      }
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!hasAdminRole() || !member) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: isEditing ? 'Edit Member' : 'Member Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {isEditing ? (
          <View style={styles.formSection}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>Callsign</Text>
            <TextInput
              style={styles.input}
              value={callsign}
              onChangeText={setCallsign}
              placeholder="Enter callsign"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
            />
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>License Class</Text>
            <TextInput
              style={styles.input}
              value={licenseClass}
              onChangeText={setLicenseClass}
              placeholder="Enter license class"
              placeholderTextColor={colors.textSecondary}
            />
            
            <Text style={styles.label}>Roles</Text>
            <Card variant="outlined" style={styles.rolesCard}>
              <View style={styles.roleToggleItem}>
                <Text style={styles.roleToggleText}>Emergency Coordinator (EC)</Text>
                <Switch
                  value={roles.includes('EC')}
                  onValueChange={() => handleRoleToggle('EC')}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={roles.includes('EC') ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.roleToggleItem}>
                <Text style={styles.roleToggleText}>Assistant EC (AEC)</Text>
                <Switch
                  value={roles.includes('AEC')}
                  onValueChange={() => handleRoleToggle('AEC')}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={roles.includes('AEC') ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.roleToggleItem}>
                <Text style={styles.roleToggleText}>Public Information Officer (PIO)</Text>
                <Switch
                  value={roles.includes('PIO')}
                  onValueChange={() => handleRoleToggle('PIO')}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={roles.includes('PIO') ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.roleToggleItem}>
                <Text style={styles.roleToggleText}>Administrator</Text>
                <Switch
                  value={roles.includes('Admin')}
                  onValueChange={() => handleRoleToggle('Admin')}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={roles.includes('Admin') ? colors.primary : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.roleToggleItem}>
                <Text style={styles.roleToggleText}>Member</Text>
                <Switch
                  value={roles.includes('Member')}
                  onValueChange={() => handleRoleToggle('Member')}
                  trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                  thumbColor={roles.includes('Member') ? colors.primary : '#f4f3f4'}
                />
              </View>
            </Card>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                isLoading && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isLoading}
            >
              <Trash2 size={20} color={colors.error} />
              <Text style={styles.deleteButtonText}>Delete Member</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={styles.nameText}>{member.fullName}</Text>
                <Text style={styles.callsignText}>{member.callsign}</Text>
                <View style={styles.rolesContainer}>
                  {member.roles.map((role, index) => (
                    <View key={index} style={styles.roleBadge}>
                      <Text style={styles.roleText}>{role}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            <Card variant="elevated" style={styles.detailsCard}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Mail size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{member.email}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Phone size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{member.phone}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <MapPin size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{member.address}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Award size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>License Class</Text>
                  <Text style={styles.detailValue}>{member.licenseClass}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Member Since</Text>
                  <Text style={styles.detailValue}>{formatDate(member.createdAt)}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <User size={20} color={colors.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Last Active</Text>
                  <Text style={styles.detailValue}>{formatDate(member.lastActive)}</Text>
                </View>
              </View>
            </Card>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push(`/admin/send-message?id=${member.id}`)}
              >
                <Text style={styles.actionButtonText}>Send Message</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonOutlined]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={[styles.actionButtonText, styles.actionButtonOutlinedText]}>
                  Edit Member
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={handleDelete}
              >
                <UserX size={16} color="white" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Remove Member</Text>
              </TouchableOpacity>
            </View>
          </>
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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  callsignText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 12,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  roleBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  roleText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  detailsCard: {
    marginBottom: 24,
    padding: 0,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionButtonDanger: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  actionButtonOutlinedText: {
    color: colors.primary,
  },
  actionButtonIcon: {
    marginRight: 8,
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
  rolesCard: {
    marginBottom: 24,
    padding: 0,
  },
  roleToggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  roleToggleText: {
    fontSize: 16,
    color: colors.text,
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
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});