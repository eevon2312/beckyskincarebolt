import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lightbulb, ChevronDown, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import SkinAnalysisLoader from '@/components/SkinAnalysisLoader';
import { analyzeSkin } from '../src/services/api';
import storage from '../src/utils/storage';

export default function SkinCheck() {
  const router = useRouter();
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setSelectedImage(uri);
      setImageBase64(`data:image/jpeg;base64,${base64}`);
      console.log('📷 Skin image selected and converted to base64');
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setSelectedImage(uri);
      setImageBase64(`data:image/jpeg;base64,${base64}`);
      console.log('📷 Skin photo taken and converted to base64');
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('🚀 Starting skin analysis...');

      const results = await analyzeSkin(imageBase64);
      console.log('✅ Analysis complete!', results);

      await storage.saveSkinAnalysis(results);
      console.log('💾 Results saved to storage');

      setTimeout(() => {
        setIsAnalyzing(false);
        router.push('/skin-results');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      setIsAnalyzing(false);

      let errorMessage = error.message || 'Please try again';

      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = 'API quota exceeded. Please wait 1 minute and try again, or get a new API key from Google AI Studio.';
      }

      Alert.alert('Analysis Failed', errorMessage);
    }
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    router.push('/skin-results');
  };

  return (
    <View style={styles.container}>
      <SkinAnalysisLoader
        visible={isAnalyzing}
        onComplete={handleAnalysisComplete}
        minimumDuration={4000}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft color="#2C2C2C" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Skin Check</Text>
            <Text style={styles.subtitle}>Let's analyze your skin</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tipsCard}
          onPress={() => setTipsExpanded(!tipsExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.tipsHeader}>
            <View style={styles.tipsHeaderLeft}>
              <Lightbulb color="#F59E0B" size={20} strokeWidth={2} />
              <Text style={styles.tipsTitle}>📸 Tips for best results</Text>
            </View>
            <ChevronDown
              color="#2C2C2C"
              size={20}
              strokeWidth={2}
              style={{
                transform: [{ rotate: tipsExpanded ? '180deg' : '0deg' }],
              }}
            />
          </View>

          {tipsExpanded && (
            <View style={styles.tipsContent}>
              <Text style={styles.tipItem}>• Use natural lighting</Text>
              <Text style={styles.tipItem}>• Face camera directly</Text>
              <Text style={styles.tipItem}>• Remove makeup if possible</Text>
              <Text style={styles.tipItem}>• Keep neutral expression</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.previewContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Camera color="#9CA3AF" size={80} strokeWidth={1.5} />
              <Text style={styles.previewText}>Position your face in the frame</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          {selectedImage ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAnalyze}
              >
                <Text style={styles.primaryButtonText}>Analyze My Skin</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.outlineButtonText}>Choose Different Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={takePhoto}
              >
                <Camera color="#FFFFFF" size={20} strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Take Selfie Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={pickImageFromGallery}
              >
                <ImageIcon color="#2C2C2C" size={20} strokeWidth={2} />
                <Text style={styles.outlineButtonText}>Upload from Gallery</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  tipsContent: {
    marginTop: 12,
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  previewContainer: {
    maxHeight: 500,
    minHeight: 300,
    height: 400,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewPlaceholder: {
    flex: 1,
    backgroundColor: '#F8F3E8',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#A8C8A5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  previewText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
  },
  buttonsContainer: {
    marginHorizontal: 20,
    gap: 12,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  primaryButton: {
    height: 56,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  outlineButtonText: {
    color: '#2C2C2C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
