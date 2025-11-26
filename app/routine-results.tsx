import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Clock, Droplet, MoreVertical, AlertCircle, Lightbulb, CheckCircle, ArrowLeft, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import storage from '../src/utils/storage';

type RoutineStep = {
  step: number;
  category: string;
  product: string;
  instructions: string;
  notes?: string | null;
};

type Suggestion = {
  type: string;
  title: string;
  products: string[];
  description: string;
  recommendation: string;
};

type Missing = {
  category: string;
  reason: string;
};

type TimeOfDay = 'AM' | 'PM';

export default function RoutineResults() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('AM');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    console.log('📊 Routine Results Page - Loading routine data');
    // Mock data for verification
    setResults({
      skinType: 'Combination',
      routine: {
        AM: [
          { step: 1, category: 'Cleanse', product: 'Gentle Cleanser', instructions: 'Wash face with lukewarm water' },
          { step: 2, category: 'Treat', product: 'Vitamin C Serum', instructions: 'Apply 3-4 drops' },
          { step: 3, category: 'Moisturize', product: 'Lightweight Gel', instructions: 'Apply evenly' },
          { step: 4, category: 'Protect', product: 'SPF 50', instructions: 'Apply generously' }
        ],
        PM: [
          { step: 1, category: 'Cleanse', product: 'Oil Cleanser', instructions: 'Remove makeup and sunscreen' },
          { step: 2, category: 'Treat', product: 'Retinol Serum', instructions: 'Apply pea-sized amount' },
          { step: 3, category: 'Moisturize', product: 'Night Cream', instructions: 'Lock in hydration' }
        ]
      },
      suggestions: [
        { title: 'Hydration Boost', description: 'Drink more water to improve skin elasticity.' },
        { title: 'Sun Protection', description: 'Reapply sunscreen every 2 hours when outdoors.' }
      ],
      missing: []
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading routine...</Text>
        </View>
      </View>
    );
  }

  if (!results) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle color="#EF4444" size={64} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>No Routine Data</Text>
          <Text style={styles.errorText}>
            No routine found. Please scan your products first to generate a personalized routine.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/scan-products')}
          >
            <Text style={styles.errorButtonText}>Scan Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentRoutine = results.routine?.[selectedTime] || [];
  const suggestions = results.suggestions || [];
  const missing = results.missing || [];

  const toggleStepComplete = (step: number) => {
    const key = `${selectedTime}-${step}`;
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedSteps(newCompleted);
  };

  const isStepComplete = (step: number) => {
    return completedSteps.has(`${selectedTime}-${step}`);
  };

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Your Action Plan</Text>
            <Text style={styles.subtitle}>Personalised for your {results.skinType || 'Normal'} skin</Text>
          </View>
        </View>

        {/* Key Insights Section */}
        {suggestions.length > 0 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Key Insights</Text>
            {suggestions.map((suggestion: Suggestion, idx: number) => (
              <Text key={idx} style={styles.insightText}>
                • {suggestion.title} {suggestion.description}
              </Text>
            ))}
          </View>
        )}

        {/* Recommendations Section */}
        {missing.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <View style={styles.missingCard}>
              {missing.map((item: Missing, idx: number) => (
                <View key={idx} style={styles.missingItem}>
                  <View style={styles.missingHeader}>
                    <CheckCircle color="#10B981" size={16} strokeWidth={2} />
                    <Text style={styles.missingCategory}>Missing: {item.category}</Text>
                  </View>
                  <Text style={styles.missingReason}>{item.reason}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AM/PM Routine Toggle */}
        <View style={styles.timeToggle}>
          <TouchableOpacity
            style={[
              styles.timeTab,
              selectedTime === 'AM' && styles.timeTabActiveAM,
            ]}
            onPress={() => setSelectedTime('AM')}
          >
            <Text
              style={[
                styles.timeTabText,
                selectedTime === 'AM' && styles.timeTabTextActive,
              ]}
            >
              ☀️ AM Routine
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeTab,
              selectedTime === 'PM' && styles.timeTabActivePM,
            ]}
            onPress={() => setSelectedTime('PM')}
          >
            <Text
              style={[
                styles.timeTabText,
                selectedTime === 'PM' && styles.timeTabTextActive,
              ]}
            >
              🌙 PM Routine
            </Text>
          </TouchableOpacity>
        </View>

        {/* Routine Steps */}
        <View style={styles.actionPlanCard}>
          <Text style={styles.cardTitle}>Your Action Plan</Text>
          {currentRoutine.map((item: RoutineStep) => (
            <View key={item.step} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.instructions}</Text>
                <Text style={styles.stepDescription}>
                  Tailored for your {results.skinType || 'Normal'} skin to maintain barrier function
                </Text>
                <View style={styles.productPill}>
                  <Text style={styles.productPillText}>{item.product}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Product Check Card */}
        <View style={styles.productCheckCard}>
          <View style={styles.productCheckHeader}>
            <Lightbulb color="#F59E0B" size={24} strokeWidth={2} />
            <Text style={styles.productCheckTitle}>
              Want to check if your current products match your plan?
            </Text>
          </View>
          <Text style={styles.productCheckDescription}>
            Coming soon: Scan your products to see if they align with your personalized routine.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/scan-products')}
          >
            <Text style={styles.scanButtonText}>Scan My Products</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 240 }} />
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/home')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>Done — Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              // Start Over logic
              router.push('/home');
            }}
          >
            <Text style={styles.secondaryButtonText}>Start Over</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              // Share logic
            }}
          >
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    color: '#6B6B7A',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 20,
    color: '#1A1A2E',
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
  },
  insightText: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#4A4A5E',
    lineHeight: 22,
    marginBottom: 8,
  },
  missingCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderWidth: 2,
    borderColor: '#D1FAE5',
    padding: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  missingItem: {
    marginBottom: 16,
  },
  missingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  missingCategory: {
    fontSize: 16,
    fontFamily: 'Lora-Bold',
    color: '#2C2C2C',
  },
  missingReason: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontFamily: 'Lora-Regular',
  },
  timeToggle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  timeTabActiveAM: {
    borderBottomColor: '#2C2C2C',
  },
  timeTabActivePM: {
    borderBottomColor: '#2C2C2C',
  },
  timeTabText: {
    fontSize: 16,
    fontFamily: 'Lora-SemiBold',
    color: '#9CA3AF',
  },
  timeTabTextActive: {
    color: '#2C2C2C',
  },
  actionPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Lora-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#6B6B7A',
    marginBottom: 12,
    lineHeight: 20,
  },
  // Updated product pill styling: neutral background, visible text, Lora font
  productPill: {
    backgroundColor: '#F3F4F6', // light neutral background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    minWidth: 60,
    height: 32,
  },
  productPillText: {
    color: '#1A1A2E',
    fontSize: 12,
    fontFamily: 'Lora-Regular',
    // display property removed to show text
  },
  productCheckCard: {
    backgroundColor: '#FFF0F5',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  productCheckHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productCheckTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 16,
    color: '#1A1A2E',
    flex: 1,
    lineHeight: 24,
  },
  productCheckDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 14,
    color: '#4A4A5E',
    marginBottom: 20,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scanButtonText: {
    fontFamily: 'Lora-Medium',
    color: '#6B6B7A',
    fontSize: 14,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 40,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
    alignSelf: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontFamily: 'Lora-Medium',
    color: '#1A1A2E',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Lora-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Lora-Bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: 'Lora-Regular',
  },
  errorButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Lora-SemiBold',
  },
});
