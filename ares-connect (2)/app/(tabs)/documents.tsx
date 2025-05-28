import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import DocumentItem from '@/components/DocumentItem';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { Search, FileText, BookOpen, FileSpreadsheet } from 'lucide-react-native';
import { Document } from '@/types';

export default function DocumentsScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'sop' | 'forms' | 'resources'>('sop');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock data
    const mockDocuments: Document[] = [
      // SOPs
      {
        id: 'doc1',
        title: 'ARES Activation Procedures',
        description: 'Standard procedures for ARES activation',
        url: 'https://example.com/docs/activation.pdf',
        type: 'PDF',
        category: 'SOP',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 7776000000, // 90 days ago
        updatedAt: Date.now() - 2592000000, // 30 days ago
      },
      {
        id: 'doc2',
        title: 'Net Control Operations',
        description: 'Guidelines for net control operators',
        url: 'https://example.com/docs/netcontrol.pdf',
        type: 'PDF',
        category: 'SOP',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 15552000000, // 180 days ago
        updatedAt: Date.now() - 5184000000, // 60 days ago
      },
      {
        id: 'doc3',
        title: 'Emergency Communications Plan',
        description: 'Comprehensive emergency communications plan',
        url: 'https://example.com/docs/ecomm_plan.docx',
        type: 'DOCX',
        category: 'SOP',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 31536000000, // 1 year ago
        updatedAt: Date.now() - 7776000000, // 90 days ago
      },
      
      // Forms
      {
        id: 'form1',
        title: 'ICS-213 Message Form',
        description: 'General message form',
        url: 'https://example.com/forms/ics213.pdf',
        type: 'PDF',
        category: 'FORM',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 15552000000, // 180 days ago
        updatedAt: Date.now() - 15552000000, // 180 days ago
      },
      {
        id: 'form2',
        title: 'ICS-214 Activity Log',
        description: 'Unit activity log',
        url: 'https://example.com/forms/ics214.pdf',
        type: 'PDF',
        category: 'FORM',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 15552000000, // 180 days ago
        updatedAt: Date.now() - 15552000000, // 180 days ago
      },
      {
        id: 'form3',
        title: 'ARES Registration Form',
        description: 'Member registration form',
        url: 'https://example.com/forms/registration.docx',
        type: 'DOCX',
        category: 'FORM',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 7776000000, // 90 days ago
        updatedAt: Date.now() - 7776000000, // 90 days ago
      },
      
      // Resources
      {
        id: 'res1',
        title: 'Repeater Coverage Map',
        description: 'Coverage maps for local repeaters',
        url: 'https://example.com/resources/coverage.pdf',
        type: 'PDF',
        category: 'RESOURCE',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 15552000000, // 180 days ago
        updatedAt: Date.now() - 2592000000, // 30 days ago
      },
      {
        id: 'res2',
        title: 'Member Contact List',
        description: 'Contact information for all members',
        url: 'https://example.com/resources/contacts.xlsx',
        type: 'XLSX',
        category: 'RESOURCE',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 7776000000, // 90 days ago
        updatedAt: Date.now() - 864000000, // 10 days ago
      },
      {
        id: 'res3',
        title: 'Training Materials',
        description: 'Training slides and handouts',
        url: 'https://example.com/resources/training.pdf',
        type: 'PDF',
        category: 'RESOURCE',
        groupId: user?.groupId || '',
        createdAt: Date.now() - 5184000000, // 60 days ago
        updatedAt: Date.now() - 5184000000, // 60 days ago
      },
    ];
    
    setDocuments(mockDocuments);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleDocumentPress = (document: Document) => {
    // In a real app, this would download or open the document
    Alert.alert(
      'Open Document',
      `Would you like to open "${document.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open',
          onPress: () => {
            // This would open the document URL in a browser or PDF viewer
            Linking.openURL(document.url).catch(err => {
              Alert.alert('Error', 'Could not open the document');
            });
          },
        },
      ]
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = 
      (activeTab === 'sop' && doc.category === 'SOP') ||
      (activeTab === 'forms' && doc.category === 'FORM') ||
      (activeTab === 'resources' && doc.category === 'RESOURCE');
    
    const matchesSearch = 
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'sop' && styles.activeTab
            ]}
            onPress={() => setActiveTab('sop')}
          >
            <BookOpen 
              size={16} 
              color={activeTab === 'sop' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'sop' && styles.activeTabText
              ]}
            >
              SOPs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'forms' && styles.activeTab
            ]}
            onPress={() => setActiveTab('forms')}
          >
            <FileText 
              size={16} 
              color={activeTab === 'forms' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'forms' && styles.activeTabText
              ]}
            >
              Forms
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'resources' && styles.activeTab
            ]}
            onPress={() => setActiveTab('resources')}
          >
            <FileSpreadsheet 
              size={16} 
              color={activeTab === 'resources' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'resources' && styles.activeTabText
              ]}
            >
              Resources
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredDocuments.length > 0 ? (
            <Card variant="default" style={styles.documentsCard}>
              {filteredDocuments.map(document => (
                <DocumentItem 
                  key={document.id} 
                  document={document} 
                  onPress={handleDocumentPress} 
                />
              ))}
            </Card>
          ) : (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'No documents match your search' 
                  : `No ${activeTab === 'sop' ? 'SOPs' : activeTab === 'forms' ? 'forms' : 'resources'} found`}
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
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
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  documentsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});