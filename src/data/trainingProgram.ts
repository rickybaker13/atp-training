// JoBoo Training Program Data
// 14-week program from Jan 23 - Early May
// Adjusted for basketball season through end of April

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8" or "6/side" or "20 sec"
  notes?: string;
  category: 'warmup' | 'strength' | 'jumps' | 'agility' | 'core' | 'armcare' | 'power' | 'throwing';
  equipment?: string;
  description?: string; // Short description of the exercise
  instructions?: string[]; // Step-by-step instructions
  videoUrl?: string; // Link to demonstration video
  imageUrl?: string; // Link to image/illustration
  points?: number; // Points for completing this exercise (default: workout.points / exercises.length)
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'speed' | 'recovery' | 'basketball' | 'throwing' | 'rest';
  duration: number; // minutes
  exercises: Exercise[];
  points: number;
  phase: number;
}

export interface Phase {
  id: number;
  name: string;
  startWeek: number;
  endWeek: number;
  goals: string[];
  notes: string[];
  weeklySchedule: DayPlan[];
}

export interface DayPlan {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  workoutType: string;
  workoutId?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'phase' | 'streak';
  requirement: number; // workouts completed, days, etc.
  points: number;
  icon: string;
}

// Warm-up exercises (used in every session)
export const warmupExercises: Exercise[] = [
  {
    id: 'wu1',
    name: 'Jog → Skip → Backpedal',
    sets: 1,
    reps: '2 min',
    category: 'warmup',
    description: 'Progressive warm-up to raise body temperature',
    instructions: ['Start with light jog for 30 sec', 'Transition to skipping for 30 sec', 'Finish with backpedal for 30 sec', 'Repeat once'],
    videoUrl: 'https://www.youtube.com/results?search_query=jog+skip+backpedal+warmup',
    points: 2
  },
  {
    id: 'wu2',
    name: 'High Knees',
    sets: 1,
    reps: '20',
    category: 'warmup',
    description: 'Drive knees up to hip level while pumping arms',
    instructions: ['Stand tall with feet hip-width apart', 'Drive one knee up toward chest', 'Alternate quickly, pumping arms', 'Stay on balls of feet'],
    videoUrl: 'https://www.youtube.com/watch?v=oDdkytliOqE',
    points: 2
  },
  {
    id: 'wu3',
    name: 'Butt Kicks',
    sets: 1,
    reps: '20',
    category: 'warmup',
    description: 'Kick heels up toward glutes to warm up hamstrings',
    instructions: ['Stand tall and start jogging in place', 'Kick heels back toward your butt', 'Keep thighs relatively still', 'Pump arms naturally'],
    videoUrl: 'https://www.youtube.com/watch?v=Vz_iqk8k2JI',
    points: 2
  },
  {
    id: 'wu4',
    name: 'Carioca / Grapevine',
    sets: 1,
    reps: '2 passes',
    category: 'warmup',
    description: 'Lateral movement with hip rotation for agility',
    instructions: ['Move sideways crossing feet over and behind', 'Rotate hips with each crossover', 'Keep shoulders square', 'Go both directions'],
    videoUrl: 'https://www.youtube.com/watch?v=NLb-RPMhGvc',
    points: 2
  },
  {
    id: 'wu5',
    name: 'Arm Circles (small → big)',
    sets: 1,
    reps: '10 each',
    category: 'warmup',
    description: 'Progressively larger circles to warm up shoulders',
    instructions: ['Extend arms out to sides', 'Start with small circles forward', 'Gradually increase size', 'Reverse direction'],
    videoUrl: 'https://www.youtube.com/watch?v=140RTrMjPxk',
    points: 2
  },
  {
    id: 'wu6',
    name: 'Hip Circles',
    sets: 1,
    reps: '10 each',
    category: 'warmup',
    description: 'Open up hip joints with controlled circles',
    instructions: ['Stand on one leg (hold wall if needed)', 'Lift knee to hip height', 'Make large circles with knee', 'Go both directions, both legs'],
    videoUrl: 'https://www.youtube.com/watch?v=7Wm0PoWGfSU',
    points: 2
  },
  {
    id: 'wu7',
    name: "World's Greatest Stretch",
    sets: 1,
    reps: '5/side',
    category: 'warmup',
    description: 'Full-body mobility stretch targeting hips, thoracic spine, and hamstrings',
    instructions: ['Step into deep lunge', 'Place same-side elbow to inside of front foot', 'Rotate chest and reach arm to sky', 'Hold 2-3 sec, switch sides'],
    videoUrl: 'https://www.youtube.com/watch?v=wBvnSFWpJlQ',
    points: 3
  },
  {
    id: 'wu8',
    name: 'Glute Bridges',
    sets: 1,
    reps: '15',
    category: 'warmup',
    description: 'Activate glutes before lower body work',
    instructions: ['Lie on back, knees bent, feet flat', 'Drive through heels to lift hips', 'Squeeze glutes at top', 'Lower with control'],
    videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',
    points: 3
  },
  {
    id: 'wu9',
    name: 'Dead Bugs',
    sets: 1,
    reps: '8/side',
    category: 'warmup',
    description: 'Core activation with opposite arm/leg extension',
    instructions: ['Lie on back, arms up, knees at 90°', 'Press lower back into floor', 'Extend opposite arm and leg', 'Return and switch sides'],
    videoUrl: 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
    points: 3
  },
  {
    id: 'wu10',
    name: 'Band Pull-Aparts',
    sets: 1,
    reps: '15',
    category: 'warmup',
    equipment: 'resistance band',
    description: 'Activate upper back and rear shoulders',
    instructions: ['Hold band at chest height, arms extended', 'Pull band apart by squeezing shoulder blades', 'Keep arms straight', 'Control return'],
    videoUrl: 'https://www.youtube.com/watch?v=JObYtU7Y7ag',
    points: 3
  },
];

