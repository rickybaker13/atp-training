// Supabase Database Service
// Handles all database operations for teams, leaderboards, and user sync

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  Team,
  TeamMember,
  League,
  LeaderboardEntry,
  TeamLeaderboard,
} from '../types';

// ============================================
// CONFIGURATION
// ============================================

// Load from environment variables
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Storage keys
const STORAGE_KEYS = {
  USER_ID: 'mountain_user_id',
  USER_PROFILE: 'mountain_user_profile',
  TEAM_ID: 'mountain_team_id',
};

// ============================================
// DATABASE TYPES (for Supabase)
// ============================================

interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          sport: string | null;
          position: string | null;
          created_at: string;
          last_active: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'last_active'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          league_id: string | null;
          created_by: string;
          created_at: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'admin' | 'member';
          joined_at: string;
        };
      };
      leagues: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          created_by: string;
          created_at: string;
        };
      };
      daily_points: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          training_points: number;
          nutrition_points: number;
          total_points: number;
          synced_at: string;
        };
      };
    };
  };
}

// ============================================
// SERVICE CLASS
// ============================================

class SupabaseService {
  private client: SupabaseClient | null = null;
  private currentUserId: string | null = null;
  private isInitialized: boolean = false;

  // Initialize with custom credentials
  initialize(url?: string, anonKey?: string) {
    const supabaseUrl = url || SUPABASE_URL;
    const supabaseKey = anonKey || SUPABASE_ANON_KEY;

    if (supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseUrl) {
      console.warn('Supabase not configured. Team features will be disabled.');
      return false;
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.isInitialized = true;
    return true;
  }

  isConfigured(): boolean {
    return this.isInitialized && this.client !== null;
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  async createOrGetUser(email: string, displayName: string): Promise<UserProfile | null> {
    if (!this.client) return null;

    try {
      // Check if user exists
      const { data: existing } = await this.client
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        // Update last active
        await this.client
          .from('users')
          .update({ last_active: new Date().toISOString() })
          .eq('id', existing.id);

        this.currentUserId = existing.id;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, existing.id);

        return {
          id: existing.id,
          email: existing.email,
          displayName: existing.display_name,
          avatarUrl: existing.avatar_url || undefined,
          sport: existing.sport || undefined,
          position: existing.position || undefined,
          createdAt: existing.created_at,
          lastActive: existing.last_active,
        };
      }

      // Create new user
      const { data: newUser, error } = await this.client
        .from('users')
        .insert({
          email,
          display_name: displayName,
        })
        .select()
        .single();

      if (error) throw error;

      this.currentUserId = newUser.id;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, newUser.id);

      return {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.display_name,
        createdAt: newUser.created_at,
        lastActive: newUser.last_active,
      };
    } catch (error) {
      console.error('Error creating/getting user:', error);
      return null;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
    if (!this.client || !this.currentUserId) return false;

    try {
      const { error } = await this.client
        .from('users')
        .update({
          display_name: updates.displayName,
          avatar_url: updates.avatarUrl,
          sport: updates.sport,
          position: updates.position,
        })
        .eq('id', this.currentUserId);

      return !error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    if (this.currentUserId) return this.currentUserId;

    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    if (stored) {
      this.currentUserId = stored;
      return stored;
    }

    return null;
  }

  // ============================================
  // TEAM MANAGEMENT
  // ============================================

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createTeam(name: string): Promise<Team | null> {
    if (!this.client || !this.currentUserId) return null;

    try {
      const inviteCode = this.generateInviteCode();

      const { data: team, error } = await this.client
        .from('teams')
        .insert({
          name,
          invite_code: inviteCode,
          created_by: this.currentUserId,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin member
      await this.client.from('team_members').insert({
        team_id: team.id,
        user_id: this.currentUserId,
        role: 'admin',
      });

      await AsyncStorage.setItem(STORAGE_KEYS.TEAM_ID, team.id);

      return {
        id: team.id,
        name: team.name,
        inviteCode: team.invite_code,
        createdBy: team.created_by,
        createdAt: team.created_at,
        memberCount: 1,
      };
    } catch (error) {
      console.error('Error creating team:', error);
      return null;
    }
  }

  async joinTeam(inviteCode: string): Promise<Team | null> {
    if (!this.client || !this.currentUserId) return null;

    try {
      // Find team by invite code
      const { data: team, error: teamError } = await this.client
        .from('teams')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (teamError || !team) {
        throw new Error('Invalid invite code');
      }

      // Check if already a member
      const { data: existingMember } = await this.client
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', this.currentUserId)
        .single();

      if (existingMember) {
        throw new Error('Already a member of this team');
      }

      // Join team
      await this.client.from('team_members').insert({
        team_id: team.id,
        user_id: this.currentUserId,
        role: 'member',
      });

      await AsyncStorage.setItem(STORAGE_KEYS.TEAM_ID, team.id);

      // Get member count
      const { count } = await this.client
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id);

      return {
        id: team.id,
        name: team.name,
        inviteCode: team.invite_code,
        leagueId: team.league_id || undefined,
        createdBy: team.created_by,
        createdAt: team.created_at,
        memberCount: count || 1,
      };
    } catch (error: any) {
      console.error('Error joining team:', error);
      throw error;
    }
  }

  async leaveTeam(): Promise<boolean> {
    if (!this.client || !this.currentUserId) return false;

    try {
      const teamId = await AsyncStorage.getItem(STORAGE_KEYS.TEAM_ID);
      if (!teamId) return false;

      await this.client
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', this.currentUserId);

      await AsyncStorage.removeItem(STORAGE_KEYS.TEAM_ID);
      return true;
    } catch (error) {
      console.error('Error leaving team:', error);
      return false;
    }
  }

  async getCurrentTeam(): Promise<Team | null> {
    if (!this.client) return null;

    try {
      const teamId = await AsyncStorage.getItem(STORAGE_KEYS.TEAM_ID);
      if (!teamId) return null;

      const { data: team } = await this.client
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (!team) return null;

      const { count } = await this.client
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id);

      return {
        id: team.id,
        name: team.name,
        inviteCode: team.invite_code,
        leagueId: team.league_id || undefined,
        createdBy: team.created_by,
        createdAt: team.created_at,
        memberCount: count || 0,
      };
    } catch (error) {
      console.error('Error getting current team:', error);
      return null;
    }
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    if (!this.client) return [];

    try {
      const { data } = await this.client
        .from('team_members')
        .select(`
          *,
          users (
            display_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

      if (!data) return [];

      return data.map((member: any) => ({
        id: member.id,
        teamId: member.team_id,
        userId: member.user_id,
        displayName: member.users?.display_name || 'Unknown',
        avatarUrl: member.users?.avatar_url,
        role: member.role,
        joinedAt: member.joined_at,
      }));
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }

  // ============================================
  // POINTS & LEADERBOARD
  // ============================================

  async syncDailyPoints(
    trainingPoints: number,
    nutritionPoints: number,
    date?: string
  ): Promise<boolean> {
    if (!this.client || !this.currentUserId) return false;

    const syncDate = date || new Date().toISOString().split('T')[0];

    try {
      // Upsert daily points
      const { error } = await this.client
        .from('daily_points')
        .upsert({
          user_id: this.currentUserId,
          date: syncDate,
          training_points: trainingPoints,
          nutrition_points: nutritionPoints,
          synced_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date',
        });

      return !error;
    } catch (error) {
      console.error('Error syncing daily points:', error);
      return false;
    }
  }

  async getTeamLeaderboard(teamId: string, days: number = 30): Promise<LeaderboardEntry[]> {
    if (!this.client) return [];

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data } = await this.client
        .rpc('get_team_leaderboard', {
          p_team_id: teamId,
          p_start_date: startDateStr,
        });

      if (!data) return [];

      return data.map((entry: any, index: number) => ({
        rank: index + 1,
        userId: entry.user_id,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        totalPoints: entry.total_points || 0,
        trainingPoints: entry.training_points || 0,
        nutritionPoints: entry.nutrition_points || 0,
        activeDays: entry.active_days || 0,
        currentStreak: entry.current_streak || 0,
      }));
    } catch (error) {
      console.error('Error getting team leaderboard:', error);

      // Fallback: try direct query if RPC not set up
      return this.getTeamLeaderboardFallback(teamId, days);
    }
  }

  private async getTeamLeaderboardFallback(teamId: string, days: number): Promise<LeaderboardEntry[]> {
    if (!this.client) return [];

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      // Get team members
      const { data: members } = await this.client
        .from('team_members')
        .select(`
          user_id,
          users (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId);

      if (!members) return [];

      // Get points for each member
      const leaderboard: LeaderboardEntry[] = [];

      for (const member of members) {
        const { data: points } = await this.client
          .from('daily_points')
          .select('*')
          .eq('user_id', member.user_id)
          .gte('date', startDateStr);

        const totalTraining = points?.reduce((sum, p) => sum + (p.training_points || 0), 0) || 0;
        const totalNutrition = points?.reduce((sum, p) => sum + (p.nutrition_points || 0), 0) || 0;
        const activeDays = points?.length || 0;

        leaderboard.push({
          rank: 0,
          userId: member.user_id,
          displayName: (member.users as any)?.display_name || 'Unknown',
          avatarUrl: (member.users as any)?.avatar_url,
          totalPoints: totalTraining + totalNutrition,
          trainingPoints: totalTraining,
          nutritionPoints: totalNutrition,
          activeDays,
          currentStreak: 0, // Would need separate calculation
        });
      }

      // Sort and assign ranks
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return leaderboard;
    } catch (error) {
      console.error('Error in fallback leaderboard:', error);
      return [];
    }
  }

  // ============================================
  // LEAGUE MANAGEMENT
  // ============================================

  async createLeague(name: string): Promise<League | null> {
    if (!this.client || !this.currentUserId) return null;

    try {
      const inviteCode = this.generateInviteCode();

      const { data: league, error } = await this.client
        .from('leagues')
        .insert({
          name,
          invite_code: inviteCode,
          created_by: this.currentUserId,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: league.id,
        name: league.name,
        inviteCode: league.invite_code,
        createdBy: league.created_by,
        createdAt: league.created_at,
        teamCount: 0,
      };
    } catch (error) {
      console.error('Error creating league:', error);
      return null;
    }
  }

  async joinLeague(inviteCode: string, teamId: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      const { data: league } = await this.client
        .from('leagues')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (!league) throw new Error('Invalid league code');

      await this.client
        .from('teams')
        .update({ league_id: league.id })
        .eq('id', teamId);

      return true;
    } catch (error) {
      console.error('Error joining league:', error);
      return false;
    }
  }

  async getLeagueLeaderboard(leagueId: string): Promise<TeamLeaderboard[]> {
    if (!this.client) return [];

    try {
      const { data: teams } = await this.client
        .from('teams')
        .select('id, name')
        .eq('league_id', leagueId);

      if (!teams) return [];

      const leaderboard: TeamLeaderboard[] = [];

      for (const team of teams) {
        const members = await this.getTeamLeaderboard(team.id, 30);
        const totalPoints = members.reduce((sum, m) => sum + m.totalPoints, 0);
        const topPerformer = members[0];

        leaderboard.push({
          teamId: team.id,
          teamName: team.name,
          totalPoints,
          memberCount: members.length,
          avgPointsPerMember: members.length > 0 ? Math.round(totalPoints / members.length) : 0,
          topPerformer: topPerformer
            ? { displayName: topPerformer.displayName, points: topPerformer.totalPoints }
            : { displayName: 'N/A', points: 0 },
        });
      }

      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
      return leaderboard;
    } catch (error) {
      console.error('Error getting league leaderboard:', error);
      return [];
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;


// ============================================
// SQL SCHEMA FOR REFERENCE
// Run this in your Supabase SQL editor to set up the database
// ============================================

/*
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  sport TEXT,
  position TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team memberships
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Leagues (for inter-team competition)
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily point snapshots
CREATE TABLE daily_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  training_points INTEGER DEFAULT 0,
  nutrition_points INTEGER DEFAULT 0,
  total_points INTEGER GENERATED ALWAYS AS (training_points + nutrition_points) STORED,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX idx_daily_points_user_date ON daily_points(user_id, date);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_teams_league ON teams(league_id);
CREATE INDEX idx_teams_invite ON teams(invite_code);
CREATE INDEX idx_leagues_invite ON leagues(invite_code);

-- RPC function for leaderboard (optional optimization)
CREATE OR REPLACE FUNCTION get_team_leaderboard(p_team_id UUID, p_start_date DATE)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  total_points BIGINT,
  training_points BIGINT,
  nutrition_points BIGINT,
  active_days BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as user_id,
    u.display_name,
    u.avatar_url,
    COALESCE(SUM(dp.total_points), 0) as total_points,
    COALESCE(SUM(dp.training_points), 0) as training_points,
    COALESCE(SUM(dp.nutrition_points), 0) as nutrition_points,
    COUNT(DISTINCT dp.date) as active_days
  FROM team_members tm
  JOIN users u ON tm.user_id = u.id
  LEFT JOIN daily_points dp ON u.id = dp.user_id AND dp.date >= p_start_date
  WHERE tm.team_id = p_team_id
  GROUP BY u.id, u.display_name, u.avatar_url
  ORDER BY total_points DESC;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_points ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (tighten in production with auth)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON teams FOR ALL USING (true);
CREATE POLICY "Allow all" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all" ON leagues FOR ALL USING (true);
CREATE POLICY "Allow all" ON daily_points FOR ALL USING (true);
*/
