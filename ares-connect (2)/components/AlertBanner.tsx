import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Alert } from '@/types';
import colors from '@/constants/colors';
import { AlertTriangle, Info, Bell } from 'lucide-react-native';

interface AlertBannerProps {
  alert: Alert;
  onPress?: () => void;
  onAcknowledge?: (alertId: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onPress, onAcknowledge }) => {
  const getAlertColor = () => {
    switch (alert.level) {
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

  const getAlertIcon = () => {
    switch (alert.level) {
      case 'INFO':
        return <Info size={20} color={getAlertColor()} />;
      case 'DRILL':
        return <Bell size={20} color={getAlertColor()} />;
      case 'STANDBY':
      case 'ACTIVATION':
        return <AlertTriangle size={20} color={getAlertColor()} />;
      default:
        return <Info size={20} color={getAlertColor()} />;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: `${getAlertColor()}15` }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {getAlertIcon()}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{alert.title}</Text>
          <View 
            style={[
              styles.badge,
              { backgroundColor: getAlertColor() }
            ]}
          >
            <Text style={styles.badgeText}>{alert.level}</Text>
          </View>
        </View>
        <Text style={styles.message}>{alert.message}</Text>
        <Text style={styles.timestamp}>{formatDate(alert.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default AlertBanner;