// Arm care exercises (3-4x per week, mandatory)
export const armCareExercises: Exercise[] = [
  {
    id: 'ac1',
    name: 'External Rotations (elbow at side)',
    sets: 1,
    reps: '12',
    category: 'armcare',
    equipment: 'light band',
    description: 'Strengthen rotator cuff for throwing arm health',
    instructions: ['Anchor band at elbow height', 'Keep elbow pinned to side at 90°', 'Rotate forearm outward against band', 'Control the return slowly'],
    videoUrl: 'https://www.youtube.com/watch?v=lPZ2S_Rec5c',
    points: 5
  },
  {
    id: 'ac2',
    name: 'External Rotations (90° arm)',
    sets: 1,
    reps: '10',
    category: 'armcare',
    equipment: 'light band',
    description: 'Rotator cuff strengthening in throwing position',
    instructions: ['Anchor band at shoulder height', 'Raise elbow to shoulder height, bent 90°', 'Rotate forearm up keeping elbow still', 'Control the return'],
    videoUrl: 'https://www.youtube.com/watch?v=er-Xpc2x0UQ',
    points: 5
  },
  {
    id: 'ac3',
    name: 'Band Y-T-W Raises',
    sets: 1,
    reps: '8 each',
    category: 'armcare',
    equipment: 'light band',
    description: 'Target all parts of shoulder stabilizers',
    instructions: ['Hold band anchored low or step on it', 'Y: Arms overhead in V shape', 'T: Arms out to sides', 'W: Elbows bent, squeeze shoulder blades'],
    videoUrl: 'https://www.youtube.com/watch?v=yoC_5rDFBTo',
    points: 5
  },
  {
    id: 'ac4',
    name: 'Scap Push-ups',
    sets: 1,
    reps: '12',
    category: 'armcare',
    description: 'Strengthen serratus anterior for scapular stability',
    instructions: ['Start in push-up position, arms straight', 'Without bending elbows, let chest sink', 'Push through hands to round upper back', 'Feel shoulder blades spread apart'],
    videoUrl: 'https://www.youtube.com/watch?v=ALzFr2GT-Is',
    points: 5
  },
  {
    id: 'ac5',
    name: 'Wrist Flexion/Extension',
    sets: 1,
    reps: '12',
    category: 'armcare',
    equipment: 'light dumbbell',
    description: 'Strengthen forearm muscles for wrist stability',
    instructions: ['Rest forearm on thigh, wrist over knee', 'Hold light weight (2-5 lbs)', 'Curl wrist up (flexion) for 12 reps', 'Flip hand over and extend wrist for 12 reps'],
    videoUrl: 'https://www.youtube.com/watch?v=FW07z9kY2ds',
    points: 5
  },
];

