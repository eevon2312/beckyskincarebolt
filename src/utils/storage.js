import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SKIN_ANALYSIS: '@skincare_skin_analysis',
  ROUTINES: '@skincare_routines',
  USER_PROFILE: '@skincare_user_profile',
};

const storage = {
  async saveSkinAnalysis(data) {
    try {
      await AsyncStorage.setItem(KEYS.SKIN_ANALYSIS, JSON.stringify(data));
      console.log('💾 Skin analysis saved to storage');
    } catch (error) {
      console.error('Error saving skin analysis:', error);
      throw error;
    }
  },

  async getSkinAnalysis() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SKIN_ANALYSIS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting skin analysis:', error);
      return null;
    }
  },

  async saveRoutines(data) {
    try {
      await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(data));
      console.log('💾 Routines saved to storage');
    } catch (error) {
      console.error('Error saving routines:', error);
      throw error;
    }
  },

  async getRoutines() {
    try {
      const data = await AsyncStorage.getItem(KEYS.ROUTINES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting routines:', error);
      return null;
    }
  },

  async saveUserProfile(data) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(data));
      console.log('💾 User profile saved to storage');
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        KEYS.SKIN_ANALYSIS,
        KEYS.ROUTINES,
        KEYS.USER_PROFILE,
      ]);
      console.log('🗑️ All storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storage;
