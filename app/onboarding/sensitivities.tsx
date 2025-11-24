import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';

const sensitivityOptions = [
  'Fragrance',
  'Alcohol',
  'Exfoliating acids (AHA/BHA)',
  'Retinol',
  "I'm not sure",
  'None of these',
];

export default function SensitivitiesScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selectedSensitivities, setSelectedSensitivities] = useState<string[]>([]);

  const toggleSensitivity = (sensitivity: string) => {
    setSelectedSensitivities((prev) => {
      if (sensitivity === 'None of these') {
        return prev.includes(sensitivity) ? [] : [sensitivity];
      }

      const filtered = prev.filter(s => s !== 'None of these');

      if (prev.includes(sensitivity)) {
        return filtered.filter((s) => s !== sensitivity);
      }
      return [...filtered, sensitivity];
    });
  };

  const handleNext = () => {
    updateData({ sensitivities: selectedSensitivities });
    router.push('/onboarding/photo');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Typewriter
            text="Is your skin sensitive to anything?"
            speed={50}
            style={styles.title}
          />
          <Text style={styles.subtitle}>This helps Becky keep your suggestions gentle.</Text>
        </View>

        <View style={styles.chipsContainer}>
          {sensitivityOptions.map((sensitivity) => {
            const isSelected = selectedSensitivities.includes(sensitivity);

            return (
              <TouchableOpacity
                key={sensitivity}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
                onPress={() => toggleSensitivity(sensitivity)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}>
                  {sensitivity}
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
  content: {
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 120,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    lineHeight: 34,
    color: '#2C2C2C',
    fontWeight: '500',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#F2E8D8',
    alignItems: 'center',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
