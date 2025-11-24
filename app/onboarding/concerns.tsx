import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const concerns = [
  'Acne',
  'Anti-Aging',
  'Dark Spots',
  'Dryness',
  'Sensitivity',
  'Redness',
  'Large Pores',
  'Dullness',
];

export default function ConcernsOnboarding() {
  const router = useRouter();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const handleNext = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>

        <Text style={styles.progressText}>2/5</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>What are your main concerns?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.pillsContainer}>
          {concerns.map((concern) => {
            const isSelected = selectedConcerns.includes(concern);

            return (
              <TouchableOpacity
                key={concern}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
                onPress={() => toggleConcern(concern)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                ]}>
                  {concern}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight color="#FFFFFF" size={20} strokeWidth={2} />
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A8C8A5',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  pill: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FEFEFE',
  },
  pillSelected: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#F2E8D8',
    alignItems: 'center',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 800,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
