import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';

export default function FinalScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [showSecondLine, setShowSecondLine] = useState(false);

  const handleStartAnalysis = () => {
    router.push('/skin-check');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Typewriter
            text={`Thank you, ${data.name}. Becky has what she needs to look after your skin.`}
            speed={50}
            style={styles.text}
            onComplete={() => {
              setTimeout(() => setShowSecondLine(true), 500);
            }}
          />
          {showSecondLine && (
            <View style={styles.secondLine}>
              <Typewriter
                text="We'll use your photo and answers to give you a gentle, personalised skin analysis."
                speed={50}
                style={styles.text}
              />
            </View>
          )}
        </View>
      </View>

      {showSecondLine && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartAnalysis}
          >
            <Text style={styles.primaryButtonText}>Start Skin Analysis</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 24,
    lineHeight: 36,
    color: '#2C2C2C',
    textAlign: 'center',
    fontWeight: '500',
  },
  secondLine: {
    marginTop: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#2C2C2C',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
