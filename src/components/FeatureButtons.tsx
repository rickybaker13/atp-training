// Feature Buttons Component
// Quick access buttons for Team, Leaderboard, Training, and Nutrition features

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeatureButtonsProps {
  onTeamPress: () => void;
  onLeaderboardPress: () => void;
  onTrainingPlanPress: () => void;
  onNutritionPlanPress: () => void;
  hasTeam: boolean;
  hasCustomPlan: boolean;
  hasNutritionPlan: boolean;
}

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
      <Text style={styles.sectionTitle}>COMPETE & CUSTOMIZE</Text>

      {/* Top Row - Team and Leaderboard */}
      <View style={styles.buttonRow}>
        {/* Team Button */}
        <TouchableOpacity style={styles.featureButton} onPress={onTeamPress}>
          <View style={[styles.iconCircle, hasTeam && styles.iconCircleActive]}>
            <Ionicons
              name={hasTeam ? "people" : "people-outline"}
              size={24}
              color={hasTeam ? "#f39c12" : "#888"}
            />
          </View>
          <Text style={styles.buttonLabel}>
            {hasTeam ? 'My Team' : 'Join Team'}
          </Text>
          {!hasTeam && <Text style={styles.buttonHint}>Compete!</Text>}
        </TouchableOpacity>

        {/* Leaderboard Button */}
        <TouchableOpacity
          style={[styles.featureButton, !hasTeam && styles.buttonDisabled]}
          onPress={onLeaderboardPress}
          disabled={!hasTeam}
        >
          <View style={[styles.iconCircle, hasTeam && styles.iconCircleActive]}>
            <Ionicons
              name="trophy-outline"
              size={24}
              color={hasTeam ? "#f39c12" : "#666"}
            />
          </View>
          <Text style={styles.buttonLabel}>Leaderboard</Text>
          {!hasTeam && <Text style={styles.buttonHint}>Join team first</Text>}
        </TouchableOpacity>
      </View>

      {/* Bottom Row - Training and Nutrition Plans */}
      <View style={[styles.buttonRow, { marginTop: 10 }]}>
        {/* Training Plan Button */}
        <TouchableOpacity style={styles.featureButton} onPress={onTrainingPlanPress}>
          <View style={[styles.iconCircle, styles.iconCircleTraining]}>
            <Ionicons
              name="barbell-outline"
              size={24}
              color="#2ecc71"
            />
          </View>
          <Text style={styles.buttonLabel}>
            {hasCustomPlan ? 'New Plan' : 'Training Plan'}
          </Text>
          <Text style={styles.buttonHint}>AI-Powered</Text>
        </TouchableOpacity>

        {/* Nutrition Plan Button */}
        <TouchableOpacity style={styles.featureButton} onPress={onNutritionPlanPress}>
          <View style={[styles.iconCircle, styles.iconCircleNutrition]}>
            <Ionicons
              name="nutrition-outline"
              size={24}
              color="#9b59b6"
            />
          </View>
          <Text style={styles.buttonLabel}>
            {hasNutritionPlan ? 'Update Diet' : 'Nutrition Plan'}
          </Text>
          <Text style={styles.buttonHint}>AI-Powered</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
    paddingLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureButton: {
    flex: 1,
    backgroundColor: 'rgba(20,20,30,0.75)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleActive: {
    backgroundColor: 'rgba(243,156,18,0.3)',
  },
  iconCircleTraining: {
    backgroundColor: 'rgba(46,204,113,0.3)',
  },
  iconCircleNutrition: {
    backgroundColor: 'rgba(155,89,182,0.3)',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default FeatureButtons;
