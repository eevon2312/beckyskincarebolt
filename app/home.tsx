import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Home as HomeIcon, User } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import storage from '../src/utils/storage';

export default function Home() {
  const router = useRouter();
  const [savedAnalysis, setSavedAnalysis] = useState<any>(null);

  useEffect(() => {
    loadSavedAnalysis();
  }, []);

  const loadSavedAnalysis = async () => {
    try {
      const data = await storage.getSkinAnalysis();
      if (data) {
        setSavedAnalysis(data);
      }
    } catch (error) {
      console.log('No saved analysis found');
    }
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.usernameText}>there</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.featureCard, styles.skinCheckCard]}
            onPress={() => router.push('/skin-check')}
            activeOpacity={0.8}
          >
            <Camera color="#2C2C2C" size={64} strokeWidth={1.5} />
            <Text style={styles.cardTitle}>Check My Skin</Text>
            <Text style={styles.cardDescription}>
              Upload a selfie for AI-powered skin analysis
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ Personalized insights</Text>
            </View>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Start Analysis</Text>
            </View>
          </TouchableOpacity>
        </View>

        {savedAnalysis && (
          <View style={styles.recentAnalysisCard}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Last Analysis</Text>
              <Text style={styles.recentTime}>{getTimeAgo(savedAnalysis.timestamp)}</Text>
            </View>
            <View style={styles.recentContent}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{savedAnalysis.healthScore}</Text>
                <Text style={styles.scoreLabel}>Skin Health</Text>
              </View>
              <View style={styles.recentInfo}>
                <Text style={styles.recentSkinType}>{savedAnalysis.skinType} Skin</Text>
                <Text style={styles.recentConcerns}>
                  {savedAnalysis.concerns?.length || 0} concerns detected
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewResultsButton}
              onPress={() => router.push('/skin-results')}
            >
              <Text style={styles.viewResultsText}>View Full Results →</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.comingSoonText}>Coming soon: Product scanner 📦</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab}>
          <HomeIcon color="#A8C8A5" size={24} strokeWidth={2} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/profile')}
        >
          <User color="#9CA3AF" size={24} strokeWidth={2} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    width: '100%',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    width: '100%',
  },
  featureCard: {
    minHeight: 220,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skinCheckCard: {
    backgroundColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginTop: 12,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#A8C8A5',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  cardButton: {
    backgroundColor: '#2C2C2C',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentAnalysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  recentTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  scoreCircle: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  recentInfo: {
    flex: 1,
  },
  recentSkinType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  recentConcerns: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewResultsButton: {
    paddingVertical: 8,
  },
  viewResultsText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  comingSoonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 32,
    marginBottom: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#2C2C2C',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  navLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#A8C8A5',
  },
});
