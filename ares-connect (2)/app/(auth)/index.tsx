import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import colors from '@/constants/colors';

export default function SignInScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
    };

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Login Failed', error || 'Unable to sign in. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    try {
      // For demo purposes, we'll provide different account types
      const demoAccounts = [
        { email: 'demo@example.com', password: 'password', label: 'Regular Member' },
        { email: 'ec@example.com', password: 'password', label: 'EC (Admin)' },
        { email: 'aec@example.com', password: 'password', label: 'AEC (Admin)' },
        { email: 'admin@example.com', password: 'admin123', label: 'System Administrator' }
      ];
      
      Alert.alert(
        'Demo Login',
        'Choose an account type:',
        [
          ...demoAccounts.map(account => ({
            text: account.label,
            onPress: async () => {
              setEmail(account.email);
              setPassword(account.password);
              await login(account.email, account.password);
              router.replace('/(tabs)');
            }
          })),
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } catch (err) {
      Alert.alert('Demo Login Failed', error || 'Unable to sign in with demo account.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1562307534-a03738d2a81a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.logo}
            />
            <Text style={styles.title}>ARES Connect</Text>
            <Text style={styles.subtitle}>
              Amateur Radio Emergency Service
            </Text>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) clearError();
                if (validationErrors.email) {
                  setValidationErrors({...validationErrors, email: ''});
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
                if (validationErrors.password) {
                  setValidationErrors({...validationErrors, password: ''});
                }
              }}
              secureTextEntry
              error={validationErrors.password}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.button}
            />

            <Button
              title="Demo Login"
              variant="secondary"
              onPress={handleDemoLogin}
              style={styles.demoButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Create Account</Text>
                </TouchableOpacity>
              </Link>
            </View>
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
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
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
  demoButton: {
    marginTop: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: colors.textSecondary,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});