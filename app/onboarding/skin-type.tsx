import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Droplet, Sun, Wind, Star } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;
const cardSize = isDesktop ? 180 : Math.min((width - 64) / 2, 160);

type SkinType = 'oily' | 'dry' | 'combo' | 'sensitive' | null;

export default function SkinTypeOnboarding() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<SkinType>(null);

  const handleNext = () => {
    if (selectedType) {
      router.push('/onboarding/concerns');
    }
  };

  const skinTypes = [
    { id: 'oily', label: 'Oily', icon: Droplet },
    { id: 'dry', label: 'Dry', icon: Sun },
    { id: 'combo', label: 'Combo', icon: Wind },
    { id: 'sensitive', label: 'Sens', icon: Star },
  ] as const;

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
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </View>

        <Text style={styles.progressText}>1/5</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Let's personalize your experience</Text>
          <Text style={styles.subtitle}>What's your skin type?</Text>
        </View>

        <View style={styles.grid}>
          {skinTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => setSelectedType(type.id as SkinType)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconBackground,
                  isSelected && styles.iconBackgroundSelected,
                ]}>
                  <Icon
                    color={isSelected ? '#A8C8A5' : '#9CA3AF'}
                    size={32}
                    strokeWidth={2}
                  />
                </View>
                <Text style={[
                  styles.cardLabel,
                  isSelected && styles.cardLabelSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedType && styles.nextButtonActive,
          ]}
          onPress={handleNext}
          disabled={!selectedType}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: cardSize,
    height: cardSize,
    backgroundColor: '#FEFEFE',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: '#A8C8A5',
    backgroundColor: '#A8C8A510',
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBackgroundSelected: {
    backgroundColor: '#A8C8A520',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  cardLabelSelected: {
    color: '#2C2C2C',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonActive: {
    backgroundColor: '#2C2C2C',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
