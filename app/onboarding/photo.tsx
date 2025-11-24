import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Typewriter } from '@/components/Typewriter';
import { Camera, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>('');

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library permission is needed to upload photos.');
      return false;
    }
    return true;
  };

  const handleOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setPhotoUri('');
  };

  const handleNext = () => {
    if (photoUri) {
      updateData({ photoUri });
      router.push('/onboarding/final');
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
            text="Now let's take a closer look at your skin."
            speed={50}
            style={styles.title}
            onComplete={() => {
              setTimeout(() => setShowSecondLine(true), 500);
            }}
          />
          {showSecondLine && (
            <Text style={styles.subtitle}>
              Please take a clear photo of the area you'd like Becky to focus on – for example your cheeks, forehead, chin, or around the mouth.
            </Text>
          )}
        </View>

        {showSecondLine && (
          <>
            <View style={styles.guidelinesList}>
              <Text style={styles.guidelineItem}>• Remove heavy make-up if you can.</Text>
              <Text style={styles.guidelineItem}>• Stand near natural light.</Text>
              <Text style={styles.guidelineItem}>• Fill the frame with the area you care about.</Text>
              <Text style={styles.guidelineItem}>• Avoid filters or beauty modes.</Text>
            </View>

            {photoUri ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                <TouchableOpacity style={styles.removeButton} onPress={handleRetake}>
                  <X color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.primaryAction} onPress={handleOpenCamera}>
                  <Camera color="#FFFFFF" size={24} />
                  <Text style={styles.primaryActionText}>Open Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryAction} onPress={handleUploadPhoto}>
                  <Upload color="#2C2C2C" size={20} />
                  <Text style={styles.secondaryActionText}>Upload a photo instead</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {photoUri && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 100,
    paddingBottom: 140,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    lineHeight: 34,
    color: '#2C2C2C',
    fontWeight: '500',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  guidelinesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  guidelineItem: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 8,
  },
  actionsContainer: {
    gap: 16,
  },
  primaryAction: {
    backgroundColor: '#2C2C2C',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  secondaryActionText: {
    color: '#2C2C2C',
    fontSize: 15,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
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
