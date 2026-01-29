// Coach Bot Question Configuration
// Defines the conversation flow for gathering user information

import { CoachQuestion, CoachOption } from '../types';

// ============================================
// SPORT-SPECIFIC POSITION OPTIONS
// ============================================

const sportPositions: { [sport: string]: CoachOption[] } = {
  baseball: [
    { id: 'pitcher', label: 'Pitcher', icon: '⚾' },
    { id: 'catcher', label: 'Catcher', icon: '🧤' },
    { id: 'infielder', label: 'Infielder', icon: '🏃' },
    { id: 'outfielder', label: 'Outfielder', icon: '🌿' },
    { id: 'utility', label: 'Utility Player', icon: '🔄' },
  ],
  football: [
    { id: 'quarterback', label: 'Quarterback', icon: '🏈' },
    { id: 'running-back', label: 'Running Back', icon: '💨' },
    { id: 'wide-receiver', label: 'Wide Receiver', icon: '🎯' },
    { id: 'tight-end', label: 'Tight End', icon: '💪' },
    { id: 'offensive-line', label: 'Offensive Line', icon: '🛡️' },
    { id: 'defensive-line', label: 'Defensive Line', icon: '🔥' },
    { id: 'linebacker', label: 'Linebacker', icon: '⚡' },
    { id: 'defensive-back', label: 'Defensive Back', icon: '🦅' },
    { id: 'kicker-punter', label: 'Kicker/Punter', icon: '🦶' },
  ],
  basketball: [
    { id: 'point-guard', label: 'Point Guard', icon: '🎮' },
    { id: 'shooting-guard', label: 'Shooting Guard', icon: '🎯' },
    { id: 'small-forward', label: 'Small Forward', icon: '🏃' },
    { id: 'power-forward', label: 'Power Forward', icon: '💪' },
    { id: 'center', label: 'Center', icon: '🗼' },
  ],
  soccer: [
    { id: 'goalkeeper', label: 'Goalkeeper', icon: '🧤' },
    { id: 'defender', label: 'Defender', icon: '🛡️' },
    { id: 'midfielder', label: 'Midfielder', icon: '🔄' },
    { id: 'forward', label: 'Forward/Striker', icon: '⚡' },
  ],
  hockey: [
    { id: 'goalie', label: 'Goalie', icon: '🧤' },
    { id: 'defenseman', label: 'Defenseman', icon: '🛡️' },
    { id: 'center', label: 'Center', icon: '🔄' },
    { id: 'winger', label: 'Winger', icon: '⚡' },
  ],
  lacrosse: [
    { id: 'goalie', label: 'Goalie', icon: '🧤' },
    { id: 'defender', label: 'Defender', icon: '🛡️' },
    { id: 'midfielder', label: 'Midfielder', icon: '🔄' },
    { id: 'attackman', label: 'Attackman', icon: '⚡' },
  ],
  volleyball: [
    { id: 'setter', label: 'Setter', icon: '🎮' },
    { id: 'outside-hitter', label: 'Outside Hitter', icon: '💪' },
    { id: 'middle-blocker', label: 'Middle Blocker', icon: '🗼' },
    { id: 'opposite', label: 'Opposite', icon: '⚡' },
    { id: 'libero', label: 'Libero', icon: '🛡️' },
  ],
  tennis: [
    { id: 'singles', label: 'Singles Player', icon: '🎾' },
    { id: 'doubles', label: 'Doubles Specialist', icon: '👥' },
    { id: 'all-court', label: 'All-Court Player', icon: '🔄' },
  ],
  swimming: [
    { id: 'freestyle', label: 'Freestyle/Sprint', icon: '💨' },
    { id: 'backstroke', label: 'Backstroke', icon: '🔙' },
    { id: 'breaststroke', label: 'Breaststroke', icon: '🐸' },
    { id: 'butterfly', label: 'Butterfly', icon: '🦋' },
    { id: 'im', label: 'Individual Medley', icon: '🔄' },
    { id: 'distance', label: 'Distance', icon: '🏊' },
  ],
  track: [
    { id: 'sprinter', label: 'Sprinter', icon: '💨' },
    { id: 'distance', label: 'Distance Runner', icon: '🏃' },
    { id: 'jumper', label: 'Jumper', icon: '🦘' },
    { id: 'thrower', label: 'Thrower', icon: '💪' },
    { id: 'hurdler', label: 'Hurdler', icon: '🚧' },
    { id: 'multi-event', label: 'Multi-Event', icon: '🔄' },
  ],
  wrestling: [
    { id: 'lightweight', label: 'Lightweight', icon: '🪶' },
    { id: 'middleweight', label: 'Middleweight', icon: '⚖️' },
    { id: 'heavyweight', label: 'Heavyweight', icon: '💪' },
  ],
  golf: [
    { id: 'general', label: 'General Player', icon: '⛳' },
  ],
  crossfit: [
    { id: 'general', label: 'CrossFit Athlete', icon: '🏋️' },
  ],
  mma: [
    { id: 'striker', label: 'Striker', icon: '👊' },
    { id: 'grappler', label: 'Grappler', icon: '🤼' },
    { id: 'well-rounded', label: 'Well-Rounded', icon: '🔄' },
  ],
  other: [
    { id: 'general', label: 'General Athlete', icon: '🏆' },
  ],
};