// Core exercises
export const coreExercises: Exercise[] = [
  { id: 'co1', name: 'Pallof Press', sets: 3, reps: '10', category: 'core', equipment: 'band' },
  { id: 'co2', name: 'Side Plank', sets: 3, reps: '20-30 sec', category: 'core' },
  { id: 'co3', name: 'Dead Bugs', sets: 3, reps: '8/side', category: 'core' },
  { id: 'co4', name: 'Bird Dogs', sets: 3, reps: '8/side', category: 'core' },
];

// PHASE 1 WORKOUTS (Weeks 1-4: Foundation)
export const phase1StrengthWorkout: Workout = {
  id: 'p1-strength',
  name: 'Strength + Jumps',
  type: 'strength',
  duration: 60,
  phase: 1,
  points: 50,
  exercises: [
    ...warmupExercises,
    { id: 'p1s1', name: 'Goblet Squat', sets: 3, reps: '8', category: 'strength', equipment: 'light dumbbell' },
    { id: 'p1s2', name: 'Reverse Lunges', sets: 3, reps: '6/leg', category: 'strength' },
    { id: 'p1s3', name: 'Push-ups', sets: 3, reps: '10', category: 'strength' },
    { id: 'p1s4', name: 'Single-Arm DB Row', sets: 3, reps: '8', category: 'strength', equipment: 'dumbbell' },
    { id: 'p1s5', name: 'Hip Hinge (KB Deadlift)', sets: 3, reps: '8', category: 'strength', equipment: 'kettlebell' },
    { id: 'p1j1', name: 'Pogos (Ankle Hops)', sets: 2, reps: '20', category: 'jumps' },
    { id: 'p1j2', name: 'Box Jumps (low)', sets: 3, reps: '4', category: 'jumps', equipment: 'low box', notes: 'Perfect landing!' },
    ...armCareExercises,
  ]
};

export const phase1SpeedWorkout: Workout = {
  id: 'p1-speed',
  name: 'Speed/Agility + Core',
  type: 'speed',
  duration: 50,
  phase: 1,
  points: 45,
  exercises: [
    ...warmupExercises,
    { id: 'p1a1', name: 'Ladder Drills', sets: 1, reps: '2 patterns', category: 'agility', equipment: 'agility ladder' },
    { id: 'p1a2', name: 'Lateral Shuffle → Sprint', sets: 4, reps: '5-10 yds', category: 'agility' },
    { id: 'p1a3', name: 'Reaction Drill', sets: 3, reps: '5 reps', category: 'agility', notes: 'Coach cue or ball drop' },
    ...coreExercises.slice(0, 2),
    ...armCareExercises,
  ]
};

// PHASE 2 WORKOUTS (Weeks 5-8: Strength & Jump Development)
export const phase2StrengthWorkout: Workout = {
  id: 'p2-strength',
  name: 'Strength + Jumps',
  type: 'strength',
  duration: 60,
  phase: 2,
  points: 55,
  exercises: [
    ...warmupExercises,
    { id: 'p2s1', name: 'DB Front Squat', sets: 4, reps: '6', category: 'strength', equipment: 'dumbbells' },
    { id: 'p2s2', name: 'Step-ups', sets: 3, reps: '6/leg', category: 'strength', equipment: 'knee-height box' },
    { id: 'p2s3', name: 'KB Deadlift / RDL', sets: 3, reps: '8', category: 'strength', equipment: 'kettlebell' },
    { id: 'p2s4', name: 'Incline DB Bench', sets: 3, reps: '8', category: 'strength', equipment: 'dumbbells, bench' },
    { id: 'p2s5', name: 'Chin-ups', sets: 3, reps: '5', category: 'strength', notes: 'Use assist if needed' },
    { id: 'p2s6', name: 'Single-Arm Row', sets: 3, reps: '8', category: 'strength', equipment: 'dumbbell' },
    { id: 'p2j1', name: 'Pogos', sets: 2, reps: '20', category: 'jumps' },
    { id: 'p2j2', name: 'Box Jumps (moderate)', sets: 3, reps: '4', category: 'jumps', equipment: 'box' },
    { id: 'p2j3', name: 'Broad Jumps', sets: 3, reps: '3', category: 'jumps' },
    ...coreExercises.slice(0, 3),
    ...armCareExercises,
  ]
};

