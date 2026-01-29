// Social Share Component
// Handles sharing workouts, points, and leaderboard rankings to social media

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';

// ============================================
// TYPES
// ============================================

export interface ShareContent {
  type: 'workout' | 'points' | 'leaderboard' | 'achievement';
  title: string;
  message: string;
  points?: number;
  rank?: number;
  workoutName?: string;
}

interface SocialShareProps {
  content: ShareContent;
  style?: object;
  compact?: boolean;
  onShareComplete?: (success: boolean, platform?: string) => void;
}

interface ShareButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  compact?: boolean;
}

// ============================================
// SHARE MESSAGE BUILDERS
// ============================================

const buildShareMessage = (content: ShareContent): { title: string; message: string } => {
  const appTag = '\n\n💪 ATP: Ascent Training Protocol';
  const downloadLink = '\n📲 Download: atptraining.app';

  switch (content.type) {
    case 'workout':
      return {
        title: `Just crushed my workout! 💪`,
        message: `${content.title}\n\n` +
          `✅ Completed: ${content.workoutName || 'Training Session'}\n` +
          `🔥 Points earned: +${content.points || 0}pts\n` +
          `${content.message}` +
          appTag + downloadLink,
      };

    case 'points':
      return {
        title: `Climbing The Mountain! 🏔️`,
        message: `${content.title}\n\n` +
          `💪 Total Points: ${content.points?.toLocaleString() || 0}pts\n` +
          `${content.message}` +
          appTag + downloadLink,
      };

    case 'leaderboard':
      const rankEmoji = content.rank === 1 ? '🥇' : content.rank === 2 ? '🥈' : content.rank === 3 ? '🥉' : '🏆';
      return {
        title: `${rankEmoji} Ranked #${content.rank} on the leaderboard!`,
        message: `${content.title}\n\n` +
          `${rankEmoji} Current Rank: #${content.rank}\n` +
          `💪 Points: ${content.points?.toLocaleString() || 0}pts\n` +
          `${content.message}` +
          appTag + downloadLink,
      };

    case 'achievement':
      return {
        title: `🎯 Achievement Unlocked!`,
        message: `${content.title}\n\n` +
          `${content.message}` +
          (content.points ? `\n🔥 Bonus: +${content.points}pts` : '') +
          appTag + downloadLink,
      };

    default:
      return {
        title: content.title,
        message: content.message + appTag + downloadLink,
      };
  }
};

// ============================================
// SHARE BUTTON COMPONENT
// ============================================

