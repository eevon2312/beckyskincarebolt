import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, AlertCircle, AlertTriangle, Package, Share2 } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import storage from '../src/utils/storage';

const CircularProgress = ({ score }: { score: number }) => {
  const progress = useSharedValue(0);
  const size = 200;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedStyle(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const getScoreColor = () => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.progressCenter}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreTotal}>/100</Text>
        <Text style={styles.scoreLabel}>Skin Health Score</Text>
      </View>
    </View>
  );
};

export default function SkinResults() {
  const router = useRouter();
  const [expandedConcerns, setExpandedConcerns] = useState<number[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    console.log('📊 Skin Results Page - Loading analysis data');
    try {
      const data = await storage.getSkinAnalysis();
      console.log('Loaded data:', data);
      setResults(data);
    } catch (error) {
      console.error('❌ Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleConcern = (index: number) => {
    if (expandedConcerns.includes(index)) {
      setExpandedConcerns(expandedConcerns.filter((i) => i !== index));
    } else {
      setExpandedConcerns([...expandedConcerns, index]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </View>
    );
  }

  if (!results) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle color="#EF4444" size={64} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>No Analysis Data</Text>
          <Text style={styles.errorText}>
            No skin analysis results found. Please take a photo and analyze your skin first.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/skin-check')}
          >
            <Text style={styles.errorButtonText}>Go to Skin Check</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return '#EF4444';
      case 'moderate':
        return '#F59E0B';
      case 'mild':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getUsageBadgeColor = (usage: string) => {
    switch (usage) {
      case 'AM':
        return { bg: '#D1FAE5', text: '#059669' };
      case 'PM':
        return { bg: '#DDD6FE', text: '#7C3AED' };
      case 'Both':
        return { bg: '#DBEAFE', text: '#2563EB' };
      default:
        return { bg: '#E5E7EB', text: '#6B7280' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Skin Analysis</Text>
            <Text style={styles.timestamp}>Analyzed just now</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <CircularProgress score={results.healthScore} />
        </View>

        <View style={styles.skinTypeBadge}>
          <Text style={styles.skinTypeText}>💧 {results.skinType} Skin</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas to Address</Text>
          {results.concerns && results.concerns.map((concern: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.concernCard,
                { borderLeftColor: getSeverityColor(concern.severity) },
              ]}
              onPress={() => toggleConcern(index)}
              activeOpacity={0.7}
            >
              <View style={styles.concernHeader}>
                <Text style={styles.concernType}>{concern.type}</Text>
                <View
                  style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(concern.severity) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      { color: getSeverityColor(concern.severity) },
                    ]}
                  >
                    {concern.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.concernLocation}>📍 {concern.location}</Text>
              {expandedConcerns.includes(index) && (
                <Text style={styles.concernDescription}>{concern.description}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Ingredients to Avoid</Text>
          <Text style={styles.sectionSubtitle}>Based on your skin analysis</Text>
          <View style={styles.warningCard}>
            {results.concerns && results.concerns.some((c: any) => c.type.toLowerCase().includes('acne')) && (
              <>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>Heavy oils (coconut, cocoa butter)</Text>
                    <Text style={styles.warningReason}>Can clog pores</Text>
                  </View>
                </View>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>High fragrance products</Text>
                    <Text style={styles.warningReason}>May irritate</Text>
                  </View>
                </View>
              </>
            )}
            {results.concerns && (results.concerns.some((c: any) => c.type.toLowerCase().includes('sensitive')) || results.concerns.some((c: any) => c.type.toLowerCase().includes('redness'))) && (
              <>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>Fragrances & essential oils</Text>
                    <Text style={styles.warningReason}>Common irritants</Text>
                  </View>
                </View>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>Alcohol denat</Text>
                    <Text style={styles.warningReason}>Can dry and irritate</Text>
                  </View>
                </View>
              </>
            )}
            {results.concerns && results.concerns.some((c: any) => c.type.toLowerCase().includes('dry')) && (
              <>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>Harsh sulfates (SLS)</Text>
                    <Text style={styles.warningReason}>Strips natural oils</Text>
                  </View>
                </View>
                <View style={styles.warningItem}>
                  <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                  <View style={styles.warningContent}>
                    <Text style={styles.warningIngredient}>High alcohol content</Text>
                    <Text style={styles.warningReason}>Worsens dryness</Text>
                  </View>
                </View>
              </>
            )}
            {results.concerns && (results.concerns.some((c: any) => c.type.toLowerCase().includes('aging')) || results.concerns.some((c: any) => c.type.toLowerCase().includes('wrinkle'))) && (
              <View style={styles.warningItem}>
                <AlertTriangle color="#EF4444" size={18} strokeWidth={2} />
                <View style={styles.warningContent}>
                  <Text style={styles.warningIngredient}>Skipping SPF</Text>
                  <Text style={styles.warningReason}>UV causes premature aging</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Ingredients That Can Help</Text>
          <View style={styles.recommendationsGrid}>
            {results.recommendations && results.recommendations.map((rec: any, index: number) => {
              const usageColor = getUsageBadgeColor(rec.usage);
              return (
                <View key={index} style={styles.recommendationCard}>
                  <Text style={styles.ingredientName}>{rec.ingredient}</Text>
                  <Text style={styles.ingredientIcon}>✨</Text>
                  <Text style={styles.ingredientReason}>Why it helps:</Text>
                  <Text style={styles.ingredientReasonText}>{rec.reason}</Text>
                  <Text style={styles.productType}>{rec.productType}</Text>
                  <View
                    style={[styles.usageBadge, { backgroundColor: usageColor.bg }]}
                  >
                    <Text style={[styles.usageText, { color: usageColor.text }]}>
                      {rec.usage}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>


        {results.nextSteps && results.nextSteps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Action Plan</Text>
            {results.nextSteps.map((step: string, index: number) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.optionalCard}>
          <Text style={styles.optionalText}>
            💡 <Text style={styles.optionalBold}>Optional:</Text> Want to check if your current products match this advice?
          </Text>
          <TouchableOpacity
            style={styles.optionalButton}
            onPress={() => router.push('/scan-products')}
          >
            <Text style={styles.optionalButtonText}>Scan My Products</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 240 }} />
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            console.log('💾 Saving analysis...');
            try {
              const dataToSave = {
                ...results,
                timestamp: new Date().toISOString(),
              };
              await storage.saveSkinAnalysis(dataToSave);
              console.log('✓ Analysis saved!');
            } catch (error) {
              console.error('Error saving analysis:', error);
            }
            router.push('/home');
          }}
        >
          <Text style={styles.primaryButtonText}>Done - Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/skin-check')}
          >
            <Text style={styles.secondaryButtonText}>Start New Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Share Results', 'Share functionality coming soon!')}
          >
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  scoreTotal: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: -12,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  skinTypeBadge: {
    alignSelf: 'center',
    backgroundColor: '#F1F8F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  skinTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  concernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  concernType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  concernLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  concernDescription: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: '#F1F8F4',
    borderRadius: 16,
    padding: 20,
    width: '48%',
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  ingredientIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  ingredientReason: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  ingredientReasonText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  productType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  usageBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  usageText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  positiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  positiveText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A8C8A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2C',
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    gap: 16,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningIngredient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  warningReason: {
    fontSize: 14,
    color: '#7F1D1D',
  },
  optionalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionalText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionalBold: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  optionalButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionalButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2E8D8',
    padding: 20,
    paddingBottom: 40,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2C2C2C',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#2C2C2C',
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
    backgroundColor: '#2C2C2C',
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