// Get positions for a single sport or multiple sports
// When multiple sports are selected, combines all unique positions
export const getPositionsForSport = (sports: string | string[]): CoachOption[] => {
  // Handle single sport (string) or multiple sports (array)
  const sportArray = Array.isArray(sports) ? sports : [sports];

  if (sportArray.length === 0) {
    return sportPositions.other;
  }

  if (sportArray.length === 1) {
    return sportPositions[sportArray[0].toLowerCase()] || sportPositions.other;
  }

  // For multiple sports, combine all positions and remove duplicates
  const positionsMap = new Map<string, CoachOption>();

  sportArray.forEach(sport => {
    const positions = sportPositions[sport.toLowerCase()] || [];
    positions.forEach(pos => {
      if (!positionsMap.has(pos.id)) {
        positionsMap.set(pos.id, pos);
      }
    });
  });

  // Add a general athlete option if combining multiple sports
  if (!positionsMap.has('multi-sport')) {
    positionsMap.set('multi-sport', {
      id: 'multi-sport',
      label: 'Multi-Sport Athlete',
      icon: '🏆'
    });
  }

  return Array.from(positionsMap.values());
};

// ============================================
// TRAINING PLAN QUESTIONS
// ============================================

export const trainingQuestions: CoachQuestion[] = [
  {
    id: 'sport',
    question: 'What sports are you training for? (Select up to 2)',
    coachMessage: "Hey champ! I'm Coach, and I'm pumped to build you a training program that'll take your game to the next level. Let's get started! 💪",
    followUpMessage: "Nice! Multi-sport athletes have a real advantage. Let's build something that covers all your sports.",
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { id: 'baseball', label: 'Baseball', icon: '⚾' },
      { id: 'football', label: 'Football', icon: '🏈' },
      { id: 'basketball', label: 'Basketball', icon: '🏀' },
      { id: 'soccer', label: 'Soccer', icon: '⚽' },
      { id: 'hockey', label: 'Hockey', icon: '🏒' },
      { id: 'lacrosse', label: 'Lacrosse', icon: '🥍' },
      { id: 'volleyball', label: 'Volleyball', icon: '🏐' },
      { id: 'tennis', label: 'Tennis', icon: '🎾' },
      { id: 'swimming', label: 'Swimming', icon: '🏊' },
      { id: 'track', label: 'Track & Field', icon: '🏃' },
      { id: 'wrestling', label: 'Wrestling', icon: '🤼' },
      { id: 'golf', label: 'Golf', icon: '⛳' },
      { id: 'crossfit', label: 'CrossFit', icon: '🏋️' },
      { id: 'mma', label: 'MMA/Combat', icon: '🥊' },
      { id: 'other', label: 'Other Sport', icon: '🏆' },
    ],
  },
  {
    id: 'position',
    question: 'What positions do you play? (Select up to 3)',
    coachMessage: "Now, what position(s) are you locking down? This helps me tailor your training to exactly what you need on the field.",
    followUpMessage: "Got it! I'll make sure we train for all the demands of your position(s).",
    type: 'multi-select',
    maxSelections: 3,
    options: [], // Populated dynamically based on sport
  },
  {
    id: 'level',
    question: 'What level are you competing at?',
    coachMessage: "What level are you competing at? This helps me set the right intensity and complexity for your program.",
    followUpMessage: "Got it! I'll make sure the program matches your competitive level.",
    type: 'single-select',
    options: [
      { id: 'recreational', label: 'Recreational', icon: '🎮' },
      { id: 'middle-school', label: 'Middle School', icon: '📚' },
      { id: 'high-school', label: 'High School', icon: '🎓' },
      { id: 'club-travel', label: 'Club/Travel', icon: '✈️' },
      { id: 'college', label: 'College', icon: '🏛️' },
      { id: 'pro', label: 'Professional', icon: '🏆' },
    ],
  },
  {
    id: 'primary-goal',
    question: "What's your #1 training goal?",
    coachMessage: "Alright, let's talk goals. What's the ONE thing you want most from this program? Be honest - this shapes everything.",
    followUpMessage: "{primary-goal} - that's a great focus. We're going to attack it hard!",
    type: 'single-select',
    options: [
      { id: 'get-faster', label: 'Get Faster', icon: '💨' },
      { id: 'get-stronger', label: 'Get Stronger', icon: '💪' },
      { id: 'jump-higher', label: 'Jump Higher', icon: '🚀' },
      { id: 'improve-endurance', label: 'Improve Endurance', icon: '🫁' },
      { id: 'prevent-injuries', label: 'Prevent Injuries', icon: '🛡️' },
      { id: 'sport-skills', label: 'Sport-Specific Skills', icon: '🎯' },
      { id: 'general-fitness', label: 'General Fitness', icon: '⭐' },
    ],
  },
  {
    id: 'secondary-goal',
    question: 'Any secondary focus?',
    coachMessage: "Any secondary goal you want to work on? It's okay if you want to focus on just one thing.",
    followUpMessage: "Perfect, I'll weave that in too.",
    type: 'single-select',
    options: [
      { id: 'none', label: 'Just focus on my main goal', icon: '🎯' },
      { id: 'get-faster', label: 'Get Faster', icon: '💨' },
      { id: 'get-stronger', label: 'Get Stronger', icon: '💪' },
      { id: 'jump-higher', label: 'Jump Higher', icon: '🚀' },
      { id: 'improve-endurance', label: 'Improve Endurance', icon: '🫁' },
      { id: 'prevent-injuries', label: 'Prevent Injuries', icon: '🛡️' },
      { id: 'flexibility', label: 'Flexibility/Mobility', icon: '🧘' },
    ],
  },
  {
    id: 'experience',
    question: 'How long have you been training seriously?',
    coachMessage: "How long have you been training seriously? This helps me know where to start you.",
    followUpMessage: "Got it! I'll make sure we build from the right foundation.",
    type: 'single-select',
    options: [
      { id: 'beginner', label: 'New (0-6 months)', icon: '🌱' },
      { id: 'intermediate', label: 'Some (6 months - 2 years)', icon: '📈' },
      { id: 'advanced', label: 'Experienced (2+ years)', icon: '🔥' },
    ],
  },
  {
    id: 'days-per-week',
    question: 'How many days per week can you train?',
    coachMessage: "Real talk - how many days per week can you ACTUALLY commit to training? Be realistic, consistency beats intensity.",
    followUpMessage: "{days-per-week} days - we can do a lot with that!",
    type: 'single-select',
    options: [
      { id: '3', label: '3 days', icon: '3️⃣' },
      { id: '4', label: '4 days', icon: '4️⃣' },
      { id: '5', label: '5 days', icon: '5️⃣' },
      { id: '6', label: '6 days', icon: '6️⃣' },
    ],
  },
  {
    id: 'time-per-session',
    question: 'How much time per workout?',
    coachMessage: "How much time do you have for each workout? Quality over quantity, but I need to know our window.",
    followUpMessage: "Perfect, I'll design sessions that fit that timeframe.",
    type: 'single-select',
    options: [
      { id: '30', label: '30 minutes', icon: '⏱️' },
      { id: '45', label: '45 minutes', icon: '⏱️' },
      { id: '60', label: '60 minutes', icon: '⏱️' },
      { id: '90', label: '90 minutes', icon: '⏱️' },
    ],
  },
  {
    id: 'equipment',
    question: 'What equipment do you have access to?',
    coachMessage: "What equipment do you have access to? Select all that apply - I'll work with what you've got.",
    type: 'multi-select',
    options: [
      { id: 'bodyweight', label: 'Bodyweight Only', icon: '🏃' },
      { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
      { id: 'barbell', label: 'Barbell & Rack', icon: '🏋️' },
      { id: 'kettlebells', label: 'Kettlebells', icon: '🔔' },
      { id: 'bands', label: 'Resistance Bands', icon: '〰️' },
      { id: 'pullup-bar', label: 'Pull-up Bar', icon: '🔝' },
      { id: 'med-balls', label: 'Medicine Balls', icon: '⚽' },
      { id: 'boxes', label: 'Plyo Boxes', icon: '📦' },
      { id: 'cables', label: 'Cable Machine', icon: '🔌' },
      { id: 'full-gym', label: 'Full Gym Access', icon: '🏢' },
    ],
  },
  {
    id: 'season',
    question: 'What phase of your season are you in?',
    coachMessage: "Where are you in your season? This is crucial for getting the timing right.",
    followUpMessage: "Got it - I'll structure the program to peak at the right time.",
    type: 'single-select',
    options: [
      { id: 'off-season', label: 'Off-Season', icon: '❄️' },
      { id: 'pre-season', label: 'Pre-Season', icon: '🌸' },
      { id: 'in-season', label: 'In-Season', icon: '☀️' },
      { id: 'post-season', label: 'Post-Season', icon: '🍂' },
    ],
  },
  {
    id: 'injuries',
    question: 'Any injuries or limitations I should know about?',
    coachMessage: "Last thing - any injuries or areas I should be careful with? Your safety comes first.",
    type: 'multi-select',
    options: [
      { id: 'none', label: 'No injuries', icon: '✅' },
      { id: 'shoulder', label: 'Shoulder', icon: '🦾' },
      { id: 'elbow', label: 'Elbow/Arm', icon: '💪' },
      { id: 'back', label: 'Back', icon: '🔙' },
      { id: 'knee', label: 'Knee', icon: '🦵' },
      { id: 'ankle', label: 'Ankle/Foot', icon: '🦶' },
      { id: 'hip', label: 'Hip', icon: '🦴' },
      { id: 'other', label: 'Other', icon: '⚠️' },
    ],
  },
  {
    id: 'duration',
    question: 'How long should your program be?',
    coachMessage: "Final question - how long do you want this program to run?",
    followUpMessage: "Perfect! That's everything I need. Let me build your custom program...",
    type: 'single-select',
    options: [
      { id: '8', label: '8 weeks', icon: '📅' },
      { id: '12', label: '12 weeks', icon: '📅' },
      { id: '16', label: '16 weeks', icon: '📅' },
    ],
  },
];

