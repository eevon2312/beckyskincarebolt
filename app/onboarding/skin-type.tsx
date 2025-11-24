import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';

const skinTypes = [
  'Oily',
  'Dry',
  'Combination',
  'Normal',
  'Sensitive',
  "I'm not sure",
];

export default function SkinTypeOnboarding() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selectedType, setSelectedType] = useState<string>('');

  const handleNext = () => {
    if (selectedType) {
      updateData({ skinType: selectedType });
      router.push('/onboarding/sensitivities');
    }
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
            text="How would you describe your skin most days?"
            speed={50}
            style={styles.title}
          />
        </View>

        <View style={styles.cardsContainer}>
          {skinTypes.map((type) => {
            const isSelected = selectedType === type;

            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelectedType(type)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.cardText,
                  isSelected && styles.cardTextSelected,
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedType && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedType}
        >
          <Text style={[
            styles.nextButtonText,
            !selectedType && styles.nextButtonTextDisabled,
          ]}>
            Next
          </Text>
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
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#2C2C2C',
    backgroundColor: '#F9FAFB',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  cardTextSelected: {
    fontWeight: 'bold',
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
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
