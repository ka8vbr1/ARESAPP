import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { Role } from '@/types';

export default function AddMemberScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [licenseClass, setLicenseClass] = useState('');
  const [roles, setRoles] = useState<Role[]>(['Member']);
  const [sendInvite, setSendInvite] = useState(true);

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

  const handleAddMember = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!callsign.trim()) {
      Alert.alert('Error', 'Please enter a callsign');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add members');
      return;
    }

    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        `Member ${fullName} has been added${sendInvite ? ' and invitation sent' : ''}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to add member. Please try again.');
      setIsLoading(false);
    }
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

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Add Member',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Add New Member</Text>
        <Text style={styles.subHeaderText}>
          Add a new member to your ARES group
        </Text>
        
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
          
          <Text style={styles.label}>Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Address (Optional)</Text>
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
          
          <View style={styles.optionItem}>
            <Text style={styles.optionText}>Send email invitation</Text>
            <Switch
              value={sendInvite}
              onValueChange={setSendInvite}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={sendInvite ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addButton,
              isLoading && styles.addButtonDisabled
            ]}
            onPress={handleAddMember}
            disabled={isLoading}
          >
            <UserPlus size={20} color="white" />
            <Text style={styles.addButtonText}>
              {isLoading ? 'Adding...' : 'Add Member'}
            </Text>
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
    marginBottom: 16,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});