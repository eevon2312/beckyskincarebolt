import { useState } from 'react';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeSkin } from '@/src/services/api';
const OPENROUTER_API_KEY = Constants?.manifest?.extra?.OPENROUTER_API_KEY || process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
import storage from '@/src/utils/storage';
import SkinAnalysisLoader from '@/components/SkinAnalysisLoader';

export default function FinalOnboarding() {
  const router = useRouter();
  const { data } = useOnboarding();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async () => {
    if (!data.photoBase64) {
      Alert.alert('No Image', 'Please go back and take a photo first');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('🚀 Starting skin analysis...');

      const results = await analyzeSkin(data.photoBase64);
      console.log('✅ Analysis complete!', results);

      await storage.saveSkinAnalysis(results);
      console.log('💾 Results saved to storage');

      // Wait a bit for the loader animation
      setTimeout(() => {
        setIsAnalyzing(false);
        router.push('/skin-results');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      setIsAnalyzing(false);

      let errorMessage = error.message || 'Please try again';

      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = 'API quota exceeded. Please wait 1 minute and try again.';
      }

      Alert.alert('Analysis Failed', errorMessage);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF0F5', '#F8E8FF', '#E6F3FF']}
      style={styles.container}
    >
      <SkinAnalysisLoader
        visible={isAnalyzing}
        onComplete={() => { }} // Handled in handleStartAnalysis
        minimumDuration={2000}
      />

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>All set, {data.name}!</Text>
          <Typewriter
            text="Becky is ready to analyze your unique skin profile."
            speed={50}
            style={styles.heading}
          />
          <Text style={styles.subtext}>
            We'll identify your needs and build a routine just for you.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartAnalysis}
          disabled={isAnalyzing || !OPENROUTER_API_KEY}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {isAnalyzing ? 'Analyzing...' : 'Start Skin Analysis'}
            </Text>
          </LinearGradient>
          {!OPENROUTER_API_KEY && (
            <Text style={{ color: '#EF4444', marginTop: 8, textAlign: 'center' }}>
              API key is missing. Please configure OPENROUTER_API_KEY.
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    gap: 16,
  },
  greeting: {
    fontFamily: 'Lora-Regular',
    fontSize: 20,
    color: '#6B7280',
  },
  heading: {
    fontFamily: 'Lora-Regular',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A2E',
  },
  subtext: {
    fontFamily: 'Lora-Regular',
    fontSize: 18,
    lineHeight: 28,
    color: '#4B5563',
    marginTop: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Lora-SemiBold',
    color: '#FFFFFF',
    fontSize: 18,
  },
});
