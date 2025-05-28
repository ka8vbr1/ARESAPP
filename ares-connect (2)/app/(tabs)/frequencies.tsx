import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import FrequencyCard from '@/components/FrequencyCard';
import Card from '@/components/Card';
import colors from '@/constants/colors';
import { Search, Radio, Clock } from 'lucide-react-native';
import { Frequency, Net } from '@/types';

export default function FrequenciesScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'repeaters' | 'simplex' | 'nets'>('repeaters');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [repeaters, setRepeaters] = useState<Frequency[]>([]);
  const [simplex, setSimplex] = useState<Frequency[]>([]);
  const [nets, setNets] = useState<Net[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock data
    const mockRepeaters: Frequency[] = [
      {
        id: 'freq1',
        name: 'W1ABC Main Repeater',
        frequency: '146.940 MHz',
        offset: '-0.6 MHz',
        tone: '100.0 Hz',
        mode: 'FM',
        notes: 'Primary ARES repeater, linked to Echolink',
        groupId: user?.groupId || '',
      },
      {
        id: 'freq2',
        name: 'W1DEF UHF Repeater',
        frequency: '442.100 MHz',
        offset: '+5.0 MHz',
        tone: '123.0 Hz',
        mode: 'FM',
        notes: 'Backup repeater with good coverage to the north',
        groupId: user?.groupId || '',
      },
      {
        id: 'freq3',
        name: 'W1GHI DMR Repeater',
        frequency: '444.500 MHz',
        offset: '+5.0 MHz',
        tone: 'CC1',
        mode: 'DMR',
        notes: 'DMR repeater, TG 3151 for ARES',
        groupId: user?.groupId || '',
      },
    ];
    
    const mockSimplex: Frequency[] = [
      {
        id: 'simp1',
        name: 'Primary Tactical',
        frequency: '146.550 MHz',
        mode: 'FM',
        notes: 'Primary simplex frequency for tactical operations',
        groupId: user?.groupId || '',
      },
      {
        id: 'simp2',
        name: 'Secondary Tactical',
        frequency: '146.580 MHz',
        mode: 'FM',
        notes: 'Secondary simplex frequency',
        groupId: user?.groupId || '',
      },
      {
        id: 'simp3',
        name: 'UHF Tactical',
        frequency: '446.000 MHz',
        mode: 'FM',
        notes: 'UHF simplex for short-range communications',
        groupId: user?.groupId || '',
      },
    ];
    
    const mockNets: Net[] = [
      {
        id: 'net1',
        name: 'Weekly ARES Net',
        frequency: '146.940 MHz',
        day: 'Monday',
        time: '19:30',
        notes: 'Weekly check-in and announcements',
        groupId: user?.groupId || '',
      },
      {
        id: 'net2',
        name: 'Digital Practice Net',
        frequency: '146.580 MHz',
        day: 'Wednesday',
        time: '20:00',
        notes: 'Practice with Winlink, JS8Call, and other digital modes',
        groupId: user?.groupId || '',
      },
      {
        id: 'net3',
        name: 'Monthly ARES Meeting',
        frequency: '146.940 MHz',
        day: 'First Thursday',
        time: '19:00',
        notes: 'Monthly meeting and training',
        groupId: user?.groupId || '',
      },
    ];
    
    setRepeaters(mockRepeaters);
    setSimplex(mockSimplex);
    setNets(mockNets);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const filteredRepeaters = repeaters.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSimplex = simplex.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNets = nets.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search frequencies, names, or notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'repeaters' && styles.activeTab
            ]}
            onPress={() => setActiveTab('repeaters')}
          >
            <Radio 
              size={16} 
              color={activeTab === 'repeaters' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'repeaters' && styles.activeTabText
              ]}
            >
              Repeaters
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'simplex' && styles.activeTab
            ]}
            onPress={() => setActiveTab('simplex')}
          >
            <Radio 
              size={16} 
              color={activeTab === 'simplex' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'simplex' && styles.activeTabText
              ]}
            >
              Simplex
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'nets' && styles.activeTab
            ]}
            onPress={() => setActiveTab('nets')}
          >
            <Clock 
              size={16} 
              color={activeTab === 'nets' ? 'white' : colors.primary} 
              style={styles.tabIcon} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'nets' && styles.activeTabText
              ]}
            >
              Nets
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === 'repeaters' && (
            <>
              {filteredRepeaters.length > 0 ? (
                filteredRepeaters.map(repeater => (
                  <FrequencyCard key={repeater.id} frequency={repeater} />
                ))
              ) : (
                <Card variant="outlined" style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No repeaters match your search' : 'No repeaters found'}
                  </Text>
                </Card>
              )}
            </>
          )}

          {activeTab === 'simplex' && (
            <>
              {filteredSimplex.length > 0 ? (
                filteredSimplex.map(channel => (
                  <FrequencyCard key={channel.id} frequency={channel} />
                ))
              ) : (
                <Card variant="outlined" style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No simplex channels match your search' : 'No simplex channels found'}
                  </Text>
                </Card>
              )}
            </>
          )}

          {activeTab === 'nets' && (
            <>
              {filteredNets.length > 0 ? (
                filteredNets.map(net => (
                  <Card key={net.id} variant="elevated" style={styles.netCard}>
                    <Text style={styles.netName}>{net.name}</Text>
                    <View style={styles.netDetails}>
                      <View style={styles.netDetailRow}>
                        <Text style={styles.netLabel}>Frequency:</Text>
                        <Text style={styles.netValue}>{net.frequency}</Text>
                      </View>
                      <View style={styles.netDetailRow}>
                        <Text style={styles.netLabel}>Day:</Text>
                        <Text style={styles.netValue}>{net.day}</Text>
                      </View>
                      <View style={styles.netDetailRow}>
                        <Text style={styles.netLabel}>Time:</Text>
                        <Text style={styles.netValue}>{net.time}</Text>
                      </View>
                    </View>
                    {net.notes && (
                      <Text style={styles.netNotes}>{net.notes}</Text>
                    )}
                  </Card>
                ))
              ) : (
                <Card variant="outlined" style={styles.emptyCard}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No nets match your search' : 'No nets found'}
                  </Text>
                </Card>
              )}
            </>
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  netCard: {
    marginVertical: 8,
  },
  netName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  netDetails: {
    marginBottom: 8,
  },
  netDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  netLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 80,
  },
  netValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  netNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});