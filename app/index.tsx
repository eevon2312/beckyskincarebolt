import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Shield, Zap } from 'lucide-react-native';

export default function Welcome() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.topSection}>
        <View style={styles.appIcon}>
          <Sparkles color="#FFFFFF" size={60} strokeWidth={2} />
        </View>

        <Text style={styles.title}>Welcome to Becky</Text>
        <Text style={styles.subtitle}>Your personalised skincare routine optimiser</Text>
      </View>

      <View style={styles.featureCards}>
        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Sparkles color="#A8C8A5" size={28} strokeWidth={2} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Smart Detection</Text>
            <Text style={styles.featureSubtitle}>AI-powered product recognition from photos</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Shield color="#A8C8A5" size={28} strokeWidth={2} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Conflict Analysis</Text>
            <Text style={styles.featureSubtitle}>Identify ingredient clashes and redundancies</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.iconCircle}>
            <Zap color="#A8C8A5" size={28} strokeWidth={2} />
          </View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Optimised Routine</Text>
            <Text style={styles.featureSubtitle}>Personalised AM/PM skincare schedule</Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/intro1')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#2C2C2C',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featureCards: {
    gap: 16,
    marginBottom: 40,
  },
  featureCard: {
    backgroundColor: '#FEFEFE',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A8C8A5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2C2C2C',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
