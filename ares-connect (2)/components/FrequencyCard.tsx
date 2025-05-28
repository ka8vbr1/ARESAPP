import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Frequency } from '@/types';
import Card from './Card';
import colors from '@/constants/colors';
import { Radio } from 'lucide-react-native';

interface FrequencyCardProps {
  frequency: Frequency;
}

export const FrequencyCard: React.FC<FrequencyCardProps> = ({ frequency }) => {
  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Radio size={20} color={colors.primary} />
        <Text style={styles.name}>{frequency.name}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Frequency:</Text>
          <Text style={styles.value}>{frequency.frequency}</Text>
        </View>
        {frequency.offset && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Offset:</Text>
            <Text style={styles.value}>{frequency.offset}</Text>
          </View>
        )}
        {frequency.tone && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tone:</Text>
            <Text style={styles.value}>{frequency.tone}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Mode:</Text>
          <Text style={styles.value}>{frequency.mode}</Text>
        </View>
      </View>
      {frequency.notes && (
        <Text style={styles.notes}>{frequency.notes}</Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default FrequencyCard;