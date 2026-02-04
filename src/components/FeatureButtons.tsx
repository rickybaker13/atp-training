// Feature Buttons Component
// Quick access buttons for Team, Leaderboard, Training, and Nutrition features
// Elite Momentum Design System - Gen-Z Aesthetic

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '../theme';

interface FeatureButtonsProps {
  onTeamPress: () => void;
  onLeaderboardPress: () => void;
  onTrainingPlanPress: () => void;
  onNutritionPlanPress: () => void;
  hasTeam: boolean;
  hasCustomPlan: boolean;
  hasNutritionPlan: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FeatureButtonCard: React.FC<{
  icon: string;
  label: string;
  hint: string;
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  variant?: 'team' | 'training' | 'nutrition' | 'leaderboard';
}> = ({
  icon,
  label,
  hint,
  onPress,
  isActive = false,
  disabled = false,
  variant = 'team',
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Color configs per variant
  const getVariantColors = () => {
    switch (variant) {
      case 'team':
        return {
          icon: isActive ? colors.primary : colors.text.muted,
          gradStart: 'rgba(0, 217, 255, 0.1)',
          gradEnd: 'rgba(0, 217, 255, 0.05)',
          border: isActive ? colors.primary : 'rgba(0, 217, 255, 0.3)',
        };
      case 'leaderboard':
        return {
          icon: isActive ? colors.secondary : colors.text.muted,
          gradStart: 'rgba(255, 0, 255, 0.1)',
          gradEnd: 'rgba(255, 0, 255, 0.05)',
          border: isActive ? colors.secondary : 'rgba(255, 0, 255, 0.3)',
        };
      case 'training':
        return {
          icon: colors.success,
          gradStart: 'rgba(57, 255, 20, 0.08)',
          gradEnd: 'rgba(57, 255, 20, 0.02)',
          border: 'rgba(57, 255, 20, 0.3)',
        };
      case 'nutrition':
        return {
          icon: colors.secondary,
          gradStart: 'rgba(255, 0, 255, 0.08)',
          gradEnd: 'rgba(255, 0, 255, 0.02)',
          border: 'rgba(255, 0, 255, 0.3)',
        };
      default:
        return {
          icon: colors.primary,
          gradStart: 'rgba(0, 217, 255, 0.1)',
          gradEnd: 'rgba(0, 217, 255, 0.05)',
          border: 'rgba(0, 217, 255, 0.3)',
        };
    }
  };

  const variantColors = getVariantColors();

  return (
    <AnimatedTouchable
      style={[animatedStyle]}
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[variantColors.gradStart, variantColors.gradEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.featureButton,
          {
            borderColor: variantColors.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {/* Icon Circle with glow */}
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconGlow,
              {
                borderColor: variantColors.icon,
              },
            ]}
          />
          <Ionicons
            name={icon}
            size={24}
            color={variantColors.icon}
            style={styles.icon}
          />
        </View>

        {/* Label and Hint */}
        <Text
          style={[
            styles.buttonLabel,
            typography.buttonSmall,
            { color: colors.text.primary },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.buttonHint,
            { color: colors.text.secondary },
          ]}
        >
          {hint}
        </Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

export const FeatureButtons: React.FC<FeatureButtonsProps> = ({
  onTeamPress,
  onLeaderboardPress,
  onTrainingPlanPress,
  onNutritionPlanPress,
  hasTeam,
  hasCustomPlan,
  hasNutritionPlan,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, typography.caption]}>
        COMPETE & CUSTOMIZE
      </Text>

      {/* Top Row - Team and Leaderboard */}
      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <FeatureButtonCard
            icon={hasTeam ? "people" : "people-outline"}
            label={hasTeam ? 'My Team' : 'Join Team'}
            hint={hasTeam ? 'Your squad' : 'Compete!'}
            onPress={onTeamPress}
            isActive={hasTeam}
            variant="team"
          />
        </View>

        <View style={{ flex: 1 }}>
          <FeatureButtonCard
            icon="trophy-outline"
            label="Leaderboard"
            hint={hasTeam ? 'Rankings' : 'Join team'}
            onPress={onLeaderboardPress}
            disabled={!hasTeam}
            isActive={hasTeam}
            variant="leaderboard"
          />
        </View>
      </View>

      {/* Bottom Row - Training and Nutrition Plans */}
      <View style={[styles.buttonRow, { marginTop: spacing.md }]}>
        <View style={{ flex: 1 }}>
          <FeatureButtonCard
            icon="barbell-outline"
            label={hasCustomPlan ? 'New Plan' : 'Training'}
            hint="AI-Powered"
            onPress={onTrainingPlanPress}
            variant="training"
          />
        </View>

        <View style={{ flex: 1 }}>
          <FeatureButtonCard
            icon="nutrition-outline"
            label={hasNutritionPlan ? 'Update Diet' : 'Nutrition'}
            hint="AI-Powered"
            onPress={onNutritionPlanPress}
            variant="nutrition"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  featureButton: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 140,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    opacity: 0.4,
  },
  icon: {
    zIndex: 1,
  },
  buttonLabel: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  buttonHint: {
    fontSize: 11,
    textAlign: 'center',
  },
});

export default FeatureButtons;
