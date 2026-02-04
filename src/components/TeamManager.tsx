// Team Manager Component
// Handles team creation, joining, and management

import React, { useState, useEffect } from 'react';
import { colors, typography, spacing } from '../theme';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import supabaseService from '../services/supabaseService';
import { Team, TeamMember } from '../types';

interface TeamManagerProps {
  onClose: () => void;
  onTeamJoined?: (team: Team) => void;
}

type ViewMode = 'main' | 'create' | 'join' | 'details';

export const TeamManager: React.FC<TeamManagerProps> = ({
  onClose,
  onTeamJoined,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentTeam();
  }, []);

  const loadCurrentTeam = async () => {
    setIsLoading(true);
    try {
      const team = await supabaseService.getCurrentTeam();
      setCurrentTeam(team);

      if (team) {
        const members = await supabaseService.getTeamMembers(team.id);
        setTeamMembers(members);
        setViewMode('details');
      }
    } catch (error) {
      console.error('Error loading team:', error);
    }
    setIsLoading(false);
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const team = await supabaseService.createTeam(teamName.trim());
      if (team) {
        setCurrentTeam(team);
        setTeamMembers([]);
        setViewMode('details');
        onTeamJoined?.(team);

        Alert.alert(
          'Team Created! 🎉',
          `Share this code with your teammates:\n\n${team.inviteCode}`,
          [{ text: 'Copy Code', onPress: () => Clipboard.setString(team.inviteCode) }]
        );
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create team');
    }
    setIsLoading(false);
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const team = await supabaseService.joinTeam(inviteCode.trim());
      if (team) {
        setCurrentTeam(team);
        const members = await supabaseService.getTeamMembers(team.id);
        setTeamMembers(members);
        setViewMode('details');
        onTeamJoined?.(team);

        Alert.alert('Joined Team! 🎉', `Welcome to ${team.name}!`);
      }
    } catch (error: any) {
      setError(error.message || 'Invalid invite code');
    }
    setIsLoading(false);
  };

  const handleLeaveTeam = async () => {
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave this team? Your points will remain on the leaderboard.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            const success = await supabaseService.leaveTeam();
            if (success) {
              setCurrentTeam(null);
              setTeamMembers([]);
              setViewMode('main');
            }
            setIsLoading(false);
          },
        },
      ]
    );
  };

  const handleShareCode = async () => {
    if (!currentTeam) return;

    try {
      await Share.share({
        message: `Join my team "${currentTeam.name}" on The Mountain!\n\nUse invite code: ${currentTeam.inviteCode}`,
      });
    } catch (error) {
      Clipboard.setString(currentTeam.inviteCode);
      Alert.alert('Copied!', 'Invite code copied to clipboard');
    }
  };

  const renderMainView = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Text style={styles.mainIcon}>👥</Text>
      </View>
      <Text style={styles.title}>Team Competition</Text>
      <Text style={styles.subtitle}>
        Join a team to compete with friends and teammates on the leaderboard!
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setViewMode('create')}
      >
        <Text style={styles.primaryButtonText}>Create a Team</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setViewMode('join')}
      >
        <Text style={styles.secondaryButtonText}>Join with Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCreateView = () => (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setViewMode('main');
          setError(null);
          setTeamName('');
        }}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Text style={styles.mainIcon}>🏆</Text>
      </View>
      <Text style={styles.title}>Create Your Team</Text>
      <Text style={styles.subtitle}>
        You'll get an invite code to share with your teammates.
      </Text>

      <TextInput
        style={styles.input}
        value={teamName}
        onChangeText={setTeamName}
        placeholder="Team Name"
        placeholderTextColor="#666"
        autoCapitalize="words"
        autoFocus
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.primaryButton, !teamName.trim() && styles.buttonDisabled]}
        onPress={handleCreateTeam}
        disabled={!teamName.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryButtonText}>Create Team</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderJoinView = () => (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setViewMode('main');
          setError(null);
          setInviteCode('');
        }}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Text style={styles.mainIcon}>🎟️</Text>
      </View>
      <Text style={styles.title}>Join a Team</Text>
      <Text style={styles.subtitle}>
        Enter the 6-character invite code from your team captain.
      </Text>

      <TextInput
        style={[styles.input, styles.codeInput]}
        value={inviteCode}
        onChangeText={(text) => setInviteCode(text.toUpperCase())}
        placeholder="INVITE CODE"
        placeholderTextColor="#666"
        autoCapitalize="characters"
        maxLength={6}
        autoFocus
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.primaryButton, inviteCode.length !== 6 && styles.buttonDisabled]}
        onPress={handleJoinTeam}
        disabled={inviteCode.length !== 6 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.primaryButtonText}>Join Team</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderDetailsView = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.teamHeader}>
        <View style={styles.teamIconContainer}>
          <Text style={styles.teamIcon}>🏆</Text>
        </View>
        <Text style={styles.teamName}>{currentTeam?.name}</Text>
        <Text style={styles.memberCount}>
          {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
        </Text>
      </View>

      {/* Invite Code Card */}
      <View style={styles.inviteCard}>
        <Text style={styles.inviteLabel}>INVITE CODE</Text>
        <Text style={styles.inviteCode}>{currentTeam?.inviteCode}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
          <Text style={styles.shareButtonText}>📤 Share Code</Text>
        </TouchableOpacity>
      </View>

      {/* Team Members */}
      <Text style={styles.sectionTitle}>TEAM MEMBERS</Text>
      {teamMembers.map((member, index) => (
        <View key={member.id} style={styles.memberRow}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberAvatarText}>
              {member.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.displayName}</Text>
            {member.role === 'admin' && (
              <Text style={styles.adminBadge}>Captain</Text>
            )}
          </View>
          <Text style={styles.memberRank}>#{index + 1}</Text>
        </View>
      ))}

      {/* Actions */}
      <TouchableOpacity style={styles.dangerButton} onPress={handleLeaveTeam}>
        <Text style={styles.dangerButtonText}>Leave Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (isLoading && viewMode === 'main') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0a0a0f', '#1a1a2e', '#16213e']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="colors.primary" />
            <Text style={styles.loadingText}>Loading team...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>TEAM</Text>
          <View style={{ width: 36 }} />
        </View>

        {viewMode === 'main' && renderMainView()}
        {viewMode === 'create' && renderCreateView()}
        {viewMode === 'join' && renderJoinView()}
        {viewMode === 'details' && renderDetailsView()}
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
  headerTitle: {
    color: 'colors.primary',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 217, 255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainIcon: {
    fontSize: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: 'colors.primary',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  backButtonText: {
    color: 'colors.primary',
    fontSize: 15,
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
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: '700',
  },
  errorText: {
    color: 'colors.tertiary',
    fontSize: 13,
    marginBottom: 16,
  },
  // Team Details Styles
  teamHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  teamIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 217, 255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamIcon: {
    fontSize: 30,
  },
  teamName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  memberCount: {
    color: '#888',
    fontSize: 14,
  },
  inviteCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inviteLabel: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  inviteCode: {
    color: 'colors.primary',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 6,
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: 'rgba(0, 217, 255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'colors.primary',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'colors.primary',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  adminBadge: {
    color: 'colors.primary',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  memberRank: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'rgba(231,76,60,0.1)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.3)',
  },
  dangerButtonText: {
    color: 'colors.tertiary',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default TeamManager;
