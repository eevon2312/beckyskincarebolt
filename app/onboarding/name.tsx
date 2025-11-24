import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typewriter } from '@/components/Typewriter';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function NameScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [name, setName] = useState('');

  const handleNext = () => {
    updateData({ name: name.trim() });
    router.push('/onboarding/concerns');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Typewriter
            text="Let's make this routine yours."
            speed={50}
            style={styles.heading}
          />
          <Text style={styles.subtext}>What should Becky call you?</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          autoFocus
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={name.trim().length > 0 ? handleNext : undefined}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, name.trim().length === 0 && styles.primaryButtonDisabled]}
          onPress={handleNext}
          disabled={name.trim().length === 0}
        >
          <Text style={[styles.primaryButtonText, name.trim().length === 0 && styles.primaryButtonTextDisabled]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E8D8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  textContainer: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 28,
    lineHeight: 38,
    color: '#2C2C2C',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#2C2C2C',
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
  primaryButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
