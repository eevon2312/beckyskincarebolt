import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Clock, Droplet, MoreVertical, AlertCircle, Lightbulb, CheckCircle } from 'lucide-react-native';
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
    try {
      const data = await storage.getRoutines();
      console.log('Loaded data:', data);
      setResults(data);
    } catch (error) {
      console.error('❌ Error loading results:', error);
    } finally {
      setLoading(false);
    }
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Your Routine</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Here's your personalized skincare plan.
        </Text>

        {/* Key Insights Section */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights ({suggestions.length})</Text>
            {suggestions.map((suggestion: Suggestion, idx: number) => (
              <View key={idx} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Lightbulb color="#8B5CF6" size={20} strokeWidth={2} />
                  <Text style={styles.insightTitle}>{suggestion.title}</Text>
                </View>
                {suggestion.products && suggestion.products.length > 0 && (
                  <Text style={styles.insightProducts}>
                    {suggestion.products.join(' & ')}
                  </Text>
                )}
                <Text style={styles.insightDescription}>{suggestion.description}</Text>
                {suggestion.recommendation && (
                  <Text style={styles.insightRecommendation}>
                    {suggestion.recommendation}
                  </Text>
                )}
              </View>
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
        <View style={styles.routineSteps}>
          {currentRoutine.map((item: RoutineStep) => {
            const isComplete = isStepComplete(item.step);
            const isMissing = item.product.includes('(Missing)');

            return (
              <View key={item.step} style={styles.stepCard}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepNumber,
                      selectedTime === 'AM' ? styles.stepNumberAM : styles.stepNumberPM,
                    ]}
                  >
                    <Text style={styles.stepNumberText}>{item.step}</Text>
                  </View>
                </View>

                <View style={styles.stepContent}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>

                  <Text style={[styles.productName, isMissing && styles.productMissing]}>
                    {item.product}
                  </Text>

                  <Text style={styles.instructions}>{item.instructions}</Text>

                  {item.notes && (
                    <View style={styles.notesContainer}>
                      <Droplet color="#6B7280" size={14} strokeWidth={2} />
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#F3E8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B21A8',
    flex: 1,
  },
  insightProducts: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#5B21B6',
    lineHeight: 20,
    marginBottom: 8,
  },
  insightRecommendation: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
  },
  missingCard: {
    backgroundColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    padding: 16,
    borderRadius: 12,
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
    fontWeight: 'bold',
    color: '#065F46',
  },
  missingReason: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  timeToggle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginHorizontal: 20,
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
    borderBottomColor: '#0D9488',
  },
  timeTabActivePM: {
    borderBottomColor: '#6366F1',
  },
  timeTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  timeTabTextActive: {
    color: '#1F2937',
  },
  routineSteps: {
    paddingHorizontal: 20,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  stepLeft: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberAM: {
    backgroundColor: '#0D9488',
  },
  stepNumberPM: {
    backgroundColor: '#6366F1',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  productMissing: {
    color: '#6B7280',
  },
  instructions: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: '600',
  },
});