export const phase2SpeedWorkout: Workout = {
  id: 'p2-speed',
  name: 'Speed/Agility',
  type: 'speed',
  duration: 50,
  phase: 2,
  points: 50,
  exercises: [
    ...warmupExercises,
    { id: 'p2a1', name: 'First-Step Sprints', sets: 6, reps: '10 yds', category: 'agility' },
    { id: 'p2a2', name: 'Lateral Bounds (low vol)', sets: 3, reps: '6/side', category: 'agility' },
    { id: 'p2a3', name: 'Infield Shuffle → Throw Footwork', sets: 4, reps: '5 reps', category: 'agility' },
    { id: 'p2a4', name: 'Reaction Drills', sets: 3, reps: '5 reps', category: 'agility' },
    ...coreExercises.slice(0, 2),
    ...armCareExercises,
  ]
};

// PHASE 3 WORKOUTS (Weeks 9-12: Power → Baseball Transfer)
export const phase3StrengthWorkout: Workout = {
  id: 'p3-strength',
  name: 'Power Strength',
  type: 'strength',
  duration: 55,
  phase: 3,
  points: 55,
  exercises: [
    ...warmupExercises,
    { id: 'p3s1', name: 'Squat Variation', sets: 3, reps: '5', category: 'strength', equipment: 'dumbbells' },
    { id: 'p3s2', name: 'Reverse Lunges', sets: 3, reps: '5/leg', category: 'strength' },
    { id: 'p3s3', name: 'Push-ups or DB Bench', sets: 3, reps: '8', category: 'strength' },
    { id: 'p3s4', name: 'Rows', sets: 3, reps: '8', category: 'strength', equipment: 'dumbbell' },
    { id: 'p3p1', name: 'Med Ball Scoop Toss', sets: 3, reps: '5/side', category: 'power', equipment: '4-6 lb med ball' },
    { id: 'p3p2', name: 'Med Ball Shot Put', sets: 3, reps: '5/side', category: 'power', equipment: '4-6 lb med ball' },
    { id: 'p3j1', name: 'Broad Jumps', sets: 3, reps: '3', category: 'jumps' },
    ...coreExercises.slice(0, 2),
    ...armCareExercises,
  ]
};

export const phase3SpeedWorkout: Workout = {
  id: 'p3-speed',
  name: 'Baseball Speed',
  type: 'speed',
  duration: 45,
  phase: 3,
  points: 50,
  exercises: [
    ...warmupExercises,
    { id: 'p3a1', name: 'First-Step Acceleration', sets: 6, reps: '5-10 yds', category: 'agility' },
    { id: 'p3a2', name: 'Lateral Shuffle → Throw Footwork', sets: 4, reps: '5 reps', category: 'agility' },
    { id: 'p3a3', name: 'Reaction Drills', sets: 4, reps: '5 reps', category: 'agility' },
    { id: 'p3a4', name: 'Short Sprint Decelerations', sets: 4, reps: '15 yds', category: 'agility' },
    ...armCareExercises,
  ]
};

// PHASE 4 WORKOUTS (Weeks 13-14: Preseason Peak)
export const phase4StrengthWorkout: Workout = {
  id: 'p4-strength',
  name: 'Maintenance Strength',
  type: 'strength',
  duration: 40,
  phase: 4,
  points: 45,
  exercises: [
    ...warmupExercises,
    { id: 'p4s1', name: 'Squat', sets: 2, reps: '4', category: 'strength', equipment: 'dumbbells' },
    { id: 'p4s2', name: 'Lunges', sets: 2, reps: '4', category: 'strength' },
    { id: 'p4s3', name: 'Push-ups', sets: 2, reps: '10', category: 'strength' },
    { id: 'p4s4', name: 'Rows', sets: 2, reps: '8', category: 'strength', equipment: 'dumbbell' },
    ...coreExercises.slice(0, 2),
    ...armCareExercises,
  ]
};

