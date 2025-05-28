import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Document } from '@/types';
import colors from '@/constants/colors';
import { FileText, Download } from 'lucide-react-native';

interface DocumentItemProps {
  document: Document;
  onPress: (document: Document) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ 
  document, 
  onPress 
}) => {
  const getIconForType = () => {
    switch (document.type) {
      case 'PDF':
        return <FileText size={20} color={colors.primary} />;
      case 'DOCX':
        return <FileText size={20} color={colors.info} />;
      case 'XLSX':
        return <FileText size={20} color={colors.success} />;
      default:
        return <FileText size={20} color={colors.textSecondary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(document)}
    >
      <View style={styles.iconContainer}>
        {getIconForType()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{document.title}</Text>
        {document.description && (
          <Text style={styles.description} numberOfLines={1}>
            {document.description}
          </Text>
        )}
        <Text style={styles.date}>
          Updated: {new Date(document.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.downloadIcon}>
        <Download size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  downloadIcon: {
    padding: 8,
  },
});

export default DocumentItem;