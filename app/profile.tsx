import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  Droplet,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  Star,
  LogOut,
  Trash2,
} from 'lucide-react-native';
import BottomNav from '../src/components/BottomNav';
import Toast from '../src/components/Toast';
import storage from '../src/utils/storage';

export default function Profile() {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const user = {
    username: 'eevontan95',
    email: 'eevontan95@gmail.com',
    plan: 'Free Plan',
    skinType: 'Dry',
    concerns: ['Anti-Aging', 'Dullness'],
  };

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all cached analysis results. Your next analysis will fetch fresh data from the AI. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Clearing all cached data...');
              await storage.clearAll();
              console.log('✅ All data cleared!');
              setToast({
                visible: true,
                message: 'All cached data cleared successfully!',
                type: 'success',
              });
            } catch (error) {
              console.error('❌ Error clearing data:', error);
              setToast({
                visible: true,
                message: 'Failed to clear data. Please try again.',
                type: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: Lock,
      label: 'Privacy & Data',
      onPress: () => console.log('Privacy & Data'),
    },
    {
      icon: Trash2,
      label: 'Clear Cached Data',
      onPress: handleClearData,
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => console.log('Help & Support'),
    },
    {
      icon: Star,
      label: 'Rate Us',
      onPress: () => console.log('Rate Us'),
    },
    {
      icon: LogOut,
      label: 'Log Out',
      onPress: () => console.log('Log Out'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User color="#FFFFFF" size={48} strokeWidth={2} />
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionContent}>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{user.plan}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
              <ChevronRight
                color="#A8C8A5"
                size={16}
                strokeWidth={2}
                style={styles.upgradeChevron}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.skinProfileCard}>
          <View style={styles.skinProfileHeader}>
            <Text style={styles.skinProfileTitle}>Your Skin Profile</Text>
            <TouchableOpacity>
              <Text style={styles.updateText}>Update</Text>
              <ChevronRight
                color="#A8C8A5"
                size={14}
                strokeWidth={2}
                style={styles.updateChevron}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.skinTypeRow}>
            <Droplet color="#6B7280" size={24} strokeWidth={2} />
            <View style={styles.skinTypeContent}>
              <Text style={styles.skinTypeLabel}>Skin Type</Text>
              <Text style={styles.skinTypeValue}>{user.skinType}</Text>
            </View>
          </View>

          <View style={styles.concernsSection}>
            <Text style={styles.concernsLabel}>Main Concerns</Text>
            <View style={styles.concernsPills}>
              {user.concerns.map((concern, index) => (
                <View key={index} style={styles.concernPill}>
                  <Text style={styles.concernPillText}>{concern}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Settings</Text>

          <View style={styles.settingsList}>
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.settingsItem,
                    index === settingsItems.length - 1 &&
                      styles.settingsItemLast,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingsItemLeft}>
                    <Icon color="#2C2C2C" size={24} strokeWidth={2} />
                    <Text style={styles.settingsItemLabel}>{item.label}</Text>
                  </View>
                  <ChevronRight color="#9CA3AF" size={20} strokeWidth={2} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />
      <BottomNav activePage="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  editProfileButton: {
    paddingVertical: 8,
  },
  editProfileText: {
    fontSize: 14,
    color: '#A8C8A5',
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionContent: {
    gap: 12,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  planBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  upgradeText: {
    fontSize: 16,
    color: '#A8C8A5',
    fontWeight: '600',
  },
  upgradeChevron: {
    position: 'absolute',
    right: -20,
    top: 2,
  },
  skinProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skinProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  skinProfileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  updateText: {
    fontSize: 14,
    color: '#A8C8A5',
    fontWeight: '600',
  },
  updateChevron: {
    position: 'absolute',
    right: -18,
    top: 1,
  },
  skinTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  skinTypeContent: {
    flex: 1,
  },
  skinTypeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  skinTypeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  concernsSection: {
    gap: 12,
  },
  concernsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  concernsPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  concernPill: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  concernPillText: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  settingsSection: {
    marginTop: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsItemLabel: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
