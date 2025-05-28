import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { User as UserIcon, Shield, Award } from 'lucide-react-native';

interface MemberCardProps {
  member: User;
  onPress?: (member: User) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const getRoleIcon = () => {
    if (member.roles.includes('EC')) {
      return <Shield size={16} color={colors.primary} />;
    } else if (member.roles.includes('AEC')) {
      return <Shield size={16} color={colors.secondary} />;
    } else if (member.roles.includes('Admin')) {
      return <Shield size={16} color={colors.info} />;
    } else if (member.roles.includes('PIO')) {
      return <Award size={16} color={colors.accent} />;
    } else {
      return <UserIcon size={16} color={colors.textSecondary} />;
    }
  };
  
  const getRoleBadgeColor = () => {
    if (member.roles.includes('EC')) {
      return 'rgba(59, 130, 246, 0.1)';
    } else if (member.roles.includes('AEC')) {
      return 'rgba(139, 92, 246, 0.1)';
    } else if (member.roles.includes('Admin')) {
      return 'rgba(14, 165, 233, 0.1)';
    } else if (member.roles.includes('PIO')) {
      return 'rgba(249, 115, 22, 0.1)';
    } else {
      return 'rgba(107, 114, 128, 0.1)';
    }
  };
  
  const getRoleText = () => {
    if (member.roles.includes('EC')) {
      return 'EC';
    } else if (member.roles.includes('AEC')) {
      return 'AEC';
    } else if (member.roles.includes('Admin')) {
      return 'Admin';
    } else if (member.roles.includes('PIO')) {
      return 'PIO';
    } else {
      return 'Member';
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(member)}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(member.fullName)}</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{member.fullName}</Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor() }]}>
                <View style={styles.roleContent}>
                  {getRoleIcon()}
                  <Text style={styles.roleText}>{getRoleText()}</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.callsignText}>{member.callsign}</Text>
            
            <View style={styles.detailsRow}>
              <Text style={styles.licenseText}>{member.licenseClass}</Text>
              <Text style={styles.dateText}>
                Member since: {formatDate(member.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  callsignText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  licenseText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default MemberCard;