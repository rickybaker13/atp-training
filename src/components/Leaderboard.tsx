// Leaderboard Component
// Displays team and league rankings

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import supabaseService from '../services/supabaseService';
import { LeaderboardEntry, Team } from '../types';

interface LeaderboardProps {
  onClose: () => void;
  currentUserId?: string;
}

type TimeFilter = '7days' | '30days' | 'alltime';

export const Leaderboard: React.FC<LeaderboardProps> = ({
  onClose,
  currentUserId,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const team = await supabaseService.getCurrentTeam();
      setCurrentTeam(team);

      if (team) {
        const days = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 365;
        const leaderboard = await supabaseService.getTeamLeaderboard(team.id, days);
        setEntries(leaderboard);
      } else {
        setError('Join a team to see the leaderboard');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load leaderboard');
    }

    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLeaderboard();
    setIsRefreshing(false);
  };

  // Find current user's entry for sharing
  const getCurrentUserEntry = () => {
    return entries.find(entry => entry.userId === currentUserId);
  };

  const handleShareRanking = async () => {
    const userEntry = getCurrentUserEntry();
    if (!userEntry || !currentTeam) return;

    const rankEmoji = userEntry.rank === 1 ? '🥇' : userEntry.rank === 2 ? '🥈' : userEntry.rank === 3 ? '🥉' : '🏆';
    const timeLabel = timeFilter === '7days' ? 'this week' : timeFilter === '30days' ? 'this month' : 'all-time';

    const message = `${rankEmoji} Ranked #${userEntry.rank} on ${currentTeam.name}!\n\n` +
      `💪 Points: ${userEntry.totalPoints.toLocaleString()}pts (${timeLabel})\n` +
      `🏋️ Training: ${userEntry.trainingPoints}pts\n` +
      `📅 Active Days: ${userEntry.activeDays}\n\n` +
      `Competing with the best on ATP! 💪\n\n` +
      `📲 Download: atptraining.app`;

    try {
      await Share.share({
        title: `Ranked #${userEntry.rank} on the leaderboard!`,
        message,
      });
    } catch (error) {
      // User cancelled or error
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return styles.goldRank;
    if (rank === 2) return styles.silverRank;
    if (rank === 3) return styles.bronzeRank;
    return {};
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const renderEntry = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = entry.userId === currentUserId;
    const rank = entry.rank;

    return (
      <View
        key={entry.userId}
        style={[
          styles.entryRow,
          isCurrentUser && styles.currentUserRow,
          rank <= 3 && styles.topThreeRow,
        ]}
      >
        <View style={[styles.rankContainer, getRankStyle(rank)]}>
          <Text style={[styles.rankText, rank <= 3 && styles.topRankText]}>
            {getRankIcon(rank)}
          </Text>
        </View>

        <View style={styles.avatarContainer}>
          {entry.avatarUrl ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {entry.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={[styles.avatar, isCurrentUser && styles.currentUserAvatar]}>
              <Text style={styles.avatarText}>
                {entry.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserName]}>
            {entry.displayName}
            {isCurrentUser && ' (You)'}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.statItem}>
              🏋️ {entry.trainingPoints}
            </Text>
            {entry.nutritionPoints > 0 && (
              <Text style={styles.statItem}>
                🥗 {entry.nutritionPoints}
              </Text>
            )}
            <Text style={styles.statItem}>
              📅 {entry.activeDays}d
            </Text>
          </View>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={[styles.pointsValue, rank <= 3 && styles.topPointsValue]}>
            {entry.totalPoints.toLocaleString()}
          </Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  const renderNoTeam = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>No Team Yet</Text>
      <Text style={styles.emptySubtitle}>
        Join or create a team to compete on the leaderboard!
      </Text>
    </View>
  );

  const renderEmptyLeaderboard = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>No Activity Yet</Text>
      <Text style={styles.emptySubtitle}>
        Complete workouts to appear on the leaderboard!
      </Text>
    </View>
  );

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
            <Text style={styles.headerTitle}>LEADERBOARD</Text>
            {currentTeam && (
              <Text style={styles.teamName}>{currentTeam.name}</Text>
            )}
          </View>
          {/* Share Button */}
          {getCurrentUserEntry() && (
            <TouchableOpacity onPress={handleShareRanking} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>📤</Text>
            </TouchableOpacity>
          )}
          {!getCurrentUserEntry() && <View style={{ width: 36 }} />}
        </View>

        {/* Time Filter */}
        <View style={styles.filterContainer}>
          {(['7days', '30days', 'alltime'] as TimeFilter[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                timeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  timeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter === '7days' ? '7 Days' : filter === '30days' ? '30 Days' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="colors.primary" />
            <Text style={styles.loadingText}>Loading rankings...</Text>
          </View>
        ) : !currentTeam ? (
          renderNoTeam()
        ) : entries.length === 0 ? (
          renderEmptyLeaderboard()
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="colors.primary"
              />
            }
          >
            {/* Top 3 Podium */}
            {entries.length >= 3 && (
              <View style={styles.podiumContainer}>
                {/* Second Place */}
                <View style={[styles.podiumItem, styles.podiumSecond]}>
                  <View style={styles.podiumAvatar}>
                    <Text style={styles.podiumAvatarText}>
                      {entries[1].displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {entries[1].displayName}
                  </Text>
                  <Text style={styles.podiumPoints}>
                    {entries[1].totalPoints.toLocaleString()}
                  </Text>
                  <View style={[styles.podiumBar, styles.podiumBarSecond]}>
                    <Text style={styles.podiumRank}>🥈</Text>
                  </View>
                </View>

                {/* First Place */}
                <View style={[styles.podiumItem, styles.podiumFirst]}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarFirst]}>
                    <Text style={styles.podiumAvatarText}>
                      {entries[0].displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {entries[0].displayName}
                  </Text>
                  <Text style={[styles.podiumPoints, styles.podiumPointsFirst]}>
                    {entries[0].totalPoints.toLocaleString()}
                  </Text>
                  <View style={[styles.podiumBar, styles.podiumBarFirst]}>
                    <Text style={styles.podiumRank}>🥇</Text>
                  </View>
                </View>

                {/* Third Place */}
                <View style={[styles.podiumItem, styles.podiumThird]}>
                  <View style={styles.podiumAvatar}>
                    <Text style={styles.podiumAvatarText}>
                      {entries[2].displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {entries[2].displayName}
                  </Text>
                  <Text style={styles.podiumPoints}>
                    {entries[2].totalPoints.toLocaleString()}
                  </Text>
                  <View style={[styles.podiumBar, styles.podiumBarThird]}>
                    <Text style={styles.podiumRank}>🥉</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Full Rankings */}
            <View style={styles.rankingsContainer}>
              <Text style={styles.sectionTitle}>FULL RANKINGS</Text>
              {entries.map((entry, index) => renderEntry(entry, index))}
            </View>
          </ScrollView>
        )}
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
  teamName: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(0, 217, 255,0.2)',
  },
  filterText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'colors.primary',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Podium Styles
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  podiumFirst: {
    marginBottom: 20,
  },
  podiumSecond: {
    marginBottom: 0,
  },
  podiumThird: {
    marginBottom: 0,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  podiumAvatarFirst: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'colors.primary',
  },
  podiumAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  podiumName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    width: 80,
    textAlign: 'center',
  },
  podiumPoints: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  podiumPointsFirst: {
    color: 'colors.primary',
    fontSize: 13,
  },
  podiumBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumBarFirst: {
    height: 80,
    backgroundColor: 'rgba(0, 217, 255,0.3)',
  },
  podiumBarSecond: {
    height: 60,
    backgroundColor: 'rgba(192,192,192,0.2)',
  },
  podiumBarThird: {
    height: 50,
    backgroundColor: 'rgba(205,127,50,0.2)',
  },
  podiumRank: {
    fontSize: 24,
  },
  // Rankings List
  rankingsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserRow: {
    backgroundColor: 'rgba(0, 217, 255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 255,0.3)',
  },
  topThreeRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  rankContainer: {
    width: 36,
    alignItems: 'center',
  },
  rankText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '700',
  },
  topRankText: {
    fontSize: 18,
  },
  goldRank: {},
  silverRank: {},
  bronzeRank: {},
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentUserAvatar: {
    backgroundColor: 'colors.primary',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentUserName: {
    color: 'colors.primary',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    color: '#666',
    fontSize: 11,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  topPointsValue: {
    color: 'colors.primary',
  },
  pointsLabel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74,144,217,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 16,
  },
});

export default Leaderboard;
