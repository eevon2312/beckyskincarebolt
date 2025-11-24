import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Package, Home as HomeIcon, Search, List, User } from 'lucide-react-native';

export default function Home() {
  const router = useRouter();

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

          <TouchableOpacity
            style={[styles.featureCard, styles.routineCard]}
            onPress={() => router.push('/scan-products')}
            activeOpacity={0.8}
          >
            <Package color="#2C2C2C" size={64} strokeWidth={1.5} />
            <Text style={styles.cardTitle}>Build My Routine</Text>
            <Text style={styles.cardDescription}>
              Scan your products to optimize your routine
            </Text>
            <View style={[styles.badge, styles.badgePeach]}>
              <Text style={styles.badgeText}>🔬 Conflict detection</Text>
            </View>
            <View style={styles.cardButton}>
              <Text style={styles.cardButtonText}>Scan Products</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>Last check: Never</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statText}>Products: 0</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statText}>Routine score: --</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab}>
          <HomeIcon color="#A8C8A5" size={24} strokeWidth={2} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/products')}
        >
          <Search color="#9CA3AF" size={24} strokeWidth={2} />
          <Text style={styles.navLabel}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => router.push('/routines')}
        >
          <List color="#9CA3AF" size={24} strokeWidth={2} />
          <Text style={styles.navLabel}>Routines</Text>
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
  routineCard: {
    backgroundColor: '#FFF3E0',
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
  badgePeach: {
    backgroundColor: '#FFE0B2',
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
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FEFEFE',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
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