const ShareButton: React.FC<ShareButtonProps> = ({
  icon,
  label,
  color,
  onPress,
  compact,
}) => (
  <TouchableOpacity
    style={[
      styles.shareButton,
      { backgroundColor: color },
      compact && styles.shareButtonCompact,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.shareIcon}>{icon}</Text>
    {!compact && <Text style={styles.shareLabel}>{label}</Text>}
  </TouchableOpacity>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const SocialShare: React.FC<SocialShareProps> = ({
  content,
  style,
  compact = false,
  onShareComplete,
}) => {
  const { title, message } = buildShareMessage(content);

  // Generic share using native share sheet
  const handleShare = async () => {
    try {
      const result = await Share.share(
        {
          title,
          message,
          // URL can be added when app is live
          // url: 'https://themountainapp.com',
        },
        {
          dialogTitle: 'Share your progress',
          subject: title, // For email
        }
      );

      if (result.action === Share.sharedAction) {
        onShareComplete?.(true, result.activityType ?? undefined);
      } else if (result.action === Share.dismissedAction) {
        onShareComplete?.(false);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Could not share. Please try again.');
      onShareComplete?.(false);
    }
  };

  // Copy to clipboard for manual sharing
  const handleCopyToClipboard = async () => {
    try {
      // Using expo-clipboard if available
      const Clipboard = require('expo-clipboard');
      await Clipboard.setStringAsync(message);
      Alert.alert('Copied!', 'Your progress has been copied to clipboard.');
      onShareComplete?.(true, 'clipboard');
    } catch (error) {
      // Fallback alert
      Alert.alert('Share Text', message);
      onShareComplete?.(false);
    }
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <TouchableOpacity
          style={styles.compactShareButton}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.compactIcon}>📤</Text>
          <Text style={styles.compactLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>SHARE YOUR PROGRESS</Text>

      <View style={styles.buttonRow}>
        {/* Main Share Button (opens native share sheet) */}
        <ShareButton
          icon="📤"
          label="Share"
          color="#4A90D9"
          onPress={handleShare}
        />

        {/* Copy to Clipboard */}
        <ShareButton
          icon="📋"
          label="Copy"
          color="#6B7280"
          onPress={handleCopyToClipboard}
        />
      </View>

      {/* Preview of what will be shared */}
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview:</Text>
        <Text style={styles.previewText} numberOfLines={4}>
          {message.split('\n\n🏔️')[0]}
        </Text>
      </View>
    </View>
  );
};

// ============================================
// QUICK SHARE BUTTONS (for inline use)
// ============================================

interface QuickShareButtonProps {
  type: 'workout' | 'points' | 'leaderboard';
  points?: number;
  rank?: number;
  workoutName?: string;
  customMessage?: string;
  onShareComplete?: (success: boolean) => void;
}

export const QuickShareButton: React.FC<QuickShareButtonProps> = ({
  type,
  points,
  rank,
  workoutName,
  customMessage,
  onShareComplete,
}) => {
  const handleQuickShare = async () => {
    let content: ShareContent;

    switch (type) {
      case 'workout':
        content = {
          type: 'workout',
          title: 'Workout Complete! 💪',
          message: customMessage || 'Another day, another step closer to greatness!',
          points,
          workoutName,
        };
        break;

      case 'points':
        content = {
          type: 'points',
          title: 'Making Progress! 📈',
          message: customMessage || 'Every point counts on the journey to the top!',
          points,
        };
        break;

      case 'leaderboard':
        content = {
          type: 'leaderboard',
          title: 'Check out my ranking! 🏆',
          message: customMessage || 'Competing with the best!',
          points,
          rank,
        };
        break;

      default:
        return;
    }

    const { title, message } = buildShareMessage(content);

    try {
      const result = await Share.share({
        title,
        message,
      });

      onShareComplete?.(result.action === Share.sharedAction);
    } catch (error) {
      onShareComplete?.(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.quickShareButton}
      onPress={handleQuickShare}
      activeOpacity={0.8}
    >
      <Text style={styles.quickShareIcon}>📤</Text>
      <Text style={styles.quickShareText}>Share</Text>
    </TouchableOpacity>
  );
};

// ============================================
// WORKOUT COMPLETE SHARE CARD
// ============================================

interface WorkoutShareCardProps {
  workoutName: string;
  pointsEarned: number;
  totalPoints: number;
  duration?: number;
  onShare: () => void;
  onDismiss: () => void;
}

export const WorkoutShareCard: React.FC<WorkoutShareCardProps> = ({
  workoutName,
  pointsEarned,
  totalPoints,
  duration,
  onShare,
  onDismiss,
}) => {
  const handleShare = async () => {
    const content: ShareContent = {
      type: 'workout',
      title: `Just finished: ${workoutName}`,
      message: duration
        ? `Completed in ${duration} minutes! 💪`
        : 'Another workout in the books! 💪',
      points: pointsEarned,
      workoutName,
    };

    const { title, message } = buildShareMessage(content);

    try {
      await Share.share({ title, message });
      onShare();
    } catch (error) {
      // User cancelled or error
    }
  };

  return (
    <View style={styles.shareCard}>
      <View style={styles.shareCardHeader}>
        <Text style={styles.shareCardEmoji}>🎉</Text>
        <Text style={styles.shareCardTitle}>Workout Complete!</Text>
      </View>

      <View style={styles.shareCardStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>+{pointsEarned}</Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
      </View>

      <Text style={styles.shareCardWorkout}>{workoutName}</Text>

      <View style={styles.shareCardButtons}>
        <TouchableOpacity
          style={styles.shareCardButton}
          onPress={handleShare}
        >
          <Text style={styles.shareCardButtonIcon}>📤</Text>
          <Text style={styles.shareCardButtonText}>Share Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shareCardButton, styles.shareCardButtonSecondary]}
          onPress={onDismiss}
        >
          <Text style={styles.shareCardButtonTextSecondary}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonCompact: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  shareIcon: {
    fontSize: 18,
  },
  shareLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginBottom: 6,
  },
  previewText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 18,
  },

  // Compact styles
  compactContainer: {
    alignItems: 'center',
  },
  compactShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,144,217,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  compactIcon: {
    fontSize: 14,
  },
  compactLabel: {
    color: '#4A90D9',
    fontSize: 13,
    fontWeight: '600',
  },

  // Quick share button
  quickShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,144,217,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  quickShareIcon: {
    fontSize: 12,
  },
  quickShareText: {
    color: '#4A90D9',
    fontSize: 12,
    fontWeight: '600',
  },

  // Share card styles
  shareCard: {
    backgroundColor: 'rgba(46,204,113,0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(46,204,113,0.3)',
  },
  shareCardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareCardEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  shareCardTitle: {
    color: '#2ecc71',
    fontSize: 24,
    fontWeight: '700',
  },
  shareCardStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shareCardWorkout: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  shareCardButtons: {
    gap: 10,
  },
  shareCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareCardButtonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shareCardButtonIcon: {
    fontSize: 18,
  },
  shareCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareCardButtonTextSecondary: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialShare;