// BUSY DAY WORKOUTS (30 min)
export const busyDayStrength: Workout = {
  id: 'busy-strength',
  name: '30-Min Strength Circuit',
  type: 'strength',
  duration: 30,
  phase: 0, // any phase
  points: 35,
  exercises: [
    { id: 'bs1', name: 'Quick Warm-up', sets: 1, reps: '5 min', category: 'warmup' },
    { id: 'bs2', name: 'Goblet Squat', sets: 3, reps: '8', category: 'strength', equipment: 'dumbbell' },
    { id: 'bs3', name: 'Push-ups', sets: 3, reps: '10', category: 'strength' },
    { id: 'bs4', name: 'Single-Arm Row', sets: 3, reps: '8/side', category: 'strength', equipment: 'dumbbell' },
    { id: 'bs5', name: 'Dead Bugs', sets: 3, reps: '6/side', category: 'core' },
    ...armCareExercises,
  ]
};

export const busyDaySpeed: Workout = {
  id: 'busy-speed',
  name: '30-Min Speed Session',
  type: 'speed',
  duration: 30,
  phase: 0,
  points: 35,
  exercises: [
    { id: 'ba1', name: 'Quick Warm-up', sets: 1, reps: '5 min', category: 'warmup' },
    { id: 'ba2', name: 'Ladder Drills', sets: 1, reps: '2 patterns', category: 'agility', equipment: 'ladder' },
    { id: 'ba3', name: 'Lateral Shuffle → Sprint', sets: 6, reps: '10 yds', category: 'agility' },
    { id: 'ba4', name: 'Broad Jumps', sets: 3, reps: '3', category: 'jumps' },
    { id: 'ba5', name: 'Pallof Press', sets: 2, reps: '10', category: 'core', equipment: 'band' },
    ...armCareExercises,
  ]
};

export const busyDayRecovery: Workout = {
  id: 'busy-recovery',
  name: 'Recovery Session',
  type: 'recovery',
  duration: 25,
  phase: 0,
  points: 25,
  exercises: [
    { id: 'br1', name: 'Light Jog or Bike', sets: 1, reps: '5 min', category: 'warmup' },
    { id: 'br2', name: 'Foam Roll Legs', sets: 1, reps: '5 min', category: 'warmup', equipment: 'foam roller' },
    { id: 'br3', name: "World's Greatest Stretch", sets: 1, reps: '5/side', category: 'warmup' },
    { id: 'br4', name: 'Hip 90/90 Stretch', sets: 1, reps: '30 sec/side', category: 'warmup' },
    ...armCareExercises,
  ]
};

// THROWING WORKOUT (Arm Care + Light Throwing)
export const throwingWorkout: Workout = {
  id: 'throwing',
  name: 'Throwing + Arm Care',
  type: 'throwing',
  duration: 35,
  phase: 0,
  points: 40,
  exercises: [
    ...warmupExercises.slice(0, 5),
    {
      id: 'th1',
      name: 'Band Shoulder Warm-up',
      sets: 1,
      reps: '10 each direction',
      category: 'throwing',
      equipment: 'light band',
      description: 'Get blood flowing to shoulder before throwing',
      instructions: ['Circle shoulders with band', 'Pull-aparts', 'Internal/external rotations'],
      points: 5
    },
    {
      id: 'th2',
      name: 'Wrist Flicks',
      sets: 2,
      reps: '15',
      category: 'throwing',
      description: 'Activate wrist snap for throwing',
      instructions: ['Partner 10 ft away (or wall)', 'Flick ball using only wrist', 'Focus on backspin', 'Keep elbow still'],
      videoUrl: 'https://www.youtube.com/watch?v=Ap3HEygSCNQ',
      points: 5
    },
    {
      id: 'th3',
      name: 'One-Knee Throws',
      sets: 2,
      reps: '10',
      category: 'throwing',
      description: 'Build arm path without lower body',
      instructions: ['Kneel on throwing-side knee', 'Partner 30-40 ft away', 'Focus on high elbow and follow through', 'Throw at 50-60% effort'],
      videoUrl: 'https://www.youtube.com/watch?v=W3gKdWXb-wU',
      points: 10
    },
    {
      id: 'th4',
      name: 'Standing Throws',
      sets: 2,
      reps: '15',
      category: 'throwing',
      description: 'Full throwing motion at controlled intensity',
      instructions: ['Start at 45 ft, work back to 60 ft', 'Focus on mechanics over velocity', 'Step toward target', 'Follow through completely'],
      videoUrl: 'https://www.youtube.com/watch?v=YmHs6PCbXrE',
      points: 10
    },
    {
      id: 'th5',
      name: 'Long Toss (optional)',
      sets: 1,
      reps: '10-15 throws',
      category: 'throwing',
      description: 'Build arm strength with distance',
      instructions: ['Only if arm feels good', 'Work back to 90-120 ft max', 'Arc is okay', 'Stop if any discomfort'],
      notes: 'Skip if arm is tired',
      videoUrl: 'https://www.youtube.com/watch?v=FJ_P9l7zrEo',
      points: 10
    },
    ...armCareExercises,
  ]
};

