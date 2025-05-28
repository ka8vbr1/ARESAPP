import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Save } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
  const { user, hasAdminRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours later
  const [maxParticipants, setMaxParticipants] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState<'date' | 'time'>('date');

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

  const handleCreateEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the event');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for the event');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location for the event');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create events');
      return;
    }

    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the event data to the backend
      
      Alert.alert(
        'Success',
        'Event has been created',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
    }
    
    if (dateTimePickerMode === 'date') {
      setDate(currentDate);
    } else if (showStartTimePicker) {
      setStartTime(currentDate);
    } else if (showEndTimePicker) {
      setEndTime(currentDate);
    }
  };

  const showDatePickerModal = () => {
    setDateTimePickerMode('date');
    setShowDatePicker(true);
  };

  const showStartTimePickerModal = () => {
    setDateTimePickerMode('time');
    setShowStartTimePicker(true);
  };

  const showEndTimePickerModal = () => {
    setDateTimePickerMode('time');
    setShowEndTimePicker(true);
  };

  if (!hasAdminRole()) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{
          title: 'Create Event',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Create New Event</Text>
        <Text style={styles.subHeaderText}>
          Schedule a training, meeting, or exercise
        </Text>
        
        <View style={styles.formSection}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.label}>Date & Time</Text>
          <Card variant="outlined" style={styles.dateTimeCard}>
            <TouchableOpacity 
              style={styles.dateTimeItem}
              onPress={showDatePickerModal}
            >
              <View style={styles.dateTimeIconContainer}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.dateTimeItem}
              onPress={showStartTimePickerModal}
            >
              <View style={styles.dateTimeIconContainer}>
                <Clock size={20} color={colors.primary} />
              </View>
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>Start Time</Text>
                <Text style={styles.dateTimeValue}>{formatTime(startTime)}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.dateTimeItem}
              onPress={showEndTimePickerModal}
            >
              <View style={styles.dateTimeIconContainer}>
                <Clock size={20} color={colors.primary} />
              </View>
              <View style={styles.dateTimeTextContainer}>
                <Text style={styles.dateTimeLabel}>End Time</Text>
                <Text style={styles.dateTimeValue}>{formatTime(endTime)}</Text>
              </View>
            </TouchableOpacity>
          </Card>
          
          <Text style={styles.label}>Maximum Participants (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter maximum number of participants"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="number-pad"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <Card variant="elevated" style={styles.previewCard}>
          <Text style={styles.previewTitle}>Event Preview</Text>
          <View style={styles.eventPreview}>
            <Text style={styles.eventPreviewTitle}>{title || 'Event Title'}</Text>
            <View style={styles.eventPreviewDetail}>
              <Calendar size={16} color={colors.primary} style={styles.eventPreviewIcon} />
              <Text style={styles.eventPreviewText}>{formatDate(date)}</Text>
            </View>
            <View style={styles.eventPreviewDetail}>
              <Clock size={16} color={colors.primary} style={styles.eventPreviewIcon} />
              <Text style={styles.eventPreviewText}>
                {formatTime(startTime)} - {formatTime(endTime)}
              </Text>
            </View>
            <View style={styles.eventPreviewDetail}>
              <MapPin size={16} color={colors.primary} style={styles.eventPreviewIcon} />
              <Text style={styles.eventPreviewText}>{location || 'Event Location'}</Text>
            </View>
            {maxParticipants && (
              <View style={styles.eventPreviewDetail}>
                <Users size={16} color={colors.primary} style={styles.eventPreviewIcon} />
                <Text style={styles.eventPreviewText}>Max {maxParticipants} participants</Text>
              </View>
            )}
            <Text style={styles.eventPreviewDescription}>
              {description || 'Event description will appear here'}
            </Text>
          </View>
        </Card>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            isLoading && styles.saveButtonDisabled
          ]}
          onPress={handleCreateEvent}
          disabled={isLoading}
        >
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Date/Time Pickers */}
      {(Platform.OS === 'ios' || showDatePicker) && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      
      {(Platform.OS === 'ios' || showStartTimePicker) && (
        <DateTimePicker
          testID="startTimePicker"
          value={startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      
      {(Platform.OS === 'ios' || showEndTimePicker) && (
        <DateTimePicker
          testID="endTimePicker"
          value={endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
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
  textArea: {
    height: 120,
  },
  dateTimeCard: {
    marginBottom: 16,
    padding: 0,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  dateTimeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateTimeTextContainer: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
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
  eventPreview: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  eventPreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  eventPreviewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventPreviewIcon: {
    marginRight: 8,
  },
  eventPreviewText: {
    fontSize: 14,
    color: colors.text,
  },
  eventPreviewDescription: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
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
});