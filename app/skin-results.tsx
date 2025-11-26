import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, AlertCircle, AlertTriangle, Package, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const size = 160;
  const strokeWidth = 10;
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
    // Mock data for verification
    setResults({
      healthScore: 85,
      skinType: 'Combination',
      concerns: [
        { type: 'Acne', severity: 'mild', location: 'Forehead', description: 'Small bumps detected' },
        { type: 'Dryness', severity: 'moderate', location: 'Cheeks', description: 'Flaky patches observed' }
      ],
      recommendations: [
        { ingredient: 'Salicylic Acid', reason: 'Unclogs pores', productType: 'Cleanser', usage: 'PM' },
        { ingredient: 'Hyaluronic Acid', reason: 'Hydrates skin', productType: 'Serum', usage: 'AM' }
      ],
      nextSteps: ['Cleanse twice daily', 'Apply moisturizer']
    });
    setLoading(false);
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
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Skin Analysis</Text>
            <Text style={styles.timestamp}>26 November 2025</Text>
          </View>
        </View>

        <View style={styles.disclaimerCard}>
          <AlertCircle color="#6B7280" size={20} strokeWidth={2} />
          <Text style={styles.disclaimerText}>
            Becky offers informational skincare insights only. It does not diagnose, treat, or prevent medical conditions. For concerns about your skin health, please consult a qualified professional.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.cardTitle}>Skin Health Score</Text>
          <CircularProgress score={results.healthScore} />
          <View style={[
            styles.scoreBadge,
            { backgroundColor: '#E8F5F1' }
          ]}>
            <Text style={[
              styles.scoreBadgeText,
              { color: '#10B981' }
            ]}>
              Excellent
            </Text>
          </View>
        </View>

        <View style={styles.skinTypeCard}>
          <Text style={styles.cardTitle}>Skin Type</Text>
          <View style={styles.skinTypeRow}>
            <View style={styles.skinTypeBadge}>
              <Text style={styles.skinTypeText}>{results.skinType}</Text>
            </View>
            <Text style={styles.skinTypeDescription}>Well-balanced skin</Text>
          </View>
        </View>

        <View style={styles.concernsCard}>
          <Text style={styles.cardTitle}>Concerns Detected</Text>
          {results.concerns && results.concerns.map((concern: any, index: number) => (
            <View key={index} style={styles.concernItem}>
              <View style={[
                styles.concernIndicator,
                { backgroundColor: getSeverityColor(concern.severity) }
              ]} />
              <View style={styles.concernContent}>
                <View style={styles.concernHeader}>
                  <Text style={styles.concernType}>{concern.type}</Text>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: concern.severity === 'mild' ? '#FEF3C7' : getSeverityColor(concern.severity) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityText,
                        { color: concern.severity === 'mild' ? '#D97706' : getSeverityColor(concern.severity) }
                      ]}
                    >
                      {concern.severity.charAt(0).toUpperCase() + concern.severity.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.concernLocation}>Concentrated around {concern.location}</Text>
                <Text style={styles.concernDescription}>{concern.description}</Text>
              </View>
            </View>
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

        <View style={{ height: 240 }} />
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/routine-results')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonText}>View Action Plan</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
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
            }}
          >
            <Text style={styles.secondaryButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              // Share logic would go here
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
  title: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  timestamp: {
    fontFamily: 'Lora-Regular',
    fontSize: 12,
    color: '#6B6B7A',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
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
    fontSize: 56,
    fontFamily: 'Lora-Bold',
    color: '#2C2C2C',
  },
  scoreTotal: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: -10,
    fontFamily: 'Lora-Regular',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontFamily: 'Lora-Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Lora-Bold',
    color: '#2C2C2C',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'Lora-Regular',
  },
  cardTitle: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 18,
    color: '#1A1A2E',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  scoreBadge: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  scoreBadgeText: {
    fontFamily: 'Lora-Medium',
    fontSize: 14,
  },
  skinTypeCard: {
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
  skinTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skinTypeBadge: {
    backgroundColor: '#8B7355',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  skinTypeText: {
    fontFamily: 'Lora-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  skinTypeDescription: {
    fontFamily: 'Lora-Regular',
    fontSize: 15,
    color: '#4A4A5E',
  },
  concernsCard: {
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
  concernItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  concernIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
    backgroundColor: '#F59E0B',
  },
  concernContent: {
    flex: 1,
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  concernType: {
    fontSize: 16,
    fontFamily: 'Lora-Bold',
    color: '#2C2C2C',
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  severityText: {
    fontSize: 11,
    fontFamily: 'Lora-Bold',
  },
  concernLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Lora-Regular',
  },
  concernDescription: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
    lineHeight: 20,
    fontFamily: 'Lora-Regular',
  },
  recommendationsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: '#F1F8F4',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 12,
  },
  ingredientName: {
    fontSize: 16,
    fontFamily: 'Lora-Bold',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  ingredientIcon: {
    fontSize: 24,
    marginBottom: 8,
    fontFamily: 'Lora-Regular',
  },
  ingredientReason: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Lora-Regular',
  },
  ingredientReasonText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Lora-Regular',
  },
  // Updated product pill to remove brown background and show text
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
  productType: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Lora-Regular',
  },
  usageBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  usageText: {
    fontSize: 11,
    fontFamily: 'Lora-Bold',
  },
  positiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
    fontFamily: 'Lora-Medium',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
    fontFamily: 'Lora-Bold',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#2C2C2C',
    fontFamily: 'Lora-Regular',
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
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
    fontSize: 15,
    fontFamily: 'Lora-Bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  warningReason: {
    fontSize: 14,
    color: '#7F1D1D',
    fontFamily: 'Lora-Regular',
  },
  disclaimerCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: {
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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