// BASKETBALL + ARM CARE (for dual-sport days)
export const basketballArmCare: Workout = {
  id: 'basketball-armcare',
  name: 'Basketball + Arm Care',
  type: 'basketball',
  duration: 30,
  phase: 0,
  points: 30,
  exercises: [
    {
      id: 'bb1',
      name: 'Basketball Practice/Game',
      sets: 1,
      reps: '60-90 min',
      category: 'agility',
      description: 'Full basketball activity - counts as conditioning!',
      instructions: ['Go hard in practice', 'This is your cardio for the day', 'Stay hydrated'],
      points: 10
    },
    ...armCareExercises,
    {
      id: 'bb2',
      name: 'Post-Practice Stretch',
      sets: 1,
      reps: '5 min',
      category: 'warmup',
      description: 'Cool down after basketball',
      instructions: ['Quad stretch 30 sec each', 'Hamstring stretch 30 sec each', 'Shoulder stretch 30 sec each', 'Deep breaths'],
      points: 5
    }
  ]
};

// LIGHT STRENGTH (for basketball + light strength days)
export const lightStrength: Workout = {
  id: 'light-strength',
  name: 'Light Strength + Arm Care',
  type: 'strength',
  duration: 25,
  phase: 0,
  points: 30,
  exercises: [
    { id: 'ls1', name: 'Quick Warm-up', sets: 1, reps: '3 min', category: 'warmup', points: 2 },
    { id: 'ls2', name: 'Goblet Squat', sets: 2, reps: '8', category: 'strength', equipment: 'light dumbbell', points: 5 },
    { id: 'ls3', name: 'Push-ups', sets: 2, reps: '10', category: 'strength', points: 5 },
    { id: 'ls4', name: 'Plank', sets: 2, reps: '30 sec', category: 'core', points: 3 },
    ...armCareExercises,
  ]
};

// REST DAY
export const restDay: Workout = {
  id: 'rest',
  name: 'Rest Day',
  type: 'rest',
  duration: 0,
  phase: 0,
  points: 10, // Small reward for taking rest
  exercises: []
};

