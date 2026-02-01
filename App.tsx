import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Linking,
  ImageBackground,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

// Import new v2.0 components
import { CoachBot, TeamManager, Leaderboard, FeatureButtons } from './src/components';
import { supabaseService } from './src/services';
import { Team, GeneratedTrainingPlan } from './src/types';

// Custom Icon Components - Clean geometric style using Views
const IconPeak = ({ size = 28, color = '#f39c12' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: 0,
      height: 0,
      borderLeftWidth: size / 2,
      borderRightWidth: size / 2,
      borderBottomWidth: size * 0.8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
      opacity: 0.9,
    }} />
    <View style={{
      position: 'absolute',
      bottom: size * 0.15,
      width: 0,
      height: 0,
      borderLeftWidth: size / 4,
      borderRightWidth: size / 4,
      borderBottomWidth: size * 0.35,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'rgba(255,255,255,0.3)',
    }} />
  </View>
);

const IconFlame = ({ size = 28, color = '#e74c3c' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.85, color: color }}>△</Text>
    <View style={{
      position: 'absolute',
      bottom: size * 0.2,
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: size * 0.2,
      backgroundColor: color,
      opacity: 0.6,
    }} />
  </View>
);

const IconDumbbell = ({ size = 28, color = '#4a6fa5' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.2, height: size * 0.5, backgroundColor: color, borderRadius: 2 }} />
    <View style={{ width: size * 0.4, height: size * 0.15, backgroundColor: color }} />
    <View style={{ width: size * 0.2, height: size * 0.5, backgroundColor: color, borderRadius: 2 }} />
  </View>
);

const IconBaseball = ({ size = 28, color = '#e8f4f8' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.85,
      height: size * 0.85,
      borderRadius: size * 0.5,
      borderWidth: 2,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        width: size * 0.3,
        height: size * 0.5,
        borderLeftWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: color,
        borderRadius: size * 0.15,
      }} />
    </View>
  </View>
);

const IconBolt = ({ size = 28, color = '#f39c12' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color: color, fontWeight: '900' }}>⚡</Text>
  </View>
);

const IconCalendar = ({ size = 28, color = '#4a6fa5' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.75,
      height: size * 0.7,
      borderWidth: 2,
      borderColor: color,
      borderRadius: 3,
    }}>
      <View style={{ height: size * 0.2, backgroundColor: color, opacity: 0.5 }} />
    </View>
  </View>
);

const IconStats = ({ size = 28, color = '#2ecc71' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 2 }}>
    <View style={{ width: size * 0.2, height: size * 0.35, backgroundColor: color, opacity: 0.5 }} />
    <View style={{ width: size * 0.2, height: size * 0.55, backgroundColor: color, opacity: 0.7 }} />
    <View style={{ width: size * 0.2, height: size * 0.8, backgroundColor: color }} />
  </View>
);

const IconRecovery = ({ size = 28, color = '#4a6fa5' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.8,
      height: size * 0.8,
      borderRadius: size * 0.4,
      borderWidth: 2,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{ width: 2, height: size * 0.25, backgroundColor: color }} />
      <View style={{ position: 'absolute', width: size * 0.2, height: 2, backgroundColor: color, right: size * 0.15 }} />
    </View>
  </View>
);

const IconSettings = ({ size = 28, color = '#a0aab4' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderRadius: size * 0.35,
      borderWidth: 2.5,
      borderColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{ width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1, backgroundColor: color }} />
    </View>
    {/* Gear teeth */}
    <View style={{ position: 'absolute', top: 0, width: size * 0.15, height: size * 0.2, backgroundColor: color }} />
    <View style={{ position: 'absolute', bottom: 0, width: size * 0.15, height: size * 0.2, backgroundColor: color }} />
    <View style={{ position: 'absolute', left: 0, width: size * 0.2, height: size * 0.15, backgroundColor: color }} />
    <View style={{ position: 'absolute', right: 0, width: size * 0.2, height: size * 0.15, backgroundColor: color }} />
  </View>
);

// Import our training data
import {
  phases,
  milestones,
  getWorkoutById,
  getCurrentPhase,
  pitchCountRules,
  Workout,
  Exercise,
  Phase,
  Milestone,
} from './src/data/trainingProgram';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const { width, height } = Dimensions.get('window');
const DEFAULT_START_DATE = new Date(); // Default to today if not set

interface UserProgress {
  totalPoints: number;
  workoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  completedWorkouts: string[]; // workout date keys
  completedMilestones: string[];
  armCareCount: number;
  weeklyWorkouts: number;
  scheduledPitchingDays: string[]; // ISO date strings for scheduled pitching days
  pitchHistory: { date: string; count: number }[]; // track actual pitches thrown
  programStartDate: string | null; // User-configurable program start date
  completedExerciseIds: string[]; // Track individual exercise completions for points
  dailyPoints: { [date: string]: number }; // Points earned per day
}

interface WorkoutRecommendation {
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  icon: string;
}

