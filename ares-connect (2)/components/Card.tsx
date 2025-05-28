import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default'
}) => {
  return (
    <View style={[
      styles.card,
      variant === 'elevated' && styles.elevated,
      variant === 'outlined' && styles.outlined,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 0,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default Card;