// PHASES (adjusted for basketball through end of April)
export const phases: Phase[] = [
  {
    id: 1,
    name: 'Foundation & Movement',
    startWeek: 1,
    endWeek: 4,
    goals: [
      'Learn lifting + landing mechanics',
      'Build joint/tendon strength',
      'Maintain basketball performance',
      'Establish arm care habits'
    ],
    notes: [
      'Light loads - technique first',
      'Leave 2-3 reps in reserve',
      'No mound work yet',
      'Basketball is priority'
    ],
    weeklySchedule: [
      { dayOfWeek: 0, workoutType: 'OFF' },
      { dayOfWeek: 1, workoutType: 'Strength + Jumps', workoutId: 'p1-strength' },
      { dayOfWeek: 2, workoutType: 'Basketball + Arm Care', workoutId: 'basketball-armcare' },
      { dayOfWeek: 3, workoutType: 'Speed/Agility + Core', workoutId: 'p1-speed' },
      { dayOfWeek: 4, workoutType: 'Basketball + Light Strength', workoutId: 'light-strength' },
      { dayOfWeek: 5, workoutType: 'Strength + Arm Care', workoutId: 'p1-strength' },
      { dayOfWeek: 6, workoutType: 'Optional Recovery', workoutId: 'busy-recovery' },
    ]
  },
  {
    id: 2,
    name: 'Strength & Jump Development',
    startWeek: 5,
    endWeek: 8,
    goals: [
      'Increase lower-body strength',
      'Improve vertical jump',
      'Add controlled rotational power',
      'Begin structured throwing (light)'
    ],
    notes: [
      'Basketball is winding down',
      'Slightly higher intensity',
      'Focus on explosive movements',
      'Arm care remains mandatory'
    ],
    weeklySchedule: [
      { dayOfWeek: 0, workoutType: 'OFF' },
      { dayOfWeek: 1, workoutType: 'Strength + Jumps', workoutId: 'p2-strength' },
      { dayOfWeek: 2, workoutType: 'Speed + Arm Care', workoutId: 'p2-speed' },
      { dayOfWeek: 3, workoutType: 'Strength + Core', workoutId: 'p2-strength' },
      { dayOfWeek: 4, workoutType: 'Speed/Agility', workoutId: 'p2-speed' },
      { dayOfWeek: 5, workoutType: 'Light Strength + Arm Care', workoutId: 'light-strength' },
      { dayOfWeek: 6, workoutType: 'Throwing + Recovery', workoutId: 'throwing' },
    ]
  },
  {
    id: 3,
    name: 'Power → Baseball Transfer',
    startWeek: 9,
    endWeek: 12,
    goals: [
      'Convert strength to speed',
      'Increase bat speed & first step',
      'Gradually increase throwing intensity',
      'Stay fresh, no burnout'
    ],
    notes: [
      'Slightly faster lifts',
      'Slightly fewer reps',
      'More sport-specific movements',
      'Light mound work if cleared'
    ],
    weeklySchedule: [
      { dayOfWeek: 0, workoutType: 'OFF' },
      { dayOfWeek: 1, workoutType: 'Power Strength', workoutId: 'p3-strength' },
      { dayOfWeek: 2, workoutType: 'Speed + Arm Care', workoutId: 'p3-speed' },
      { dayOfWeek: 3, workoutType: 'Throwing + Light Strength', workoutId: 'throwing' },
      { dayOfWeek: 4, workoutType: 'Baseball Speed', workoutId: 'p3-speed' },
      { dayOfWeek: 5, workoutType: 'Power Strength', workoutId: 'p3-strength' },
      { dayOfWeek: 6, workoutType: 'Recovery', workoutId: 'busy-recovery' },
    ]
  },
  {
    id: 4,
    name: 'Preseason Baseball Peak',
    startWeek: 13,
    endWeek: 14,
    goals: [
      'Feel explosive',
      'Stay healthy',
      'No soreness entering season',
      'Peak performance'
    ],
    notes: [
      'Volume drops 40-50%',
      'Keep intensity moderate',
      'No leg failure',
      'Throwing is priority'
    ],
    weeklySchedule: [
      { dayOfWeek: 0, workoutType: 'OFF' },
      { dayOfWeek: 1, workoutType: 'Maintenance Strength', workoutId: 'p4-strength' },
      { dayOfWeek: 2, workoutType: 'Throwing + Arm Care', workoutId: 'throwing' },
      { dayOfWeek: 3, workoutType: 'Light Speed', workoutId: 'busy-speed' },
      { dayOfWeek: 4, workoutType: 'Throwing + Light Strength', workoutId: 'throwing' },
      { dayOfWeek: 5, workoutType: 'Recovery + Arm Care', workoutId: 'busy-recovery' },
      { dayOfWeek: 6, workoutType: 'Optional Recovery', workoutId: 'busy-recovery' },
    ]
  }
];