const defaultProgress: UserProgress = {
  totalPoints: 0,
  workoutsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  completedWorkouts: [],
  completedMilestones: [],
  armCareCount: 0,
  weeklyWorkouts: 0,
  scheduledPitchingDays: [],
  pitchHistory: [],
  programStartDate: null,
  completedExerciseIds: [],
  dailyPoints: {},
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPhase, setCurrentPhase] = useState<Phase>(phases[0]);
  const [showWorkout, setShowWorkout] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [showPitchScheduler, setShowPitchScheduler] = useState(false);
  const [schedulerMonth, setSchedulerMonth] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDateMonth, setStartDateMonth] = useState(new Date());
  const [showExerciseDetail, setShowExerciseDetail] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showWorkoutSummary, setShowWorkoutSummary] = useState(false);
  const [workoutSessionPoints, setWorkoutSessionPoints] = useState(0);
  const [workoutSessionExercises, setWorkoutSessionExercises] = useState(0);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // v2.0 Feature States
  const [showCoachBot, setShowCoachBot] = useState(false);
  const [coachBotPlanType, setCoachBotPlanType] = useState<'training' | 'nutrition'>('training');
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [hasCustomPlan, setHasCustomPlan] = useState(false);
  const [hasNutritionPlan, setHasNutritionPlan] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [userSports, setUserSports] = useState<string[]>([]);

  // Check if user plays baseball (for showing pitching-specific content)
  const isBaseballPlayer = userSports.some(sport =>
    sport.toLowerCase().includes('baseball') || sport.toLowerCase().includes('softball')
  );

  // Get the program start date (from user settings or default)
  const getProgramStartDate = (): Date => {
    if (progress.programStartDate) {
      return new Date(progress.programStartDate);
    }
    return DEFAULT_START_DATE;
  };

  // Load progress from storage
  useEffect(() => {
    loadProgress();
    setupNotifications();
    loadV2Features();
  }, []);

  // Update current phase when progress changes (specifically when start date changes)
  useEffect(() => {
    const startDate = getProgramStartDate();
    setCurrentPhase(getCurrentPhase(startDate));
  }, [progress.programStartDate]);

  // Load v2.0 features (team, API key, etc.)
  const loadV2Features = async () => {
    try {
      // Load API key
      const savedApiKey = await AsyncStorage.getItem('mountain_openrouter_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }

      // Check for custom plan and load user sports
      const savedPlan = await AsyncStorage.getItem('mountain_generated_plan');
      if (savedPlan) {
        setHasCustomPlan(true);
        try {
          const planData = JSON.parse(savedPlan);
          // Get sports from plan - could be in sports array or userInputs.sport
          const sports = planData.sports ||
            (planData.userInputs?.sport
              ? (Array.isArray(planData.userInputs.sport) ? planData.userInputs.sport : [planData.userInputs.sport])
              : []);
          if (sports.length > 0) {
            setUserSports(sports);
          }
        } catch (e) {
          console.log('Error parsing plan for sports:', e);
        }
      }

      // Check for nutrition plan
      const savedNutritionPlan = await AsyncStorage.getItem('mountain_nutrition_plan');
      if (savedNutritionPlan) {
        setHasNutritionPlan(true);
      }

      // Initialize Supabase and load team
      // Note: Replace with your actual Supabase credentials
      // supabaseService.initialize('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
      const team = await supabaseService.getCurrentTeam();
      setCurrentTeam(team);
    } catch (e) {
      console.log('Error loading v2 features:', e);
    }
  };

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('joboo_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all new fields exist (for backward compatibility)
        setProgress({
          ...defaultProgress,
          ...parsed,
          completedExerciseIds: parsed.completedExerciseIds || [],
          scheduledPitchingDays: parsed.scheduledPitchingDays || [],
          pitchHistory: parsed.pitchHistory || [],
          programStartDate: parsed.programStartDate || null,
          dailyPoints: parsed.dailyPoints || {}, // Track points per day
        });
      }
    } catch (e) {
      console.log('Error loading progress:', e);
    }
  };

  const saveProgress = async (newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem('joboo_progress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (e) {
      console.log('Error saving progress:', e);
    }
  };

  // Reset functions for Settings
  const resetPoints = () => {
    saveProgress({
      ...progress,
      totalPoints: 0,
      dailyPoints: {},
    });
  };

  const resetStreak = () => {
    saveProgress({
      ...progress,
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    });
  };

  const resetSessions = () => {
    saveProgress({
      ...progress,
      workoutsCompleted: 0,
      completedWorkouts: [],
      completedExerciseIds: [],
      weeklyWorkouts: 0,
    });
  };

  const resetPitchingData = () => {
    saveProgress({
      ...progress,
      scheduledPitchingDays: [],
      pitchHistory: [],
    });
  };

  const resetMilestones = () => {
    saveProgress({
      ...progress,
      completedMilestones: [],
    });
  };

  const resetAllData = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.removeItem('joboo_progress');
      await AsyncStorage.removeItem('mountain_generated_plan');
      await AsyncStorage.removeItem('mountain_nutrition_plan');
      await AsyncStorage.removeItem('mountain_openrouter_api_key');

      // Reset all state
      setProgress(defaultProgress);
      setHasCustomPlan(false);
      setHasNutritionPlan(false);
      setUserSports([]);
    } catch (e) {
      console.log('Error resetting data:', e);
    }
  };

  const confirmResetAllData = () => {
    Alert.alert(
      '⚠️ Reset All Data?',
      'This will delete ALL your data including:\n\n• Training Plan\n• Nutrition Plan\n• Progress & Points\n• Streaks & Milestones\n\nYou will need to purchase new plans ($1.99 each) to regenerate them.\n\nThis cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetAllData();
            setShowSettings(false);
          },
        },
      ]
    );
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    // Schedule daily workout reminder at 4 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏋️ Time to Train!",
        body: "Your workout is waiting. Let's get stronger!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 16,
        minute: 0,
      },
    });
  };

  const triggerCelebration = () => {
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkMilestones = (newProgress: UserProgress): Milestone | null => {
    for (const milestone of milestones) {
      if (newProgress.completedMilestones.includes(milestone.id)) continue;

      let achieved = false;
      switch (milestone.type) {
        case 'daily':
          achieved = newProgress.workoutsCompleted >= milestone.requirement;
          break;
        case 'streak':
          achieved = newProgress.currentStreak >= milestone.requirement;
          break;
        case 'weekly':
          achieved = newProgress.weeklyWorkouts >= milestone.requirement;
          break;
        case 'phase':
          const startDate = getProgramStartDate();
          const weekNum = Math.floor(
            (new Date().getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          ) + 1;
          const phaseComplete = phases.find(p => p.id === milestone.requirement);
          achieved = phaseComplete ? weekNum > phaseComplete.endWeek : false;
          break;
      }

      if (achieved) {
        return milestone;
      }
    }
    return null;
  };

  const completeWorkout = (workout: Workout) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = progress.currentStreak;
    if (progress.lastWorkoutDate === yesterday) {
      newStreak += 1;
    } else if (progress.lastWorkoutDate !== today) {
      newStreak = 1;
    }

    const newProgress: UserProgress = {
      ...progress,
      totalPoints: progress.totalPoints + workout.points,
      workoutsCompleted: progress.workoutsCompleted + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastWorkoutDate: today,
      completedWorkouts: [...progress.completedWorkouts, `${today}-${workout.id}`],
      weeklyWorkouts: progress.weeklyWorkouts + 1,
    };

    // Check for new milestones
    const milestone = checkMilestones(newProgress);
    if (milestone) {
      newProgress.totalPoints += milestone.points;
      newProgress.completedMilestones = [...newProgress.completedMilestones, milestone.id];
      setNewMilestone(milestone);
      setShowMilestone(true);
    }

    saveProgress(newProgress);
    triggerCelebration();
    setShowWorkout(false);
    setCompletedExercises([]);

    // Send congratulations notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 Workout Complete!",
        body: `+${workout.points} points! You're on a ${newStreak}-day streak!`,
        sound: true,
      },
      trigger: null, // Immediate
    });
  };

  const toggleExercise = (exercise: Exercise) => {
    const exerciseId = exercise.id;
    const today = new Date().toDateString();
    const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD for dailyPoints
    const exerciseKey = `${today}-${exerciseId}`;
    const exercisePoints = exercise.points || 5;

    // Ensure completedExerciseIds exists
    const currentCompletedIds = progress.completedExerciseIds || [];
    const currentDailyPoints = progress.dailyPoints || {};

    if (completedExercises.includes(exerciseId)) {
      // Unchecking - remove points
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId));

      // Remove from permanent record and subtract points
      if (currentCompletedIds.includes(exerciseKey)) {
        const newDailyPoints = { ...currentDailyPoints };
        newDailyPoints[todayKey] = Math.max(0, (newDailyPoints[todayKey] || 0) - exercisePoints);

        saveProgress({
          ...progress,
          totalPoints: Math.max(0, progress.totalPoints - exercisePoints),
          completedExerciseIds: currentCompletedIds.filter(id => id !== exerciseKey),
          dailyPoints: newDailyPoints,
        });
        setWorkoutSessionPoints(prev => Math.max(0, prev - exercisePoints));
        setWorkoutSessionExercises(prev => Math.max(0, prev - 1));
      }
    } else {
      // Checking - award points
      setCompletedExercises([...completedExercises, exerciseId]);

      // Add to permanent record and add points (only if not already completed today)
      if (!currentCompletedIds.includes(exerciseKey)) {
        const newDailyPoints = { ...currentDailyPoints };
        newDailyPoints[todayKey] = (newDailyPoints[todayKey] || 0) + exercisePoints;

        saveProgress({
          ...progress,
          totalPoints: progress.totalPoints + exercisePoints,
          completedExerciseIds: [...currentCompletedIds, exerciseKey],
          dailyPoints: newDailyPoints,
        });
        setWorkoutSessionPoints(prev => prev + exercisePoints);
        setWorkoutSessionExercises(prev => prev + 1);
        triggerCelebration();
      }
    }
  };

  const getExercisePoints = (exercise: Exercise): number => {
    return exercise.points || 5;
  };

  const openExerciseDetail = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseDetail(true);
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Pitching day helper functions
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isPitchingDay = (date: Date): boolean => {
    return progress.scheduledPitchingDays.includes(getDateKey(date));
  };

  const isTomorrowPitchingDay = (): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isPitchingDay(tomorrow);
  };

  const isTodayPitchingDay = (): boolean => {
    return isPitchingDay(new Date());
  };

  const wasYesterdayPitchingDay = (): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return isPitchingDay(yesterday);
  };

  const togglePitchingDay = (date: Date) => {
    const dateKey = getDateKey(date);
    let newScheduledDays: string[];

    if (progress.scheduledPitchingDays.includes(dateKey)) {
      newScheduledDays = progress.scheduledPitchingDays.filter(d => d !== dateKey);
    } else {
      newScheduledDays = [...progress.scheduledPitchingDays, dateKey];
    }

    saveProgress({
      ...progress,
      scheduledPitchingDays: newScheduledDays,
    });
  };

  const getWorkoutRecommendations = (): WorkoutRecommendation[] => {
    const recommendations: WorkoutRecommendation[] = [];

    // Check if tomorrow is a pitching day - warn about heavy legs TODAY
    if (isTomorrowPitchingDay()) {
      recommendations.push({
        type: 'warning',
        title: 'Pitching Tomorrow',
        message: 'Skip heavy leg work today to keep legs fresh for pitching. Fresh legs = more power & less arm strain.',
        icon: '⚠️',
      });
    }

    // Check if today is a pitching day
    if (isTodayPitchingDay()) {
      recommendations.push({
        type: 'info',
        title: 'Game Day',
        message: 'Focus on warm-up and arm care. No heavy lifting today!',
        icon: '⚾',
      });
    }

    // Check if yesterday was a pitching day - recommend extra arm care
    if (wasYesterdayPitchingDay()) {
      recommendations.push({
        type: 'success',
        title: 'Recovery Day',
        message: 'You pitched yesterday! Do extra arm care today: band work, stretching, and light movement.',
        icon: '💪',
      });
    }

    return recommendations;
  };

  const shouldSkipHeavyLegs = (): boolean => {
    return isTomorrowPitchingDay() || isTodayPitchingDay();
  };

  const shouldDoExtraArmCare = (): boolean => {
    return wasYesterdayPitchingDay();
  };

  const getWorkoutForDay = (dayOfWeek: number): string => {
    // Return empty if no custom plan yet
    if (!hasCustomPlan) {
      return '';
    }
    const schedule = currentPhase.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);
    return schedule?.workoutType || 'Rest';
  };

  const isWorkoutCompleted = (date: Date): boolean => {
    return progress.completedWorkouts.some(w => w.startsWith(date.toDateString()));
  };

  const getDailyPointsForDate = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    return (progress.dailyPoints || {})[dateKey] || 0;
  };

  const getCompletedExercisesForDate = (date: Date): number => {
    const dateString = date.toDateString();
    const completedIds = progress.completedExerciseIds || [];
    return completedIds.filter(id => id.startsWith(dateString)).length;
  };

  const openDayDetail = (date: Date) => {
    setSelectedDayDate(date);
    setShowDayDetail(true);
  };

  const renderCalendar = () => {
    const weekDates = getWeekDates();
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.weekLabel}>THIS WEEK</Text>
        <View style={styles.calendarRow}>
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const completed = isWorkoutCompleted(date);
            const workoutType = getWorkoutForDay(index);
            const dayPoints = getDailyPointsForDate(date);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayContainer,
                  isToday && styles.todayContainer,
                  completed && styles.completedContainer,
                ]}
                onPress={() => openDayDetail(date)}
              >
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {dayNames[index]}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                  {date.getDate()}
                </Text>
                {completed && <Text style={styles.checkmark}>✓</Text>}
                {isBaseballPlayer && isPitchingDay(date) && <Text style={styles.pitchIndicator}>⚾</Text>}
                {dayPoints > 0 && (
                  <Text style={styles.dayPoints}>+{dayPoints}</Text>
                )}
                {dayPoints === 0 && workoutType && (
                  <Text style={styles.workoutLabel} numberOfLines={1}>
                    {workoutType === 'OFF' ? '💤' : workoutType.split(' ')[0]}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <IconPeak size={26} color="#f39c12" />
        <Text style={styles.statNumber}>{progress.totalPoints}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
      <View style={styles.statBox}>
        <IconFlame size={26} color="#e74c3c" />
        <Text style={styles.statNumber}>{progress.currentStreak}</Text>
        <Text style={styles.statLabel}>Streak</Text>
      </View>
      <View style={styles.statBox}>
        <IconDumbbell size={26} color="#4a6fa5" />
        <Text style={styles.statNumber}>{progress.workoutsCompleted}</Text>
        <Text style={styles.statLabel}>Sessions</Text>
      </View>
    </View>
  );

  const renderPhaseInfo = () => {
    // Don't show phase info if user doesn't have a custom plan
    if (!hasCustomPlan) {
      return (
        <TouchableOpacity
          style={styles.phaseContainer}
          onPress={() => {
            setCoachBotPlanType('training');
            setShowCoachBot(true);
          }}
        >
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={styles.phaseGradient}
          >
            <View style={styles.phaseHeader}>
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseName} numberOfLines={1}>Welcome to ATP!</Text>
                <Text style={styles.phaseWeeks}>
                  Create your personalized training plan
                </Text>
              </View>
              <View style={styles.startDateButton}>
                <Text style={styles.startDateValue}>Get Started →</Text>
              </View>
            </View>
            <View style={styles.goalsContainer}>
              <Text style={styles.goalText}>• AI-powered workout programs tailored to your sport</Text>
              <Text style={styles.goalText}>• Track progress and earn points</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    const startDate = progress.programStartDate ? new Date(progress.programStartDate) : null;
    const startDateText = startDate
      ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Not set';

    return (
      <TouchableOpacity
        style={styles.phaseContainer}
        onPress={() => {
          setStartDateMonth(new Date());
          setShowStartDatePicker(true);
        }}
      >
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={styles.phaseGradient}
        >
          <View style={styles.phaseHeader}>
            <View style={styles.phaseInfo}>
              <Text style={styles.phaseName} numberOfLines={1}>Phase {currentPhase.id}: {currentPhase.name}</Text>
              <Text style={styles.phaseWeeks}>
                Weeks {currentPhase.startWeek}-{currentPhase.endWeek}
              </Text>
            </View>
            <View style={styles.startDateButton}>
              <Text style={styles.startDateLabel}>Start</Text>
              <Text style={styles.startDateValue}>{startDateText}</Text>
              <Text style={styles.startDateEdit}>✏️</Text>
            </View>
          </View>
          <View style={styles.goalsContainer}>
            {currentPhase.goals.slice(0, 2).map((goal, index) => (
              <Text key={index} style={styles.goalText}>• {goal}</Text>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderTodayWorkout = () => {
    // Don't show today's workout if user doesn't have a custom plan
    if (!hasCustomPlan) {
      return (
        <TouchableOpacity
          style={styles.todayWorkoutCard}
          onPress={() => {
            setCoachBotPlanType('training');
            setShowCoachBot(true);
          }}
        >
          <View style={styles.todayHeader}>
            <Text style={styles.todayTitle}>GET YOUR TRAINING PLAN</Text>
          </View>
          <Text style={styles.todayWorkoutName}>
            Create a personalized AI workout program
          </Text>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>CREATE PLAN →</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const today = new Date().getDay();
    const schedule = currentPhase.weeklySchedule.find(s => s.dayOfWeek === today);
    const workout = schedule?.workoutId ? getWorkoutById(schedule.workoutId) : null;
    const completed = isWorkoutCompleted(new Date());

    return (
      <TouchableOpacity
        style={[styles.todayWorkoutCard, completed && styles.completedCard]}
        onPress={() => {
          if (workout) {
            setActiveWorkout(workout);
            setShowWorkout(true);
          }
        }}
        disabled={!workout || completed}
      >
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>
            {completed ? '✓ SESSION COMPLETE' : "TODAY'S SESSION"}
          </Text>
          {workout && <Text style={styles.todayPoints}>+{workout.points} pts</Text>}
        </View>
        <Text style={styles.todayWorkoutName}>
          {schedule?.workoutType || 'Recovery Day'}
        </Text>
        {workout && !completed && (
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>START TRAINING →</Text>
          </View>
        )}
        {completed && (
          <Text style={styles.completedText}>Good work. Rest up for tomorrow.</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderWorkoutModal = () => (
    <Modal visible={showWorkout} animationType="slide">
      <SafeAreaView style={styles.workoutModal}>
        <ScrollView>
          <View style={styles.workoutHeader}>
            <TouchableOpacity onPress={closeWorkoutWithSummary}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.workoutTitle}>{activeWorkout?.name}</Text>
            <Text style={styles.workoutDuration}>{activeWorkout?.duration} min</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${activeWorkout ? (completedExercises.length / activeWorkout.exercises.length) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedExercises.length}/{activeWorkout?.exercises.length || 0} exercises
          </Text>

          {activeWorkout?.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseRowContainer}>
              {/* Exercise completion area */}
              <TouchableOpacity
                style={[
                  styles.exerciseItemMain,
                  completedExercises.includes(exercise.id) && styles.exerciseCompleted,
                ]}
                onPress={() => toggleExercise(exercise)}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseCheck}>
                  {completedExercises.includes(exercise.id) ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : (
                    <Text style={styles.exerciseNumber}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} × {exercise.reps}
                    {exercise.equipment && ` • ${exercise.equipment}`}
                  </Text>
                  <Text style={styles.exercisePointsSmall}>+{getExercisePoints(exercise)} pts</Text>
                </View>
              </TouchableOpacity>

              {/* Info button - completely separate */}
              <TouchableOpacity
                style={styles.infoButtonStandalone}
                onPress={() => {
                  setSelectedExercise(exercise);
                  setShowWorkout(false); // Close workout modal first
                  setTimeout(() => {
                    setShowExerciseDetail(true); // Then show exercise detail
                  }, 100);
                }}
              >
                <Text style={styles.infoButtonEmoji}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          ))}

          {activeWorkout && completedExercises.length === activeWorkout.exercises.length && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => completeWorkout(activeWorkout)}
            >
              <LinearGradient
                colors={['#00b894', '#00cec9']}
                style={styles.completeGradient}
              >
                <Text style={styles.completeText}>🎉 COMPLETE WORKOUT 🎉</Text>
                <Text style={styles.pointsEarned}>+{activeWorkout.points} points</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderMilestoneModal = () => (
    <Modal visible={showMilestone} transparent animationType="fade">
      <View style={styles.milestoneOverlay}>
        <Animated.View
          style={[
            styles.milestoneCard,
            {
              transform: [
                {
                  scale: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.milestoneIcon}>{newMilestone?.icon}</Text>
          <Text style={styles.milestoneName}>{newMilestone?.name}</Text>
          <Text style={styles.milestoneDesc}>{newMilestone?.description}</Text>
          <Text style={styles.milestonePoints}>+{newMilestone?.points} POINTS!</Text>
          <TouchableOpacity
            style={styles.milestoneButton}
            onPress={() => setShowMilestone(false)}
          >
            <Text style={styles.milestoneButtonText}>AWESOME!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderPitchSchedulerModal = () => {
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const days: (Date | null)[] = [];
      // Add empty slots for days before the 1st
      for (let i = 0; i < startingDay; i++) {
        days.push(null);
      }
      // Add all days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      return days;
    };

    const monthDays = getDaysInMonth(schedulerMonth);
    const monthName = schedulerMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <Modal visible={showPitchScheduler} animationType="slide">
        <SafeAreaView style={styles.schedulerModal}>
          <View style={styles.schedulerHeader}>
            <TouchableOpacity onPress={() => setShowPitchScheduler(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.schedulerTitle}>Schedule Pitching Days</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={() => {
                const prev = new Date(schedulerMonth);
                prev.setMonth(prev.getMonth() - 1);
                setSchedulerMonth(prev);
              }}
            >
              <Text style={styles.navArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity
              onPress={() => {
                const next = new Date(schedulerMonth);
                next.setMonth(next.getMonth() + 1);
                setSchedulerMonth(next);
              }}
            >
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDayLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {monthDays.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const isScheduled = isPitchingDay(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.calendarDay,
                    isScheduled && styles.pitchingDay,
                    isToday && styles.todayDay,
                  ]}
                  onPress={() => togglePitchingDay(date)}
                >
                  <Text style={[
                    styles.calendarDayText,
                    isScheduled && styles.pitchingDayText,
                    isPast && styles.pastDayText,
                  ]}>
                    {date.getDate()}
                  </Text>
                  {isScheduled && <Text style={styles.pitchIcon}>⚾</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.schedulerLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
              <Text style={styles.legendText}>Pitching Day</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ffd700' }]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>

          <View style={styles.schedulerInfo}>
            <Text style={styles.schedulerInfoTitle}>⚾ Smart Training Alerts</Text>
            <Text style={styles.schedulerInfoText}>
              • Day BEFORE pitching: Skip heavy legs{'\n'}
              • Day OF pitching: Light warm-up only{'\n'}
              • Day AFTER pitching: Extra arm care
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderStartDatePickerModal = () => {
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const days: (Date | null)[] = [];
      for (let i = 0; i < startingDay; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      return days;
    };

    const monthDays = getDaysInMonth(startDateMonth);
    const monthName = startDateMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const currentStartDate = progress.programStartDate ? new Date(progress.programStartDate) : null;

    return (
      <Modal visible={showStartDatePicker} animationType="slide">
        <SafeAreaView style={styles.schedulerModal}>
          <View style={styles.schedulerHeader}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.schedulerTitle}>Set Program Start Date</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.startDateInfo}>
            <Text style={styles.startDateInfoText}>
              {currentStartDate
                ? `Current: ${currentStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'No start date set - tap a date below'}
            </Text>
          </View>

          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={() => {
                const prev = new Date(startDateMonth);
                prev.setMonth(prev.getMonth() - 1);
                setStartDateMonth(prev);
              }}
            >
              <Text style={styles.navArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity
              onPress={() => {
                const next = new Date(startDateMonth);
                next.setMonth(next.getMonth() + 1);
                setStartDateMonth(next);
              }}
            >
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDayLabel}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {monthDays.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const isSelected = currentStartDate && date.toDateString() === currentStartDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.calendarDay,
                    isSelected && styles.selectedStartDate,
                    isToday && !isSelected && styles.todayDay,
                  ]}
                  onPress={() => {
                    saveProgress({
                      ...progress,
                      programStartDate: date.toISOString(),
                    });
                    setCurrentPhase(getCurrentPhase(date));
                    setShowStartDatePicker(false);
                  }}
                >
                  <Text style={[
                    styles.calendarDayText,
                    isSelected && styles.selectedStartDateText,
                  ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.schedulerInfo}>
            <Text style={styles.schedulerInfoTitle}>📅 How This Works</Text>
            <Text style={styles.schedulerInfoText}>
              Select when you want to start (or started) the 14-week program.{'\n\n'}
              • Phase 1: Weeks 1-4 (Foundation){'\n'}
              • Phase 2: Weeks 5-8 (Strength){'\n'}
              • Phase 3: Weeks 9-12 (Power){'\n'}
              • Phase 4: Weeks 13-14 (Peak)
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const closeWorkoutWithSummary = () => {
    // Only show summary if exercises were completed THIS session
    if (workoutSessionExercises > 0 && workoutSessionPoints > 0) {
      setShowWorkout(false); // Close workout modal first
      setTimeout(() => {
        setShowWorkoutSummary(true); // Then show summary
      }, 100);
    } else {
      setShowWorkout(false);
      setCompletedExercises([]);
      setWorkoutSessionPoints(0);
      setWorkoutSessionExercises(0);
    }
  };

  const dismissSummary = () => {
    setShowWorkoutSummary(false);
    // Reset all session state
    setCompletedExercises([]);
    setWorkoutSessionPoints(0);
    setWorkoutSessionExercises(0);
    setActiveWorkout(null);
  };

  const renderWorkoutSummaryModal = () => (
    <Modal visible={showWorkoutSummary} transparent animationType="fade">
      <View style={styles.summaryOverlay}>
        <View style={styles.summaryCard}>
          <IconPeak size={50} color="#f39c12" />
          <Text style={styles.summaryTitle}>SESSION COMPLETE</Text>
          <Text style={styles.summarySubtitle}>{activeWorkout?.name}</Text>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatNumber}>{workoutSessionExercises}</Text>
              <Text style={styles.summaryStatLabel}>Exercises</Text>
            </View>
            <View style={styles.summaryStatDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatNumber}>+{workoutSessionPoints}</Text>
              <Text style={styles.summaryStatLabel}>Points</Text>
            </View>
          </View>

          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total Points</Text>
            <Text style={styles.summaryTotalNumber}>{progress.totalPoints}</Text>
          </View>

          <TouchableOpacity style={styles.summaryButton} onPress={dismissSummary}>
            <Text style={styles.summaryButtonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderExerciseDetailModal = () => {
    if (!selectedExercise) return null;

    return (
      <Modal visible={showExerciseDetail} animationType="slide">
        <SafeAreaView style={styles.exerciseDetailModal}>
          <View style={styles.exerciseDetailHeader}>
            <TouchableOpacity onPress={() => {
              setShowExerciseDetail(false);
              setTimeout(() => {
                setShowWorkout(true); // Reopen workout modal
              }, 100);
            }}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.exerciseDetailTitle}>{selectedExercise.name}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.exerciseDetailContent}>
            {/* Points */}
            <View style={styles.exercisePointsBadge}>
              <Text style={styles.exercisePointsText}>+{getExercisePoints(selectedExercise)} pts</Text>
            </View>

            {/* Sets & Reps */}
            <View style={styles.exerciseMetaRow}>
              <View style={styles.exerciseMetaItem}>
                <Text style={styles.exerciseMetaLabel}>Sets</Text>
                <Text style={styles.exerciseMetaValue}>{selectedExercise.sets}</Text>
              </View>
              <View style={styles.exerciseMetaItem}>
                <Text style={styles.exerciseMetaLabel}>Reps</Text>
                <Text style={styles.exerciseMetaValue}>{selectedExercise.reps}</Text>
              </View>
              {selectedExercise.equipment && (
                <View style={styles.exerciseMetaItem}>
                  <Text style={styles.exerciseMetaLabel}>Equipment</Text>
                  <Text style={styles.exerciseMetaValue}>{selectedExercise.equipment}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            {selectedExercise.description && (
              <View style={styles.exerciseSection}>
                <Text style={styles.exerciseSectionTitle}>About</Text>
                <Text style={styles.exerciseSectionText}>{selectedExercise.description}</Text>
              </View>
            )}

            {/* Instructions */}
            {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
              <View style={styles.exerciseSection}>
                <Text style={styles.exerciseSectionTitle}>How To Do It</Text>
                {selectedExercise.instructions.map((step, index) => (
                  <View key={index} style={styles.instructionStep}>
                    <Text style={styles.instructionNumber}>{index + 1}</Text>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Notes */}
            {selectedExercise.notes && (
              <View style={styles.exerciseSection}>
                <Text style={styles.exerciseSectionTitle}>💡 Tips</Text>
                <Text style={styles.exerciseSectionText}>{selectedExercise.notes}</Text>
              </View>
            )}

            {/* Video Link - search YouTube for the exercise */}
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => {
                const searchQuery = encodeURIComponent(selectedExercise.name + ' exercise tutorial');
                Linking.openURL(`https://www.youtube.com/results?search_query=${searchQuery}`);
              }}
            >
              <Text style={styles.videoButtonIcon}>▶️</Text>
              <Text style={styles.videoButtonText}>Search Demo Videos</Text>
            </TouchableOpacity>

            {/* Complete Button */}
            <TouchableOpacity
              style={[
                styles.completeExerciseButton,
                completedExercises.includes(selectedExercise.id) && styles.completedExerciseButton,
              ]}
              onPress={() => {
                toggleExercise(selectedExercise);
                setShowExerciseDetail(false);
                setTimeout(() => {
                  setShowWorkout(true); // Reopen workout modal
                }, 100);
              }}
            >
              <Text style={styles.completeExerciseButtonText}>
                {completedExercises.includes(selectedExercise.id)
                  ? '✓ Completed!'
                  : `Complete (+${getExercisePoints(selectedExercise)} pts)`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderDayDetailModal = () => {
    if (!selectedDayDate) return null;

    const dayOfWeek = selectedDayDate.getDay();
    // Only get schedule/workout if user has a custom plan
    const schedule = hasCustomPlan ? currentPhase.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek) : null;
    const workout = schedule?.workoutId ? getWorkoutById(schedule.workoutId) : null;
    const dayPoints = getDailyPointsForDate(selectedDayDate);
    const exercisesCompleted = getCompletedExercisesForDate(selectedDayDate);
    const isPitching = isPitchingDay(selectedDayDate);
    const isToday = selectedDayDate.toDateString() === new Date().toDateString();
    const dateLabel = selectedDayDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    return (
      <Modal visible={showDayDetail} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dayDetailOverlay}
          activeOpacity={1}
          onPress={() => setShowDayDetail(false)}
        >
          <View style={styles.dayDetailCard}>
            <Text style={styles.dayDetailDate}>{dateLabel}</Text>
            {isToday && <Text style={styles.dayDetailToday}>TODAY</Text>}

            {/* Stats Row */}
            <View style={styles.dayDetailStats}>
              <View style={styles.dayDetailStatItem}>
                <Text style={styles.dayDetailStatNumber}>{exercisesCompleted}</Text>
                <Text style={styles.dayDetailStatLabel}>Exercises</Text>
              </View>
              <View style={styles.dayDetailStatItem}>
                <Text style={styles.dayDetailStatNumber}>+{dayPoints}</Text>
                <Text style={styles.dayDetailStatLabel}>Points</Text>
              </View>
            </View>

            {/* Workout Info - only show if user has a custom plan */}
            {hasCustomPlan ? (
              <View style={styles.dayDetailWorkout}>
                <Text style={styles.dayDetailWorkoutLabel}>Scheduled:</Text>
                <Text style={styles.dayDetailWorkoutName}>
                  {schedule?.workoutType || 'Rest Day'}
                </Text>
              </View>
            ) : (
              <View style={styles.dayDetailWorkout}>
                <Text style={styles.dayDetailWorkoutLabel}>No training plan yet</Text>
                <Text style={styles.dayDetailWorkoutName}>
                  Create a plan to see scheduled workouts
                </Text>
              </View>
            )}

            {/* Pitching Badge - only for baseball players */}
            {isBaseballPlayer && isPitching && (
              <View style={styles.dayDetailPitchBadge}>
                <Text style={styles.dayDetailPitchText}>⚾ Pitching Day</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.dayDetailActions}>
              {hasCustomPlan && workout && (
                <TouchableOpacity
                  style={styles.dayDetailButton}
                  onPress={() => {
                    setShowDayDetail(false);
                    setActiveWorkout(workout);
                    setShowWorkout(true);
                  }}
                >
                  <Text style={styles.dayDetailButtonText}>
                    {isToday ? '▶ Start Workout' : '👀 View Workout'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Mark as Pitching - only for baseball/softball players */}
              {isBaseballPlayer && (
                <TouchableOpacity
                  style={[
                    styles.dayDetailPitchButton,
                    isPitching && styles.dayDetailPitchButtonActive
                  ]}
                  onPress={() => {
                    togglePitchingDay(selectedDayDate);
                  }}
                >
                  <Text style={styles.dayDetailPitchButtonText}>
                    {isPitching ? '✓ Pitching Day' : '⚾ Mark as Pitching'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.dayDetailClose}
              onPress={() => setShowDayDetail(false)}
            >
              <Text style={styles.dayDetailCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderSettingsModal = () => {
    const startDate = progress.programStartDate ? new Date(progress.programStartDate) : null;
    const startDateText = startDate
      ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Not set';

    return (
      <Modal visible={showSettings} transparent animationType="fade">
        <TouchableOpacity
          style={styles.settingsOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.settingsCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.settingsTitle}>Settings</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.settingsScroll}>
            {/* Program Start Date */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                setShowSettings(false);
                setStartDateMonth(new Date());
                setShowStartDatePicker(true);
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconCalendar size={22} color="#f39c12" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Program Start Date</Text>
                  <Text style={styles.settingsItemValue}>{startDateText}</Text>
                </View>
              </View>
              <Text style={styles.settingsItemArrow}>›</Text>
            </TouchableOpacity>

            <Text style={styles.settingsSectionTitle}>Reset Data</Text>

            {/* Reset Points */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                resetPoints();
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconPeak size={22} color="#f39c12" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Reset Points</Text>
                  <Text style={styles.settingsItemValue}>Current: {progress.totalPoints} pts</Text>
                </View>
              </View>
              <Text style={styles.settingsResetBtn}>Reset</Text>
            </TouchableOpacity>

            {/* Reset Streak */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                resetStreak();
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconFlame size={22} color="#e74c3c" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Reset Streak</Text>
                  <Text style={styles.settingsItemValue}>Current: {progress.currentStreak} days</Text>
                </View>
              </View>
              <Text style={styles.settingsResetBtn}>Reset</Text>
            </TouchableOpacity>

            {/* Reset Sessions */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                resetSessions();
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconDumbbell size={22} color="#4a6fa5" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Reset Sessions</Text>
                  <Text style={styles.settingsItemValue}>Current: {progress.workoutsCompleted} sessions</Text>
                </View>
              </View>
              <Text style={styles.settingsResetBtn}>Reset</Text>
            </TouchableOpacity>

            {/* Reset Pitching Data */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                resetPitchingData();
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconBaseball size={22} color="#e8f4f8" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Reset Pitching Data</Text>
                  <Text style={styles.settingsItemValue}>{progress.scheduledPitchingDays.length} scheduled days</Text>
                </View>
              </View>
              <Text style={styles.settingsResetBtn}>Reset</Text>
            </TouchableOpacity>

            {/* Reset Milestones */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                resetMilestones();
              }}
            >
              <View style={styles.settingsItemLeft}>
                <IconStats size={22} color="#2ecc71" />
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Reset Milestones</Text>
                  <Text style={styles.settingsItemValue}>{progress.completedMilestones.length} earned</Text>
                </View>
              </View>
              <Text style={styles.settingsResetBtn}>Reset</Text>
            </TouchableOpacity>

            {/* Reset All Data */}
            <TouchableOpacity
              style={[styles.settingsItem, styles.settingsDangerItem]}
              onPress={confirmResetAllData}
            >
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsDangerIcon}>⚠️</Text>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsDangerLabel}>Reset All Data</Text>
                  <Text style={styles.settingsDangerValue}>Start completely fresh</Text>
                </View>
              </View>
              <Text style={styles.settingsDangerBtn}>Reset All</Text>
            </TouchableOpacity>

            <Text style={styles.settingsSectionTitle}>About ATP</Text>

            {/* Our Nutrition Philosophy */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                Linking.openURL('https://rickybaker13.github.io/atp-training/nutrition-philosophy.html');
              }}
            >
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsAboutIcon}>🥗</Text>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Our Nutrition Philosophy</Text>
                  <Text style={styles.settingsItemValue}>Youth-focused, no restriction</Text>
                </View>
              </View>
              <Text style={styles.settingsItemArrow}>›</Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                Linking.openURL('https://rickybaker13.github.io/atp-training/privacy.html');
              }}
            >
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsAboutIcon}>🔒</Text>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Privacy Policy</Text>
                </View>
              </View>
              <Text style={styles.settingsItemArrow}>›</Text>
            </TouchableOpacity>

            {/* Terms of Service */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                Linking.openURL('https://rickybaker13.github.io/atp-training/terms.html');
              }}
            >
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsAboutIcon}>📄</Text>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Terms of Service</Text>
                </View>
              </View>
              <Text style={styles.settingsItemArrow}>›</Text>
            </TouchableOpacity>

            {/* App Version */}
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Text style={styles.settingsAboutIcon}>📱</Text>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemLabel}>Version</Text>
                  <Text style={styles.settingsItemValue}>2.0.1</Text>
                </View>
              </View>
            </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.settingsCloseBtn}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.settingsCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderPitchAlerts = () => {
    // Only show pitch alerts for baseball/softball players
    if (!isBaseballPlayer) return null;

    const recommendations = getWorkoutRecommendations();
    if (recommendations.length === 0) return null;

    return (
      <View style={styles.alertsContainer}>
        {recommendations.map((rec, index) => (
          <View
            key={index}
            style={[
              styles.alertCard,
              rec.type === 'danger' && styles.alertDanger,
              rec.type === 'warning' && styles.alertWarning,
              rec.type === 'info' && styles.alertInfo,
              rec.type === 'success' && styles.alertSuccess,
            ]}
          >
            <Text style={styles.alertIcon}>{rec.icon}</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{rec.title}</Text>
              <Text style={styles.alertMessage}>{rec.message}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPitchManagement = () => {
    // Only show pitching management for baseball/softball players
    if (!isBaseballPlayer) return null;

    return (
    <View style={styles.pitchManagement}>
      <Text style={styles.sectionTitle}>PITCHING</Text>
      <View style={styles.pitchCards}>
        <TouchableOpacity
          style={styles.pitchCard}
          onPress={() => {
            setSchedulerMonth(new Date());
            setShowPitchScheduler(true);
          }}
        >
          <IconCalendar size={24} color="#e74c3c" />
          <Text style={styles.pitchCardTitle}>Schedule</Text>
          <Text style={styles.pitchCardSubtitle}>Mark game days</Text>
        </TouchableOpacity>
        <View style={styles.pitchCard}>
          <IconStats size={24} color="#2ecc71" />
          <Text style={styles.pitchCardTitle}>This Week</Text>
          <Text style={styles.pitchCardSubtitle}>
            {progress.scheduledPitchingDays.filter(d => {
              const date = new Date(d);
              const now = new Date();
              const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);
              return date >= weekStart && date <= weekEnd;
            }).length} games
          </Text>
        </View>
      </View>
    </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.quickButton}
        onPress={() => {
          const busy = getWorkoutById('busy-strength');
          if (busy) {
            setActiveWorkout(busy);
            setShowWorkout(true);
          }
        }}
      >
        <IconDumbbell size={26} color="#f39c12" />
        <Text style={styles.quickLabel}>30 Min{'\n'}Strength</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.quickButton}
        onPress={() => {
          const busy = getWorkoutById('busy-speed');
          if (busy) {
            setActiveWorkout(busy);
            setShowWorkout(true);
          }
        }}
      >
        <IconBolt size={26} color="#f39c12" />
        <Text style={styles.quickLabel}>30 Min{'\n'}Speed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.quickButton}
        onPress={() => {
          const busy = getWorkoutById('busy-recovery');
          if (busy) {
            setActiveWorkout(busy);
            setShowWorkout(true);
          }
        }}
      >
        <IconRecovery size={26} color="#4a6fa5" />
        <Text style={styles.quickLabel}>Active{'\n'}Recovery</Text>
      </TouchableOpacity>
    </View>
  );

  // ATP - athlete tagline
  const tagline = "ASCEND EVERY DAY";

  // Epic mountain background - dramatic peaks (high contrast)
  const mountainBgUrl = 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1400&q=95';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: mountainBgUrl }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <LinearGradient
          colors={['rgba(5, 5, 10, 0.3)', 'rgba(10, 12, 20, 0.5)', 'rgba(15, 18, 28, 0.7)']}
          style={styles.gradient}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.headerTitles}>
                  <Text style={styles.title}>ATP</Text>
                  <Text style={styles.subtitle}>{tagline}</Text>
                </View>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => setShowSettings(true)}
                >
                  <IconSettings size={26} color="#a0aab4" />
                </TouchableOpacity>
              </View>
            </View>

          {/* Stats */}
          {renderStats()}

          {/* Phase Info */}
          {renderPhaseInfo()}

          {/* Calendar */}
          {renderCalendar()}

          {/* Pitch Alerts */}
          {renderPitchAlerts()}

          {/* v2.0 Feature Buttons */}
          <FeatureButtons
            onTeamPress={() => setShowTeamManager(true)}
            onLeaderboardPress={() => setShowLeaderboard(true)}
            onTrainingPlanPress={() => {
              setCoachBotPlanType('training');
              setShowCoachBot(true);
            }}
            onNutritionPlanPress={() => {
              setCoachBotPlanType('nutrition');
              setShowCoachBot(true);
            }}
            hasTeam={currentTeam !== null}
            hasCustomPlan={hasCustomPlan}
            hasNutritionPlan={hasNutritionPlan}
          />

          {/* Today's Workout */}
          {renderTodayWorkout()}

          {/* Pitch Management */}
          {renderPitchManagement()}

          {/* Quick Actions - only show if user has a custom plan */}
          {hasCustomPlan && (
            <>
              <Text style={styles.sectionTitle}>QUICK SESSIONS</Text>
              {renderQuickActions()}
            </>
          )}

          {/* Pitch Count Rules - Only for baseball/softball players */}
          {isBaseballPlayer && (
            <View style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>ARM CARE LIMITS</Text>
              <Text style={styles.ruleText}>Max: {pitchCountRules.maxPerGame}/game • {pitchCountRules.maxPerWeek}/week</Text>
              <Text style={styles.warningText}>⚠️ {pitchCountRules.warnings[0]}</Text>
            </View>
          )}
        </ScrollView>

          {/* Modals - order matters for z-index */}
          {renderWorkoutModal()}
          {renderMilestoneModal()}
          {renderPitchSchedulerModal()}
          {renderStartDatePickerModal()}
          {renderDayDetailModal()}
          {renderWorkoutSummaryModal()}
          {renderSettingsModal()}
          {/* Exercise detail must be LAST to appear on top */}
          {renderExerciseDetailModal()}

          {/* v2.0 Feature Modals */}
          <Modal visible={showCoachBot} animationType="slide">
            <CoachBot
              planType={coachBotPlanType}
              apiKey={apiKey}
              onComplete={async (plan, nutritionPlan) => {
                if (coachBotPlanType === 'training') {
                  setHasCustomPlan(true);
                  // Save training plan
                  await AsyncStorage.setItem('mountain_generated_plan', JSON.stringify(plan));

                  // Update user sports from the plan
                  const sports = plan.sports ||
                    (plan.userInputs?.sport
                      ? (Array.isArray(plan.userInputs.sport) ? plan.userInputs.sport : [plan.userInputs.sport])
                      : []);
                  if (sports.length > 0) {
                    setUserSports(sports);
                  }

                  if (nutritionPlan) {
                    setHasNutritionPlan(true);
                    await AsyncStorage.setItem('mountain_nutrition_plan', JSON.stringify(nutritionPlan));
                  }
                } else {
                  setHasNutritionPlan(true);
                  // Save nutrition plan
                  await AsyncStorage.setItem('mountain_nutrition_plan', JSON.stringify(plan));
                }
                setShowCoachBot(false);
                console.log('Plan generated:', plan, nutritionPlan);
              }}
              onClose={() => setShowCoachBot(false)}
            />
          </Modal>

          <Modal visible={showTeamManager} animationType="slide">
            <TeamManager
              onClose={() => setShowTeamManager(false)}
              onTeamJoined={(team) => setCurrentTeam(team)}
            />
          </Modal>

          <Modal visible={showLeaderboard} animationType="slide">
            <Leaderboard
              onClose={() => setShowLeaderboard(false)}
              currentUserId={undefined} // TODO: Get from Supabase user
            />
          </Modal>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitles: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
    marginTop: -4,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#f39c12',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 25, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 95,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#a0aab4',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },
  phaseContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
  },
  phaseGradient: {
    padding: 20,
  },
  phaseName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#f39c12',
    letterSpacing: 0.5,
  },
  phaseWeeks: {
    fontSize: 13,
    color: '#7a8a9a',
    marginTop: 4,
  },
  goalsContainer: {
    marginTop: 12,
  },
  goalText: {
    fontSize: 13,
    color: '#a0aab4',
    marginTop: 4,
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 25, 40, 0.75)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: (width - 60) / 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  todayContainer: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  completedContainer: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderColor: '#2ecc71',
    borderWidth: 2,
  },
  dayName: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dayNumber: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  todayText: {
    color: '#0a0a0f',
  },
  checkmark: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutLabel: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },
  todayWorkoutCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgba(15, 15, 25, 0.9)',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  completedCard: {
    borderLeftColor: '#2ecc71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayTitle: {
    fontSize: 12,
    color: '#7a8a9a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  todayPoints: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  todayWorkoutName: {
    fontSize: 22,
    color: '#e8f4f8',
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 1,
  },
  startButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  completedText: {
    color: '#2ecc71',
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quickButton: {
    backgroundColor: 'rgba(15, 15, 25, 0.85)',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: (width - 60) / 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickLabel: {
    fontSize: 10,
    color: '#a0aab4',
    marginTop: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  rulesCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(15, 15, 25, 0.85)',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ruleText: {
    fontSize: 13,
    color: '#a0aab4',
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#f39c12',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Workout Modal
  workoutModal: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 111, 165, 0.2)',
    backgroundColor: 'rgba(12, 15, 25, 0.95)',
  },
  closeButton: {
    fontSize: 24,
    color: '#e8f4f8',
    padding: 10,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#e8f4f8',
    letterSpacing: 1,
  },
  workoutDuration: {
    fontSize: 12,
    color: '#7a8a9a',
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(74, 111, 165, 0.2)',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    color: '#7a8a9a',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.2)',
  },
  exerciseCompleted: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderColor: '#2ecc71',
    borderWidth: 1,
  },
  exerciseCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 111, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkIcon: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseNumber: {
    color: '#7a8a9a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    color: '#e8f4f8',
    fontWeight: '600',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#7a8a9a',
    marginTop: 4,
  },
  exerciseNotes: {
    fontSize: 11,
    color: '#f39c12',
    marginTop: 4,
    fontStyle: 'italic',
  },
  categoryBadge: {
    fontSize: 9,
    color: '#4a6fa5',
    backgroundColor: 'rgba(74, 111, 165, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  completeButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pointsEarned: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  // Milestone Modal
  milestoneOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneCard: {
    backgroundColor: '#12151f',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    borderWidth: 2,
    borderColor: '#f39c12',
  },
  milestoneIcon: {
    fontSize: 60,
  },
  milestoneName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f39c12',
    marginTop: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  milestoneDesc: {
    fontSize: 14,
    color: '#a0aab4',
    marginTop: 10,
    textAlign: 'center',
  },
  milestonePoints: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 15,
  },
  milestoneButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  milestoneButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Pitch Indicator on Calendar
  pitchIndicator: {
    fontSize: 10,
    marginTop: 2,
  },
  // Pitch Management Section
  pitchManagement: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  pitchCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pitchCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 15, 25, 0.85)',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pitchCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
  },
  pitchCardSubtitle: {
    fontSize: 11,
    color: '#7a8a9a',
    marginTop: 4,
  },
  // Alerts
  alertsContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertDanger: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  alertWarning: {
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  alertInfo: {
    backgroundColor: 'rgba(74, 111, 165, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#4a6fa5',
  },
  alertSuccess: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  alertIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e8f4f8',
  },
  alertMessage: {
    fontSize: 11,
    color: '#a0aab4',
    marginTop: 4,
  },
  // Pitch Scheduler Modal
  schedulerModal: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  schedulerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 111, 165, 0.2)',
    backgroundColor: 'rgba(12, 15, 25, 0.95)',
  },
  schedulerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#e8f4f8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navArrow: {
    fontSize: 24,
    color: '#f39c12',
    padding: 10,
  },
  monthName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e8f4f8',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  weekDayLabel: {
    width: (width - 20) / 7,
    textAlign: 'center',
    fontSize: 11,
    color: '#7a8a9a',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  emptyDay: {
    width: (width - 20) / 7,
    height: 50,
  },
  calendarDay: {
    width: (width - 20) / 7,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pitchingDay: {
    backgroundColor: 'rgba(231, 76, 60, 0.25)',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  todayDay: {
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    borderWidth: 2,
    borderColor: '#f39c12',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#e8f4f8',
  },
  pitchingDayText: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  pastDayText: {
    color: '#4a5568',
  },
  pitchIcon: {
    fontSize: 10,
    marginTop: 2,
  },
  schedulerLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    paddingVertical: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#7a8a9a',
  },
  schedulerInfo: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.2)',
  },
  schedulerInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  schedulerInfoText: {
    fontSize: 13,
    color: '#a0aab4',
    lineHeight: 22,
  },
  // Phase Header with Start Date
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  phaseInfo: {
    flex: 1,
    marginRight: 10,
  },
  startDateButton: {
    flexShrink: 0,
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.4)',
  },
  startDateLabel: {
    fontSize: 9,
    color: '#7a8a9a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  startDateValue: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  startDateEdit: {
    fontSize: 10,
    marginTop: 2,
  },
  startDateInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  startDateInfoText: {
    color: '#f39c12',
    fontSize: 13,
    textAlign: 'center',
  },
  selectedStartDate: {
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  selectedStartDateText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Exercise Row and Info Button
  exerciseRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 6,
  },
  exerciseItemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.2)',
  },
  infoButtonStandalone: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(74, 111, 165, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonEmoji: {
    fontSize: 20,
  },
  exercisePointsSmall: {
    fontSize: 11,
    color: '#f39c12',
    marginTop: 2,
  },
  // Exercise Detail Modal
  exerciseDetailModal: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  exerciseDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 111, 165, 0.2)',
    backgroundColor: 'rgba(12, 15, 25, 0.95)',
  },
  exerciseDetailTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#e8f4f8',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },
  exerciseDetailContent: {
    flex: 1,
    padding: 20,
  },
  exercisePointsBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.4)',
  },
  exercisePointsText: {
    color: '#f39c12',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.2)',
  },
  exerciseMetaItem: {
    alignItems: 'center',
  },
  exerciseMetaLabel: {
    fontSize: 10,
    color: '#7a8a9a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseMetaValue: {
    fontSize: 18,
    color: '#e8f4f8',
    fontWeight: 'bold',
    marginTop: 4,
  },
  exerciseSection: {
    marginBottom: 20,
  },
  exerciseSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseSectionText: {
    fontSize: 14,
    color: '#a0aab4',
    lineHeight: 22,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e74c3c',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#a0aab4',
    lineHeight: 22,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  videoButtonIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  videoButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  completeExerciseButton: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  completedExerciseButton: {
    backgroundColor: '#2ecc71',
  },
  completeExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  // Daily points on calendar
  dayPoints: {
    fontSize: 8,
    color: '#f39c12',
    fontWeight: 'bold',
    marginTop: 2,
  },
  // Workout Summary Modal
  summaryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: 'rgba(15, 15, 25, 0.95)',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: width - 60,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 15,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#7a8a9a',
    marginTop: 5,
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 111, 165, 0.15)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.3)',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: '#7a8a9a',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(74, 111, 165, 0.3)',
  },
  summaryTotal: {
    marginTop: 20,
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 11,
    color: '#7a8a9a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryTotalNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  summaryButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 25,
  },
  summaryButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Day Detail Modal
  dayDetailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDetailCard: {
    backgroundColor: '#12151f',
    borderRadius: 16,
    padding: 25,
    width: width - 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 111, 165, 0.3)',
  },
  dayDetailDate: {
    fontSize: 18,
    fontWeight: '900',
    color: '#e8f4f8',
    letterSpacing: 1,
  },
  dayDetailToday: {
    fontSize: 10,
    color: '#f39c12',
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dayDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
  },
  dayDetailStatItem: {
    alignItems: 'center',
  },
  dayDetailStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  dayDetailStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  dayDetailWorkout: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
  },
  dayDetailWorkoutLabel: {
    fontSize: 11,
    color: '#888',
  },
  dayDetailWorkoutName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  dayDetailPitchBadge: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 15,
  },
  dayDetailPitchText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  dayDetailActions: {
    width: '100%',
    gap: 10,
  },
  dayDetailButton: {
    backgroundColor: '#ffd700',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  dayDetailButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayDetailPitchButton: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.5)',
  },
  dayDetailPitchButtonActive: {
    backgroundColor: '#ff6b6b',
  },
  dayDetailPitchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dayDetailClose: {
    marginTop: 15,
    padding: 10,
  },
  dayDetailCloseText: {
    color: '#888',
    fontSize: 14,
  },
  // Settings Modal Styles
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settingsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  settingsScroll: {
    flexGrow: 0,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    marginLeft: 12,
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingsItemValue: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingsItemArrow: {
    fontSize: 22,
    color: '#888',
    fontWeight: '300',
  },
  settingsResetBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  settingsDangerItem: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderColor: 'rgba(231, 76, 60, 0.3)',
    marginTop: 10,
  },
  settingsDangerIcon: {
    fontSize: 20,
  },
  settingsAboutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingsDangerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e74c3c',
  },
  settingsDangerValue: {
    fontSize: 12,
    color: '#e74c3c',
    opacity: 0.7,
    marginTop: 2,
  },
  settingsDangerBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  settingsCloseBtn: {
    backgroundColor: '#f39c12',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  settingsCloseBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
