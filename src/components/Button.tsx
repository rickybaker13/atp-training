/**
 * Elite Momentum Button Component
 * With Reanimated v2 animations
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  labelStyle,
  icon,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = async () => {
    scale.value = withSpring(0.92);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Size configs
  const sizeConfig = {
    small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    medium: { paddingVertical: 14, paddingHorizontal: spacing.lg },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  // Variant configs
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: [colors.primary, colors.secondary],
          textColor: '#000',
        };
      case 'secondary':
        return {
          background: [colors.secondary, colors.primary],
          textColor: '#FFF',
        };
      case 'tertiary':
        return {
          background: [colors.success, colors.tertiary],
          textColor: '#000',
        };
      case 'outline':
        return {
          background: ['transparent', 'transparent'],
          textColor: colors.primary,
          border: 2,
          borderColor: colors.primary,
        };
      default:
        return {
          background: [colors.primary, colors.secondary],
          textColor: '#000',
        };
    }
  };

  const variantStyle = getVariantStyles();
  const paddingConfig = sizeConfig[size];

  const buttonContent = (
    <LinearGradient
      colors={variantStyle.background as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.buttonGradient,
        paddingConfig,
        {
          borderRadius: spacing.borderRadius.xl,
          borderWidth: variantStyle.border || 0,
          borderColor: variantStyle.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.icon}>{icon}</View>}
        {loading ? (
          <ActivityIndicator
            color={variantStyle.textColor}
            size="small"
          />
        ) : (
          <Text
            style={[
              typography.buttonLarge,
              {
                color: variantStyle.textColor,
                fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
              },
              labelStyle,
            ]}
          >
            {label.toUpperCase()}
          </Text>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle, style]}
    >
      {buttonContent}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  buttonGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
});

export default Button;
