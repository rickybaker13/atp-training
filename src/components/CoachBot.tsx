// Coach Bot Component
// Conversational UI for gathering user information and generating plans

import React, { useState, useRef, useEffect } from 'react';
import { colors, typography, spacing } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  trainingQuestions,
  nutritionQuestions,
  getPositionsForSport,
} from '../config/coachQuestions';
import { CoachQuestion, CoachOption, CoachConversation } from '../types';
import { purchaseService } from '../services/purchaseService';

const { width } = Dimensions.get('window');

interface CoachBotProps {
  planType: 'training' | 'nutrition';
  onComplete: (plan: any, nutritionPlan?: any) => void;
  onClose: () => void;
  includeNutrition?: boolean; // For training plans, also generate nutrition
  apiKey?: string; // Optional - kept for backward compatibility
}

interface ChatMessage {
  id: string;
  type: 'coach' | 'user';
  content: string;
  timestamp: Date;
}

export const CoachBot: React.FC<CoachBotProps> = ({
  planType,
  onComplete,
  onClose,
  includeNutrition = false,
  apiKey, // kept for backward compatibility, not used
}) => {
  const questions = planType === 'training' ? trainingQuestions : nutritionQuestions;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [numericInput, setNumericInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize with first coach message
  useEffect(() => {
    showCoachMessage(questions[0].coachMessage, questions[0].question);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const showCoachMessage = (message: string, question?: string) => {
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const newMessages: ChatMessage[] = [];

      if (message) {
        newMessages.push({
          id: `coach-${Date.now()}-1`,
          type: 'coach',
          content: message,
          timestamp: new Date(),
        });
      }

      if (question) {
        newMessages.push({
          id: `coach-${Date.now()}-2`,
          type: 'coach',
          content: question,
          timestamp: new Date(),
        });
      }

      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);

      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 800);
  };

  const getCurrentQuestion = (): CoachQuestion => {
    const question = questions[currentStep];

    // Handle dynamic position options based on sport(s)
    if (question.id === 'position' && answers.sport) {
      // answers.sport can be string (single) or array (multi-select)
      return {
        ...question,
        options: getPositionsForSport(answers.sport),
      };
    }

    return question;
  };

  const handleOptionSelect = (option: CoachOption) => {
    const question = getCurrentQuestion();

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `${option.icon || ''} ${option.label}`.trim(),
      timestamp: new Date(),
    }]);

    // Save answer
    const newAnswers = { ...answers, [question.id]: option.id };
    setAnswers(newAnswers);

    // Move to next question or complete
    moveToNextQuestion(newAnswers, option.label);
  };

  const handleMultiSelect = (selectedIds: string[]) => {
    const question = getCurrentQuestion();

    // Get labels for display
    const selectedLabels = question.options
      ?.filter(opt => selectedIds.includes(opt.id))
      .map(opt => `${opt.icon || ''} ${opt.label}`.trim())
      .join(', ');

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      content: selectedLabels || 'None selected',
      timestamp: new Date(),
    }]);

    // Save answer
    const newAnswers = { ...answers, [question.id]: selectedIds };
    setAnswers(newAnswers);

    moveToNextQuestion(newAnswers, selectedLabels || 'None');
  };

  const handleNumericSubmit = () => {
    const question = getCurrentQuestion();
    const value = parseInt(numericInput, 10);

    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (question.validation) {
      if (question.validation.min && value < question.validation.min) {
        setError(`Value must be at least ${question.validation.min}`);
        return;
      }
      if (question.validation.max && value > question.validation.max) {
        setError(`Value must be at most ${question.validation.max}`);
        return;
      }
    }

    setError(null);

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      content: numericInput,
      timestamp: new Date(),
    }]);

    // Save answer
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setNumericInput('');

    moveToNextQuestion(newAnswers, numericInput);
  };

  const moveToNextQuestion = (newAnswers: any, userAnswer: string) => {
    const question = getCurrentQuestion();
    const nextStep = currentStep + 1;

    if (nextStep >= questions.length) {
      // All questions answered - generate plan
      generatePlan(newAnswers);
      return;
    }

    setCurrentStep(nextStep);

    // Show follow-up message if available, then next question
    const nextQuestion = questions[nextStep];
    let followUp = question.followUpMessage;

    if (followUp) {
      // Replace placeholder with answer
      followUp = followUp.replace(`{${question.id}}`, userAnswer);
    }

    setTimeout(() => {
      showCoachMessage(
        followUp || '',
        nextQuestion.coachMessage + '\n\n' + nextQuestion.question
      );
    }, 500);
  };

  const generatePlan = async (finalAnswers: any) => {
    setIsGenerating(true);

    // Get pricing info
    const pricing = purchaseService.getPricing();

    // Show payment message
    setMessages(prev => [...prev, {
      id: `coach-payment`,
      type: 'coach',
      content: planType === 'training'
        ? `Perfect! I've got everything I need. 💪\n\nYour custom AI-generated training plan is ${pricing.training}.${includeNutrition ? ` The nutrition add-on is an additional ${pricing.nutrition}.` : ''}\n\nProcessing your order now...`
        : `Awesome! I've got all your info. 🥗\n\nYour custom nutrition plan is ${pricing.nutrition}.\n\nProcessing your order now...`,
      timestamp: new Date(),
    }]);

    try {
      // Use purchase service - handles payment AND generation
      const result = await purchaseService.purchaseAndGenerateTrainingPlan(
        finalAnswers,
        includeNutrition,
        (status) => {
          setGenerationStatus(status);
          // Update the generating message with status
          setMessages(prev => {
            const updated = [...prev];
            const lastCoachMsg = updated.findLastIndex(m => m.type === 'coach');
            if (lastCoachMsg >= 0 && updated[lastCoachMsg].id === 'coach-status') {
              updated[lastCoachMsg] = {
                ...updated[lastCoachMsg],
                content: `${status} ⏳`,
              };
            } else {
              updated.push({
                id: 'coach-status',
                type: 'coach',
                content: `${status} ⏳`,
                timestamp: new Date(),
              });
            }
            return updated;
          });
        }
      );

      if (result.success && result.trainingPlan) {
        setMessages(prev => [...prev, {
          id: `coach-complete`,
          type: 'coach',
          content: planType === 'training'
            ? `🎉 Your program is ready! I've built you a personalized ${result.trainingPlan?.durationWeeks || ''}-week plan based on everything you told me.${result.nutritionPlan ? ' Your nutrition plan is ready too!' : ''}\n\nLet's get after it! 💪`
            : "🎉 Your nutrition plan is ready! Follow these guidelines and watch your performance improve!",
          timestamp: new Date(),
        }]);

        setTimeout(() => {
          onComplete(result.trainingPlan, result.nutritionPlan);
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to generate plan');
      }
    } catch (error: any) {
      setError(error.message);
      setMessages(prev => [...prev, {
        id: `coach-error`,
        type: 'coach',
        content: `Oops! Something went wrong: ${error.message}\n\nNo charges were made. Would you like to try again?`,
        timestamp: new Date(),
      }]);
      setIsGenerating(false);
    }
  };

  const renderOptions = () => {
    const question = getCurrentQuestion();

    if (question.type === 'numeric') {
      return (
        <View style={styles.numericContainer}>
          <TextInput
            style={styles.numericInput}
            value={numericInput}
            onChangeText={setNumericInput}
            keyboardType="numeric"
            placeholder="Enter value..."
            placeholderTextColor="#666"
            autoFocus
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleNumericSubmit}
          >
            <Text style={styles.submitButtonText}>Continue →</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      );
    }

    if (question.type === 'multi-select') {
      return <MultiSelectOptions question={question} onSubmit={handleMultiSelect} />;
    }

    // Single select
    return (
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => handleOptionSelect(option)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0f', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>COACH</Text>
            <Text style={styles.headerSubtitle}>
              {planType === 'training' ? 'Training Plan Builder' : 'Nutrition Plan Builder'}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentStep + 1}/{questions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        {/* Chat Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <Animated.View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.type === 'coach' ? styles.coachBubble : styles.userBubble,
                ]}
              >
                {message.type === 'coach' && (
                  <View style={styles.coachAvatar}>
                    <Text style={styles.coachAvatarText}>🏋️</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageContent,
                    message.type === 'coach'
                      ? styles.coachMessageContent
                      : styles.userMessageContent,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.type === 'user' && styles.userMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </Animated.View>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <View style={[styles.messageBubble, styles.coachBubble]}>
                <View style={styles.coachAvatar}>
                  <Text style={styles.coachAvatarText}>🏋️</Text>
                </View>
                <View style={[styles.messageContent, styles.coachMessageContent]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            )}

            {/* Generating indicator */}
            {isGenerating && (
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="large" color="colors.primary" />
                <Text style={styles.generatingText}>
                  Building your {planType === 'training' ? 'program' : 'meal plan'}...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Options/Input Area */}
          {!isTyping && !isGenerating && currentStep < questions.length && (
            <View style={styles.inputArea}>
              {renderOptions()}
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

// Multi-select component with optional maxSelections limit
const MultiSelectOptions: React.FC<{
  question: CoachQuestion;
  onSubmit: (selectedIds: string[]) => void;
}> = ({ question, onSubmit }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const maxSelections = question.maxSelections;

  const toggleOption = (id: string) => {
    // Handle "none" option specially
    if (id === 'none') {
      setSelected(['none']);
      return;
    }

    // Remove "none" if selecting other options
    let newSelected = selected.filter(s => s !== 'none');

    if (newSelected.includes(id)) {
      // Always allow deselection
      newSelected = newSelected.filter(s => s !== id);
    } else {
      // Check if we've reached maxSelections limit
      if (maxSelections && newSelected.length >= maxSelections) {
        // Don't add more if at limit
        return;
      }
      newSelected = [...newSelected, id];
    }

    setSelected(newSelected);
  };

  const isAtLimit = maxSelections ? selected.length >= maxSelections : false;

  return (
    <View style={styles.multiSelectContainer}>
      {maxSelections && (
        <Text style={styles.maxSelectionsHint}>
          Select up to {maxSelections} ({selected.length}/{maxSelections})
        </Text>
      )}
      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = selected.includes(option.id);
          const isDisabled = isAtLimit && !isSelected && option.id !== 'none';

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                styles.multiSelectOption,
                isSelected && styles.optionSelected,
                isDisabled && styles.optionDisabled,
              ]}
              onPress={() => toggleOption(option.id)}
              disabled={isDisabled}
            >
              <Text style={[styles.optionIcon, isDisabled && styles.optionIconDisabled]}>
                {option.icon}
              </Text>
              <Text style={[styles.optionLabel, isDisabled && styles.optionLabelDisabled]}>
                {option.label}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={[
          styles.submitButton,
          selected.length === 0 && styles.submitButtonDisabled,
        ]}
        onPress={() => onSubmit(selected)}
        disabled={selected.length === 0}
      >
        <Text style={styles.submitButtonText}>
          Continue ({selected.length} selected) →
        </Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'colors.primary',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    width: 36,
    alignItems: 'flex-end',
  },
  progressText: {
    color: '#888',
    fontSize: 12,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'colors.primary',
    borderRadius: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  coachBubble: {
    justifyContent: 'flex-start',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  coachAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  coachAvatarText: {
    fontSize: 18,
  },
  messageContent: {
    maxWidth: width * 0.7,
    borderRadius: 16,
    padding: 12,
  },
  coachMessageContent: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  userMessageContent: {
    backgroundColor: 'colors.primary',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000',
    fontWeight: '500',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  inputArea: {
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  multiSelectOption: {
    position: 'relative',
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 217, 255,0.2)',
    borderColor: 'colors.primary',
  },
  optionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  multiSelectContainer: {
    gap: 16,
  },
  maxSelectionsHint: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionIconDisabled: {
    opacity: 0.5,
  },
  optionLabelDisabled: {
    color: '#666',
  },
  numericContainer: {
    gap: 12,
  },
  numericInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  submitButton: {
    backgroundColor: 'colors.primary',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(0, 217, 255,0.4)',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: 'colors.tertiary',
    fontSize: 13,
    textAlign: 'center',
  },
  generatingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  generatingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 12,
  },
});

export default CoachBot;
