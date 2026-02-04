/**
 * Elite Momentum Card Component
 * Glassmorphic design with cyan glow
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'gradient';
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'glass',
  glow = true,
}) => {
  const glassCardStyle = {
    backgroundColor: 'rgba(15, 26, 46, 0.8)',
    borderWidth: 1,
    borderColor: colors.transparent.cyan,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.md,
    overflow: 'hidden' as const,
    ...(glow && spacing.shadows.glow),
  };

  const gradientCardStyle = {
    backgroundColor: colors.background.card,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.md,
    overflow: 'hidden' as const,
  };

  const containerStyle =
    variant === 'glass' ? glassCardStyle : gradientCardStyle;

  // iOS: Use BlurView for true glassmorphism
  if (Platform.OS === 'ios' && variant === 'glass') {
    return (
      <View
        style={[
          containerStyle,
          style,
        ]}
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill}>
          <View style={[styles.container, { padding: spacing.md }]}>
            {children}
          </View>
        </BlurView>
      </View>
    );
  }

  // Android/fallback: Use opacity + gradient
  if (variant === 'glass') {
    return (
      <LinearGradient
        colors={[
          'rgba(15, 26, 46, 0.9)',
          'rgba(26, 15, 46, 0.8)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[containerStyle, style]}
      >
        <View style={styles.container}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  // Default/gradient variant
  return (
    <View
      style={[
        containerStyle,
        style,
        glow && spacing.shadows.glow,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Card;
