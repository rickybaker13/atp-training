// New User Setup Screen
// Onboarding flow for new users to create their custom plan

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoachBot } from '../components/CoachBot';
import { supabaseService } from '../services';
import { GeneratedTrainingPlan, GeneratedNutritionPlan } from '../types';

interface NewUserSetupProps {
  onComplete: (plan: GeneratedTrainingPlan, nutritionPlan?: GeneratedNutritionPlan) => void;
  onSkip: () => void; // For users who want to use the default Ollie plan
}

type SetupStep = 'welcome' | 'api-key' | 'training' | 'nutrition-offer' | 'nutrition' | 'complete';

const STORAGE_KEY_API = 'mountain_openrouter_api_key';
const STORAGE_KEY_PLAN = 'mountain_generated_plan';
const STORAGE_KEY_NUTRITION = 'mountain_nutrition_plan';

export const NewUserSetup: React.FC<NewUserSetupProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<SetupStep>('welcome');
  const [apiKey, setApiKey] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [trainingPlan, setTrainingPlan] = useState<GeneratedTrainingPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<GeneratedNutritionPlan | null>(null);

  const handleApiKeySubmit = async () => {
    if (!apiKey.trim()) {
      Alert.alert('API Key Required', 'Please enter your OpenRouter API key to continue.');
      return;
    }

    setIsValidatingKey(true);

    // Basic validation - check if it looks like an API key
    if (apiKey.length < 20) {
      Alert.alert('Invalid Key', 'This doesn\'t look like a valid API key. Please check and try again.');
      setIsValidatingKey(false);
      return;
    }

    // Save the API key
    await AsyncStorage.setItem(STORAGE_KEY_API, apiKey.trim());
    setIsValidatingKey(false);
    setStep('training');
  };

  const handleTrainingPlanComplete = async (plan: GeneratedTrainingPlan) => {
    setTrainingPlan(plan);
    await AsyncStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
    setStep('nutrition-offer');
  };

  const handleNutritionPlanComplete = async (plan: GeneratedNutritionPlan) => {
    setNutritionPlan(plan);
    await AsyncStorage.setItem(STORAGE_KEY_NUTRITION, JSON.stringify(plan));
    setStep('complete');
  };

  const handleFinish = () => {
    if (trainingPlan) {
      onComplete(trainingPlan, nutritionPlan || undefined);
    }
  };

  const renderWelcome = () => (
    <View style={styles.content}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>⛰️</Text>
      </View>
      <Text style={styles.title}>THE MOUNTAIN</Text>
      <Text style={styles.subtitle}>Your Personal Training Journey</Text>

      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🤖</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>AI-Powered Plans</Text>
            <Text style={styles.featureDesc}>Custom training built for YOUR goals</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🏆</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Team Competition</Text>
            <Text style={styles.featureDesc}>Compete with friends on leaderboards</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🥗</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Nutrition Tracking</Text>
            <Text style={styles.featureDesc}>Optional meal plans to fuel performance</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setStep('api-key')}
      >
        <Text style={styles.primaryButtonText}>Create My Custom Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Use Default Plan (Ollie's Baseball)</Text>
      </TouchableOpacity>
    </View>
  );

  const renderApiKeyStep = () => (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('welcome')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Text style={styles.mainIcon}>🔑</Text>
      </View>
      <Text style={styles.title}>Connect AI</Text>
      <Text style={styles.subtitle}>
        Enter your OpenRouter API key to enable AI-powered plan generation.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Get your free API key at{'\n'}
          <Text style={styles.infoLink}>openrouter.ai</Text>
        </Text>
      </View>

      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="sk-or-v1-..."
        placeholderTextColor="#666"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.primaryButton, !apiKey.trim() && styles.buttonDisabled]}
        onPress={handleApiKeySubmit}
        disabled={!apiKey.trim() || isValidatingKey}
      >
        {isValidatingKey ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryButtonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.privacyNote}>
        Your API key is stored locally and never shared.
      </Text>
    </View>
  );

  const renderNutritionOffer = () => (
    <View style={styles.content}>
      <View style={styles.successBadge}>
        <Text style={styles.successIcon}>✓</Text>
      </View>
      <Text style={styles.title}>Training Plan Ready!</Text>
      <Text style={styles.subtitle}>
        Your {trainingPlan?.durationWeeks}-week {trainingPlan?.sport} training program is all set.
      </Text>

      <View style={styles.offerCard}>
        <Text style={styles.offerIcon}>🥗</Text>
        <Text style={styles.offerTitle}>Add Nutrition Plan?</Text>
        <Text style={styles.offerDesc}>
          Get a personalized meal plan to fuel your training and earn extra points!
        </Text>
        <Text style={styles.offerPrice}>+$0.99</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setStep('nutrition')}
      >
        <Text style={styles.primaryButtonText}>Add Nutrition Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => setStep('complete')}
      >
        <Text style={styles.skipButtonText}>Skip for Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.content}>
      <View style={styles.celebrationContainer}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
      </View>
      <Text style={styles.title}>You're All Set!</Text>
      <Text style={styles.subtitle}>
        Your personalized {trainingPlan?.sport} training program is ready to go.
        {nutritionPlan && '\n\nYour nutrition plan is also ready!'}
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sport</Text>
          <Text style={styles.summaryValue}>{trainingPlan?.sport}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{trainingPlan?.durationWeeks} weeks</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phases</Text>
          <Text style={styles.summaryValue}>{trainingPlan?.phases.length}</Text>
        </View>
        {nutritionPlan && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nutrition</Text>
            <Text style={styles.summaryValue}>✓ Included</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
        <Text style={styles.primaryButtonText}>Start Training! 💪</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Coach Bot modals
  if (step === 'training') {
    return (
      <Modal visible={true} animationType="slide">
        <CoachBot
          planType="training"
          apiKey={apiKey}
          onComplete={handleTrainingPlanComplete}
          onClose={() => setStep('api-key')}
        />
      </Modal>
    );
  }

  if (step === 'nutrition') {
    return (
      <Modal visible={true} animationType="slide">
        <CoachBot
          planType="nutrition"
          apiKey={apiKey}
          onComplete={handleNutritionPlanComplete}
          onClose={() => setStep('nutrition-offer')}
        />
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {step === 'welcome' && renderWelcome()}
        {step === 'api-key' && renderApiKeyStep()}
        {step === 'nutrition-offer' && renderNutritionOffer()}
        {step === 'complete' && renderComplete()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(243,156,18,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(243,156,18,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainIcon: {
    fontSize: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  featureList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    color: '#888',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#888',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 8,
  },
  backButtonText: {
    color: '#f39c12',
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'rgba(243,156,18,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  infoText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoLink: {
    color: '#f39c12',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  privacyNote: {
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(46,204,113,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIcon: {
    color: '#2ecc71',
    fontSize: 40,
    fontWeight: '700',
  },
  offerCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(243,156,18,0.3)',
  },
  offerIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  offerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  offerDesc: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  offerPrice: {
    color: '#f39c12',
    fontSize: 16,
    fontWeight: '700',
  },
  celebrationContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(243,156,18,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  celebrationEmoji: {
    fontSize: 50,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NewUserSetup;