// ============================================
// NUTRITION PLAN QUESTIONS
// ============================================

export const nutritionQuestions: CoachQuestion[] = [
  {
    id: 'age',
    question: 'How old are you?',
    coachMessage: "Let's dial in your nutrition! First, how old are you?",
    type: 'numeric',
    validation: { min: 10, max: 99, required: true },
  },
  {
    id: 'level',
    question: 'What level are you competing at?',
    coachMessage: "What level are you competing at? This helps me tailor nutrition to your training demands.",
    followUpMessage: "Got it! I'll make sure the nutrition plan matches your competitive level.",
    type: 'single-select',
    options: [
      { id: 'middle-school', label: 'Middle School', icon: '📚' },
      { id: 'high-school', label: 'High School', icon: '🎓' },
      { id: 'club-travel', label: 'Club/Travel', icon: '🚐' },
      { id: 'college', label: 'College', icon: '🏛️' },
      { id: 'adult-rec', label: 'Adult/Recreational', icon: '🏃' },
    ],
  },
  {
    id: 'sport',
    question: 'What sports are you training for? (Select up to 2)',
    coachMessage: "What sports are you training for? This helps me calculate your energy needs.",
    followUpMessage: "Great! I'll factor in the energy demands of your sport(s).",
    type: 'multi-select',
    maxSelections: 2,
    options: [
      { id: 'baseball', label: 'Baseball', icon: '⚾' },
      { id: 'football', label: 'Football', icon: '🏈' },
      { id: 'basketball', label: 'Basketball', icon: '🏀' },
      { id: 'soccer', label: 'Soccer', icon: '⚽' },
      { id: 'hockey', label: 'Hockey', icon: '🏒' },
      { id: 'lacrosse', label: 'Lacrosse', icon: '🥍' },
      { id: 'volleyball', label: 'Volleyball', icon: '🏐' },
      { id: 'tennis', label: 'Tennis', icon: '🎾' },
      { id: 'swimming', label: 'Swimming', icon: '🏊' },
      { id: 'track', label: 'Track & Field', icon: '🏃' },
      { id: 'wrestling', label: 'Wrestling', icon: '🤼' },
      { id: 'golf', label: 'Golf', icon: '⛳' },
      { id: 'crossfit', label: 'CrossFit', icon: '🏋️' },
      { id: 'general', label: 'General Fitness', icon: '💪' },
      { id: 'other', label: 'Other Sport', icon: '🏆' },
    ],
  },
  {
    id: 'season',
    question: 'What phase of your season are you in?',
    coachMessage: "Where are you in your season? Your nutrition needs change throughout the year.",
    followUpMessage: "Got it - I'll adjust your nutrition for this phase.",
    type: 'single-select',
    options: [
      { id: 'off-season', label: 'Off-Season', icon: '❄️' },
      { id: 'pre-season', label: 'Pre-Season', icon: '🌸' },
      { id: 'in-season', label: 'In-Season', icon: '☀️' },
      { id: 'post-season', label: 'Post-Season', icon: '🍂' },
    ],
  },
  {
    id: 'weight',
    question: 'What is your current weight?',
    coachMessage: "What's your current weight in pounds?",
    type: 'numeric',
    validation: { min: 50, max: 500, required: true },
  },
  {
    id: 'height',
    question: 'How tall are you?',
    coachMessage: "How tall are you in inches? (5'10\" = 70 inches)",
    type: 'numeric',
    validation: { min: 40, max: 96, required: true },
  },
  {
    id: 'nutrition-goal',
    question: "What's your nutrition goal?",
    coachMessage: "What's your main nutrition goal right now?",
    followUpMessage: "Got it! I'll optimize your plan for {nutrition-goal}.",
    type: 'single-select',
    options: [
      { id: 'build-muscle', label: 'Build Muscle & Strength', icon: '💪' },
      { id: 'fuel-performance', label: 'Fuel Performance', icon: '⚡' },
      { id: 'improve-body-comp', label: 'Improve Body Composition', icon: '🎯' },
      { id: 'support-recovery', label: 'Support Recovery', icon: '🔄' },
      { id: 'eat-healthier', label: 'Eat Healthier Overall', icon: '🥗' },
    ],
  },
  {
    id: 'restrictions',
    question: 'Any dietary restrictions?',
    coachMessage: "Any dietary restrictions I should know about? Select all that apply.",
    type: 'multi-select',
    options: [
      { id: 'none', label: 'No Restrictions', icon: '✅' },
      { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
      { id: 'vegan', label: 'Vegan', icon: '🌱' },
      { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
      { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
      { id: 'nut-allergy', label: 'Nut Allergy', icon: '🥜' },
      { id: 'shellfish', label: 'Shellfish Allergy', icon: '🦐' },
      { id: 'halal', label: 'Halal', icon: '☪️' },
      { id: 'kosher', label: 'Kosher', icon: '✡️' },
    ],
  },
  {
    id: 'meals-per-day',
    question: 'How many meals per day?',
    coachMessage: "How many meals do you typically eat per day (including snacks)?",
    type: 'single-select',
    options: [
      { id: '3', label: '3 meals', icon: '🍽️' },
      { id: '4', label: '4 meals + snacks', icon: '🍽️' },
      { id: '5', label: '5+ meals/snacks', icon: '🍽️' },
    ],
  },
  {
    id: 'cooking-time',
    question: 'How much time for meal prep?',
    coachMessage: "How much time do you (or your parents) have for cooking and meal prep?",
    followUpMessage: "Perfect - I'll make sure the meals fit your lifestyle.",
    type: 'single-select',
    options: [
      { id: 'minimal', label: 'Minimal (quick meals)', icon: '⚡' },
      { id: 'moderate', label: 'Moderate (15-30 min)', icon: '⏱️' },
      { id: 'flexible', label: 'Flexible (enjoy cooking)', icon: '👨‍🍳' },
    ],
  },
];

export default {
  trainingQuestions,
  nutritionQuestions,
  getPositionsForSport,
};
