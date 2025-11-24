import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typewriter } from '@/components/Typewriter';

export default function Intro2() {
  const router = useRouter();
  const [showSecondLine, setShowSecondLine] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Typewriter
            text="No more guessing or scrolling through conflicting advice."
            speed={50}
            style={styles.text}
            onComplete={() => {
              setTimeout(() => setShowSecondLine(true), 500);
            }}
          />
          {showSecondLine && (
            <View style={styles.secondLine}>
              <Typewriter
                text="Becky looks at your skin and explains what it actually needs."
                speed={50}
                style={styles.text}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/onboarding/intro3')}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
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
