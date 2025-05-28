import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useGroupStore } from '@/store/group-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import colors from '@/constants/colors';
import { Picker } from '@react-native-picker/picker';
import { LicenseClass } from '@/types';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  const { groups, fetchGroups } = useGroupStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    callsign: '',
    email: '',
    phone: '',
    address: '',
    licenseClass: 'Technician' as LicenseClass,
    groupId: '',
    password: '',
    confirmPassword: '',
  });
  
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    callsign: '',
    email: '',
    phone: '',
    address: '',
    licenseClass: '',
    groupId: '',
    password: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    fetchGroups();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      fullName: '',
      callsign: '',
      email: '',
      phone: '',
      address: '',
      licenseClass: '',
      groupId: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.callsign) {
      errors.callsign = 'Callsign is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!formData.address) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.groupId) {
      errors.groupId = 'Please select an ARES group';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await register({
        fullName: formData.fullName,
        callsign: formData.callsign,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        licenseClass: formData.licenseClass,
        groupId: formData.groupId,
        roles: ['Pending'],
        approved: false,
        createdAt: Date.now(),
        lastActive: Date.now(),
      }, formData.password);
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created and is pending approval by an administrator.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (err) {
      Alert.alert('Registration Failed', error || 'Unable to create account. Please try again.');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join your local ARES group and stay connected
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => updateFormData('fullName', text)}
              error={validationErrors.fullName}
            />

            <Input
              label="Callsign"
              placeholder="Enter your amateur radio callsign"
              value={formData.callsign}
              onChangeText={(text) => updateFormData('callsign', text.toUpperCase())}
              autoCapitalize="characters"
              error={validationErrors.callsign}
            />

            <Input
              label="Email"
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
            />

            <Input
              label="Phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              keyboardType="phone-pad"
              error={validationErrors.phone}
            />

            <Input
              label="Address"
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(text) => updateFormData('address', text)}
              error={validationErrors.address}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>License Class</Text>
              <View style={[styles.pickerWrapper, validationErrors.licenseClass ? styles.pickerError : null]}>
                <Picker
                  selectedValue={formData.licenseClass}
                  onValueChange={(value) => updateFormData('licenseClass', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Technician" value="Technician" />
                  <Picker.Item label="General" value="General" />
                  <Picker.Item label="Amateur Extra" value="Amateur Extra" />
                  <Picker.Item label="None" value="None" />
                </Picker>
              </View>
              {validationErrors.licenseClass ? (
                <Text style={styles.errorText}>{validationErrors.licenseClass}</Text>
              ) : null}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>ARES Group</Text>
              <View style={[styles.pickerWrapper, validationErrors.groupId ? styles.pickerError : null]}>
                <Picker
                  selectedValue={formData.groupId}
                  onValueChange={(value) => updateFormData('groupId', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select an ARES group" value="" />
                  {groups.map((group) => (
                    <Picker.Item key={group.id} label={group.name} value={group.id} />
                  ))}
                </Picker>
              </View>
              {validationErrors.groupId ? (
                <Text style={styles.errorText}>{validationErrors.groupId}</Text>
              ) : null}
            </View>

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              error={validationErrors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              secureTextEntry
              error={validationErrors.confirmPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 20,
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.text,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  pickerError: {
    borderColor: colors.error,
  },
  picker: {
    height: 50,
  },
});