// MILESTONES
export const milestones: Milestone[] = [
  // Daily milestones
  { id: 'daily-1', name: 'First Step', description: 'Complete your first workout', type: 'daily', requirement: 1, points: 25, icon: '🏃' },
  { id: 'daily-armcare', name: 'Arm Guardian', description: 'Complete arm care today', type: 'daily', requirement: 1, points: 15, icon: '💪' },

  // Streak milestones
  { id: 'streak-3', name: '3-Day Warrior', description: 'Complete 3 days in a row', type: 'streak', requirement: 3, points: 50, icon: '🔥' },
  { id: 'streak-7', name: 'Week Champion', description: 'Complete 7 days in a row', type: 'streak', requirement: 7, points: 100, icon: '⚡' },
  { id: 'streak-14', name: 'Two Week Beast', description: '14-day streak', type: 'streak', requirement: 14, points: 200, icon: '🏆' },
  { id: 'streak-30', name: 'Monthly Legend', description: '30-day streak', type: 'streak', requirement: 30, points: 500, icon: '👑' },

  // Weekly milestones
  { id: 'week-full', name: 'Perfect Week', description: 'Complete all planned workouts in a week', type: 'weekly', requirement: 1, points: 75, icon: '⭐' },
  { id: 'week-4x', name: 'Consistent Athlete', description: 'Complete 4+ workouts this week', type: 'weekly', requirement: 4, points: 50, icon: '📈' },

  // Phase milestones
  { id: 'phase-1-complete', name: 'Foundation Built', description: 'Complete Phase 1', type: 'phase', requirement: 1, points: 200, icon: '🧱' },
  { id: 'phase-2-complete', name: 'Strength Unlocked', description: 'Complete Phase 2', type: 'phase', requirement: 2, points: 250, icon: '🦾' },
  { id: 'phase-3-complete', name: 'Power Activated', description: 'Complete Phase 3', type: 'phase', requirement: 3, points: 300, icon: '⚡' },
  { id: 'phase-4-complete', name: 'Game Ready', description: 'Complete the program!', type: 'phase', requirement: 4, points: 500, icon: '🏆' },

  // Total workout milestones
  { id: 'total-10', name: 'Getting Started', description: 'Complete 10 total workouts', type: 'daily', requirement: 10, points: 100, icon: '🌟' },
  { id: 'total-25', name: 'Quarter Century', description: 'Complete 25 total workouts', type: 'daily', requirement: 25, points: 200, icon: '💫' },
  { id: 'total-50', name: 'Half Century', description: 'Complete 50 total workouts', type: 'daily', requirement: 50, points: 400, icon: '🎯' },
];

// Pitch count rules (Age 13)
export const pitchCountRules = {
  maxPerGame: 75,
  maxPerWeek: 95,
  restDays: [
    { pitches: '1-20', days: 1 },
    { pitches: '21-35', days: 2 },
    { pitches: '36-50', days: 3 },
    { pitches: '51-65', days: 4 },
    { pitches: '66+', days: 5 },
  ],
  warnings: [
    'No pitching & heavy jumps same day',
    'No pitching day after max basketball game',
    'No heavy legs on mound days',
  ]
};

// Get workout by ID
export function getWorkoutById(id: string): Workout | undefined {
  const allWorkouts = [
    phase1StrengthWorkout, phase1SpeedWorkout,
    phase2StrengthWorkout, phase2SpeedWorkout,
    phase3StrengthWorkout, phase3SpeedWorkout,
    phase4StrengthWorkout,
    busyDayStrength, busyDaySpeed, busyDayRecovery,
    throwingWorkout, basketballArmCare, lightStrength,
    restDay
  ];
  return allWorkouts.find(w => w.id === id);
}

// Get current phase based on date
export function getCurrentPhase(startDate: Date, currentDate: Date = new Date()): Phase {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor((currentDate.getTime() - startDate.getTime()) / msPerWeek) + 1;

  // If program hasn't started yet (start date in future), return Phase 1
  if (weekNumber < 1) {
    return phases[0];
  }

  for (const phase of phases) {
    if (weekNumber >= phase.startWeek && weekNumber <= phase.endWeek) {
      return phase;
    }
  }
  return phases[phases.length - 1]; // Return last phase if beyond program
}

// Export all workouts for easy access
export const allWorkouts = {
  phase1: { strength: phase1StrengthWorkout, speed: phase1SpeedWorkout },
  phase2: { strength: phase2StrengthWorkout, speed: phase2SpeedWorkout },
  phase3: { strength: phase3StrengthWorkout, speed: phase3SpeedWorkout },
  phase4: { strength: phase4StrengthWorkout },
  busyDay: { strength: busyDayStrength, speed: busyDaySpeed, recovery: busyDayRecovery },
  rest: restDay
};
