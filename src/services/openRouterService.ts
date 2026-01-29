// OpenRouter API Service
// Handles LLM calls for generating training and nutrition plans
// API key is embedded - calls are made AFTER user purchase is confirmed

import {
  GeneratedTrainingPlan,
  GeneratedNutritionPlan,
  LLMResponse,
} from '../types';

// ============================================
// CONFIGURATION
// ============================================

// IMPORTANT: In production, this should be fetched from a secure backend
// or stored in environment variables via expo-constants
// For now, you'll replace this placeholder with your actual key
const CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-3.5-sonnet', // Best balance of quality and cost (~$0.003/1K tokens)
  maxTokens: 4096,
  // Replace with your actual OpenRouter API key
  // In production, fetch this from your backend after purchase verification
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY',
};

// ============================================
// SYSTEM PROMPTS
// ============================================

const TRAINING_SYSTEM_PROMPT = `You are an expert sports performance coach and certified strength & conditioning specialist (CSCS). Your role is to create scientifically-sound, periodized training programs tailored to individual athletes.

EXPERTISE AREAS:
- Exercise physiology and biomechanics
- Sport-specific movement patterns and energy systems
- Progressive overload and periodization principles
- Injury prevention and movement quality
- Age-appropriate training for youth athletes
- Multi-sport athlete development

CRITICAL AGE-APPROPRIATE GUIDELINES:
⚠️ YOUTH ATHLETE SAFETY IS PARAMOUNT ⚠️

MIDDLE SCHOOL (Ages 11-14):
- NEVER prescribe heavy maximal lifts (1-3 rep maxes)
- Focus on bodyweight exercises, movement patterns, and coordination
- Emphasize proper form over weight/intensity
- Max weight should be 50-60% of estimated 1RM with higher reps (12-15)
- Include lots of agility, speed, and coordination drills
- Keep sessions shorter (30-45 min) with more variety
- Prioritize fun and engagement to build lifelong training habits
- No Olympic lifts - use medicine balls and bodyweight power exercises
- Focus on landing mechanics and deceleration before jumping

HIGH SCHOOL (Ages 14-18):
- Freshman/Sophomore: Similar to middle school with gradual progression
- Junior/Senior: Can begin more structured strength training
- Still prioritize technique - never sacrifice form for weight
- Max intensity 70-80% 1RM for experienced high schoolers
- Include sport-specific conditioning appropriate to their sports
- Address growth-related issues (growth plates, flexibility changes)
- Monitor for overuse injuries common in this age group

MULTI-SPORT ATHLETE CONSIDERATIONS:
- Design training that complements ALL sports they play
- Avoid overtraining movement patterns used across sports
- Build general athletic qualities that transfer to all sports
- Consider sport seasons and competition schedules
- Include exercises that prevent common injuries across their sports

INJURY MODIFICATIONS:
When injuries are reported, the program MUST:
- Completely avoid exercises that stress the injured area
- Include appropriate rehabilitation exercises
- Provide alternative exercises that maintain fitness
- Note that medical clearance may be required
- Progress cautiously with any returning movements

PROGRAM REQUIREMENTS:
1. Create a phased program (Foundation → Development → Power → Peak)
2. Each phase should have specific, measurable goals
3. Include warmup protocols for every session
4. Balance push/pull, anterior/posterior movements
5. Progress intensity and volume appropriately for AGE and EXPERIENCE
6. Include recovery protocols
7. Consider equipment limitations
8. Address any injuries with modifications throughout

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "id": "generated-plan-[timestamp]",
  "createdAt": "[ISO date string]",
  "sports": ["sport1", "sport2"],
  "positions": ["position1", "position2"],
  "ageGroup": "[middle-school|high-school|college|adult]",
  "level": "[user's level]",
  "goals": ["primary goal", "secondary goal if any"],
  "injuryNotes": "[summary of how plan addresses any injuries]",
  "durationWeeks": [number],
  "phases": [
    {
      "id": [phase number],
      "name": "[phase name]",
      "startWeek": [number],
      "endWeek": [number],
      "goals": ["goal 1", "goal 2"],
      "notes": ["note 1", "note 2"],
      "weeklySchedule": [
        { "dayOfWeek": 0, "workoutType": "OFF" },
        { "dayOfWeek": 1, "workoutType": "[type]", "workoutId": "[id]" },
        ...
      ]
    }
  ],
  "workouts": {
    "[workout-id]": {
      "id": "[workout-id]",
      "name": "[workout name]",
      "type": "[strength|speed|recovery|rest|cardio|sport-specific]",
      "duration": [minutes],
      "points": [10-60 based on difficulty],
      "phase": [phase number],
      "exercises": [
        {
          "id": "[unique-id]",
          "name": "[exercise name]",
          "sets": [number],
          "reps": "[reps or duration]",
          "category": "[warmup|strength|jumps|agility|core|armcare|power|throwing|cardio|flexibility]",
          "equipment": "[optional]",
          "description": "[brief description]",
          "instructions": ["step 1", "step 2"],
          "points": [2-10 based on difficulty],
          "ageModification": "[optional - note if exercise is modified for age]",
          "injuryNote": "[optional - note if this is an alternative due to injury]"
        }
      ]
    }
  }
}

SAFETY GUIDELINES:
- ALWAYS respect age-appropriate training principles
- Never prescribe exercises beyond athlete's experience level
- Include proper warm-up and cool-down
- For youth athletes, emphasize technique over load ALWAYS
- Flag any injuries that require professional clearance
- Keep reps and sets appropriate for age AND experience level
- When in doubt, choose the safer/easier option`;

const NUTRITION_SYSTEM_PROMPT = `You are a registered sports dietitian specializing in athletic performance nutrition with extensive experience working with youth athletes. Create practical, sustainable meal plans that support training goals while being appropriate for the athlete's age.

EXPERTISE AREAS:
- Macronutrient timing for performance
- Hydration strategies for athletes
- Pre/post workout nutrition
- Recovery nutrition
- Meal prep strategies for busy athletes and families
- Youth athlete nutrition and development

CRITICAL AGE-APPROPRIATE NUTRITION GUIDELINES:
⚠️ YOUTH ATHLETE NUTRITION IS DIFFERENT FROM ADULT ATHLETES ⚠️

MIDDLE SCHOOL (Ages 11-14):
- Growing bodies need MORE calories than calculators suggest
- NEVER recommend caloric restriction or "cutting" - growing bodies NEED fuel
- Focus on ADDING nutritious foods, not restricting
- Protein needs: 0.5-0.7g per lb (not the 1g/lb used for adults)
- Emphasize calcium, vitamin D, iron for bone/muscle development
- Include brain-healthy foods for academic performance
- Make meals FUN and appealing - not rigid or restrictive
- Consider school lunch options and after-school snacks
- Hydration is critical - they often forget to drink water
- NO supplements recommended - whole foods only
- Parents/guardians are typically preparing meals

HIGH SCHOOL (Ages 14-18):
- Still growing - caloric restriction only for specific medical needs
- Protein needs: 0.6-0.8g per lb bodyweight
- Address common deficiencies: iron (especially females), calcium, vitamin D
- Consider that they may be preparing some meals themselves
- Account for school schedules, practice times, late-night homework
- Emphasize healthy relationship with food
- No extreme diets or "clean eating" rigidity
- Energy drink warnings - recommend healthier caffeine alternatives if any

MULTI-SPORT ATHLETES:
- Higher caloric needs due to multiple training demands
- Extra emphasis on recovery nutrition between practices/games
- Consider varying demands (e.g., endurance vs power sports)
- Strategic nutrition for tournament/competition days

NUTRITION PRINCIPLES:
1. Calculate appropriate calories based on AGE, activity level, AND growth needs
2. Optimize protein timing around training (age-appropriate amounts)
3. Fuel training with adequate carbohydrates - essential for growing athletes
4. Include micronutrient-dense whole foods
5. Account for all dietary restrictions
6. Keep the plan REALISTIC for student-athletes with busy schedules

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "id": "nutrition-plan-[timestamp]",
  "createdAt": "[ISO date string]",
  "ageGroup": "[middle-school|high-school|college|adult]",
  "ageSpecificNotes": "[important notes about nutrition for this age group]",
  "dailyTargets": {
    "calories": [number],
    "protein": [grams],
    "carbs": [grams],
    "fat": [grams],
    "water": [liters]
  },
  "mealTemplates": [
    {
      "id": "[unique-id]",
      "name": "[meal name]",
      "mealType": "[breakfast|lunch|dinner|snack|pre-workout|post-workout]",
      "calories": [number],
      "protein": [grams],
      "carbs": [grams],
      "fat": [grams],
      "ingredients": ["ingredient 1", "ingredient 2"],
      "prepTime": [minutes],
      "isQuick": [true|false],
      "kidFriendly": [true|false],
      "canPackForSchool": [true|false]
    }
  ],
  "preworkoutGuidelines": "[timing and food suggestions - age appropriate]",
  "postworkoutGuidelines": "[recovery nutrition advice - age appropriate]",
  "hydrationGuidelines": "[specific hydration advice for age/activity]",
  "restrictions": ["restriction 1", "restriction 2"],
  "parentNotes": "[tips for parents helping young athletes with nutrition]"
}

CRITICAL RULES:
- NEVER suggest caloric restriction for middle/high school athletes
- Focus on ADDING good nutrition, not restricting food
- Keep meals simple, affordable, and realistic for athletes/families
- Include options that work with school schedules
- Make food approachable and enjoyable - not stressful`;

// ============================================
// API SERVICE CLASS
// ============================================

class OpenRouterService {
  private model: string = CONFIG.model;

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return CONFIG.apiKey !== 'YOUR_OPENROUTER_API_KEY' && CONFIG.apiKey.length > 0;
  }

  /**
   * Set a custom model (optional)
   */
  setModel(model: string) {
    this.model = model;
  }

  /**
   * Make a request to OpenRouter API
   * This should only be called AFTER purchase is verified
   */
  private async makeRequest(systemPrompt: string, userPrompt: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter API key not configured. Please contact support.');
    }

    const response = await fetch(CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'HTTP-Referer': 'https://themountainapp.com',
        'X-Title': 'The Mountain Training App',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: CONFIG.maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Generate a training plan
   * Call this ONLY after purchase is confirmed via App Store
   */
  async generateTrainingPlan(userInputs: { [key: string]: any }): Promise<LLMResponse> {
    try {
      const userPrompt = this.buildTrainingPrompt(userInputs);
      const response = await this.makeRequest(TRAINING_SYSTEM_PROMPT, userPrompt);

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Parse the JSON response
      const plan = JSON.parse(content) as GeneratedTrainingPlan;
      plan.userInputs = userInputs;

      return {
        success: true,
        data: plan,
        tokensUsed: response.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error('Training plan generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate training plan',
      };
    }
  }

  /**
   * Generate a nutrition plan
   * Call this ONLY after purchase is confirmed via App Store
   */
  async generateNutritionPlan(userInputs: { [key: string]: any }): Promise<LLMResponse> {
    try {
      const userPrompt = this.buildNutritionPrompt(userInputs);
      const response = await this.makeRequest(NUTRITION_SYSTEM_PROMPT, userPrompt);

      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Parse the JSON response
      const plan = JSON.parse(content) as GeneratedNutritionPlan;
      plan.userInputs = userInputs;

      return {
        success: true,
        data: plan,
        tokensUsed: response.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error('Nutrition plan generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate nutrition plan',
      };
    }
  }

  private buildTrainingPrompt(inputs: { [key: string]: any }): string {
    const equipment = Array.isArray(inputs.equipment)
      ? inputs.equipment.join(', ')
      : inputs.equipment || 'bodyweight only';

    // Handle injuries - this is CRITICAL for safety
    const injuriesArray = Array.isArray(inputs.injuries)
      ? inputs.injuries.filter((i: string) => i !== 'none')
      : [];
    const hasInjuries = injuriesArray.length > 0;
    const injuries = hasInjuries ? injuriesArray.join(', ') : 'none reported';

    // Handle multi-sport (can be string or array)
    const sportsArray = Array.isArray(inputs.sport) ? inputs.sport : [inputs.sport];
    const sports = sportsArray.join(', ');
    const isMultiSport = sportsArray.length > 1;

    // Handle multi-position (can be string or array)
    const positionsArray = Array.isArray(inputs.position) ? inputs.position : [inputs.position];
    const positions = positionsArray.join(', ');
    const isMultiPosition = positionsArray.length > 1;

    // Determine age group and create age-specific instructions
    const level = inputs.level || 'recreational';
    const ageGroup = this.determineAgeGroup(level);
    const ageInstructions = this.getAgeSpecificInstructions(ageGroup);

    return `Create a personalized training program for the following athlete:

⚠️ CRITICAL: AGE GROUP - ${ageGroup.toUpperCase()} ⚠️
${ageInstructions}

ATHLETE PROFILE:
- Age Group: ${ageGroup}
- Sports: ${sports}${isMultiSport ? ' (MULTI-SPORT ATHLETE - design training to complement ALL sports)' : ''}
- Positions: ${positions}${isMultiPosition ? ' (plays multiple positions - include position-specific work for each)' : ''}
- Competition Level: ${level}
- Training Experience: ${inputs.experience}

${hasInjuries ? `
⚠️ INJURY ALERT - CRITICAL ⚠️
The athlete has reported the following injuries/limitations: ${injuries}
YOU MUST:
1. AVOID all exercises that could aggravate these injuries
2. Include alternative exercises that work around the injuries
3. Add appropriate rehabilitation/prehab exercises
4. Note in the plan how each workout accommodates these injuries
` : ''}

GOALS:
- Primary Goal: ${inputs['primary-goal']}
- Secondary Goal: ${inputs['secondary-goal'] || 'none'}

CONSTRAINTS:
- Available Training Days: ${inputs['days-per-week']} days per week
- Time Per Session: ${inputs['time-per-session']} minutes
- Available Equipment: ${equipment}
- Current Season: ${inputs.season}

PROGRAM LENGTH: ${inputs.duration} weeks

Create a comprehensive, periodized training program that:
1. Is 100% APPROPRIATE for a ${ageGroup} athlete (this is non-negotiable)
2. Builds progressively through ${inputs.duration} weeks at an age-appropriate pace
3. Includes detailed exercises with sets, reps, and instructions suitable for ${ageGroup}
${isMultiSport ? `4. Develops athletic qualities that transfer to ALL their sports: ${sports}
5. Avoids overtraining movement patterns common across their sports` : `4. Is specific to ${sports} and the demands of playing ${positions}`}
${hasInjuries ? `6. Completely works around their injuries: ${injuries}
7. Includes rehabilitation exercises where appropriate` : ''}
8. Accounts for their equipment and time constraints
9. Prioritizes their primary goal while supporting their secondary goal
10. Includes proper warm-ups and recovery protocols appropriate for ${ageGroup}

Remember to output ONLY valid JSON with no additional text.`;
  }

  private determineAgeGroup(level: string): string {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('middle school') || levelLower.includes('middle-school') || levelLower.includes('youth') || levelLower.includes('12u') || levelLower.includes('14u')) {
      return 'middle-school';
    }
    if (levelLower.includes('high school') || levelLower.includes('high-school') || levelLower.includes('jv') || levelLower.includes('varsity') || levelLower.includes('16u') || levelLower.includes('18u')) {
      return 'high-school';
    }
    if (levelLower.includes('college') || levelLower.includes('collegiate') || levelLower.includes('university')) {
      return 'college';
    }
    if (levelLower.includes('pro') || levelLower.includes('professional') || levelLower.includes('adult') || levelLower.includes('recreational')) {
      return 'adult';
    }
    // Default to high school if unclear (safer for youth)
    return 'high-school';
  }

  private getAgeSpecificInstructions(ageGroup: string): string {
    switch (ageGroup) {
      case 'middle-school':
        return `THIS IS A MIDDLE SCHOOL ATHLETE (ages 11-14). YOU MUST:
- Use ONLY bodyweight exercises, light resistance bands, and medicine balls
- NO heavy barbell work, NO maximal lifts, NO Olympic lifts
- Focus on movement quality, coordination, and FUN
- Keep reps in the 10-15 range with light/no weight
- Sessions should be 30-45 minutes max
- Include lots of variety and game-like activities
- Emphasize proper form with every exercise
- Build a foundation for future training - don't push for performance now`;

      case 'high-school':
        return `THIS IS A HIGH SCHOOL ATHLETE (ages 14-18). YOU MUST:
- Progress gradually based on their experience level
- For freshmen/sophomores: similar to middle school with gradual progression
- For juniors/seniors with experience: can include structured strength training
- Never exceed 70-80% intensity for any lift
- Always prioritize technique over weight
- Include injury prevention exercises
- Be mindful of growth plate considerations
- No extreme training methods`;

      case 'college':
        return `This is a COLLEGE ATHLETE. You can include:
- Full periodized strength training
- Olympic lift variations if appropriate for sport
- Higher intensities (up to 85-90% for experienced athletes)
- Sport-specific conditioning at competitive intensities`;

      default:
        return `This is an ADULT athlete. Design training appropriate for their experience level and goals.`;
    }
  }

  private buildNutritionPrompt(inputs: { [key: string]: any }): string {
    const restrictions = Array.isArray(inputs.restrictions)
      ? inputs.restrictions.filter((r: string) => r !== 'none').join(', ')
      : 'none';

    // Handle multi-sport (can be string or array)
    const sportsArray = Array.isArray(inputs.sport) ? inputs.sport : (inputs.sport ? [inputs.sport] : ['general athletics']);
    const sports = sportsArray.join(', ');
    const isMultiSport = sportsArray.length > 1;

    // Get season phase
    const season = inputs.season || 'in-season';
    const seasonDescriptions: { [key: string]: string } = {
      'off-season': 'Off-Season (focus on building base, can be in caloric surplus for muscle building)',
      'pre-season': 'Pre-Season (ramping up training, need fuel for increased demands)',
      'in-season': 'In-Season (competition phase, focus on performance and recovery)',
      'post-season': 'Post-Season (recovery phase, rebuilding and preparing for next cycle)',
    };

    // Determine age group from level or age input
    const level = inputs.level || '';
    let ageGroup = this.determineAgeGroup(level);

    // If we have actual age, use it to refine age group
    const age = parseInt(inputs.age) || 0;
    if (age > 0) {
      if (age <= 14) ageGroup = 'middle-school';
      else if (age <= 18) ageGroup = 'high-school';
      else if (age <= 22) ageGroup = 'college';
      else ageGroup = 'adult';
    }

    const ageNutritionGuidelines = this.getAgeSpecificNutritionGuidelines(ageGroup, inputs['nutrition-goal']);

    // Map the new goal IDs to descriptions
    const goalDescriptions: { [key: string]: string } = {
      'build-muscle': 'Build Muscle & Strength - caloric surplus with adequate protein',
      'fuel-performance': 'Fuel Performance - optimal energy for training and competition',
      'improve-body-comp': 'Improve Body Composition - focus on nutrient quality and timing',
      'support-recovery': 'Support Recovery - anti-inflammatory foods and recovery nutrition',
      'eat-healthier': 'Eat Healthier Overall - balanced whole food nutrition',
      // Legacy mappings
      'lose-fat': 'Improve Body Composition - focus on nutrient quality (NOT caloric restriction)',
      'maintain': 'Maintain current weight with quality nutrition',
      'performance': 'Fuel Performance - optimal energy for training',
    };

    const goalDescription = goalDescriptions[inputs['nutrition-goal']] || inputs['nutrition-goal'];

    return `Create a personalized nutrition plan for the following athlete:

⚠️ CRITICAL: AGE GROUP - ${ageGroup.toUpperCase()} ⚠️
${ageNutritionGuidelines}

ATHLETE PROFILE:
- Age Group: ${ageGroup}${age > 0 ? ` (${age} years old)` : ''}
- Competition Level: ${level}
- Weight: ${inputs.weight} lbs
- Height: ${inputs.height} inches
- Sports: ${sports}${isMultiSport ? ' (MULTI-SPORT ATHLETE - higher caloric needs!)' : ''}
- Current Season Phase: ${seasonDescriptions[season] || season}
- Activity Level: High (athlete in training)

NUTRITION GOAL: ${goalDescription}
${ageGroup === 'middle-school' || ageGroup === 'high-school' ? `
⚠️ YOUTH ATHLETE NUTRITION RULES - NON-NEGOTIABLE:
- NEVER recommend caloric restriction for growing athletes
- Focus on ADDING nutritious foods, not restricting
- "Improve body composition" means BETTER FOOD CHOICES, not eating less
- Growing bodies NEED adequate calories - err on the side of MORE food
- No talk of "cutting," "dieting," or "weight loss" for youth athletes
` : `
- If building muscle: caloric surplus with high protein
- If improving body composition: focus on food quality and timing, moderate approach
- If fueling performance: focus on carbs and timing
`}

SEASON-SPECIFIC NUTRITION NEEDS:
- Current Phase: ${season}
${season === 'off-season' ? '- Can focus on muscle building with caloric surplus\n- More flexibility with meal timing\n- Good time to establish healthy eating habits' : ''}
${season === 'pre-season' ? '- Gradually increase calories as training ramps up\n- Focus on energy availability\n- Begin dialing in competition nutrition strategies' : ''}
${season === 'in-season' ? '- Priority is PERFORMANCE and RECOVERY\n- Game day nutrition is critical\n- Quick recovery between competitions\n- Consistent energy throughout the week' : ''}
${season === 'post-season' ? '- Focus on recovery and rebuilding\n- Can be slightly more relaxed with timing\n- Address any nutritional deficits from the season' : ''}

DIETARY RESTRICTIONS: ${restrictions}

MEAL PREFERENCES:
- Meals per day: ${inputs['meals-per-day']}
- Cooking time available: ${inputs['cooking-time']}

Create a comprehensive nutrition plan that:
1. Is 100% APPROPRIATE for a ${ageGroup} athlete (this is non-negotiable)
2. Accounts for their ${season} training demands
3. Calculates macros that support GROWTH and performance for ${ageGroup}
4. Provides ${inputs['meals-per-day']} meal templates that are realistic for a ${ageGroup} student-athlete
5. Includes age-appropriate pre and post workout nutrition guidelines
6. Respects all dietary restrictions: ${restrictions}
7. Keeps meals realistic for ${inputs['cooking-time']} prep time
8. Includes meals that can be packed for school/practice
${isMultiSport ? `9. Accounts for higher caloric needs of a multi-sport athlete training in ${sports}` : ''}
${ageGroup === 'middle-school' || ageGroup === 'high-school' ? `10. Includes guidance for parents/guardians helping with meal prep
11. Makes food approachable and enjoyable - not stressful or restrictive
12. NEVER mentions weight loss, cutting, or caloric restriction` : ''}

Remember to output ONLY valid JSON with no additional text.`;
  }

  private getAgeSpecificNutritionGuidelines(ageGroup: string, goal: string): string {
    switch (ageGroup) {
      case 'middle-school':
        return `THIS IS A MIDDLE SCHOOL ATHLETE (ages 11-14). YOU MUST:
- NEVER recommend caloric restriction - growing bodies need fuel
- Focus on adding nutritious foods, not restricting any foods
- Calculate calories HIGHER than standard calculators (add 300-500 for growth)
- Protein: 0.5-0.7g per lb bodyweight (NOT the 1g/lb used for adults)
- Include calcium-rich foods for bone development
- Include iron-rich foods (especially for female athletes)
- Keep meals simple and kid-friendly
- Include options that work with school schedules
- NO supplements - whole foods only
- Make nutrition fun and positive, not stressful`;

      case 'high-school':
        return `THIS IS A HIGH SCHOOL ATHLETE (ages 14-18). YOU MUST:
- Be very cautious about any caloric restriction
- If goal is fat loss, focus on food quality not quantity restriction
- Protein: 0.6-0.8g per lb bodyweight
- Still prioritize growth and development over body composition
- Address common deficiencies (iron, calcium, vitamin D)
- Include quick breakfast options for early practices
- Include portable snacks for between classes/practice
- Limit recommendations for caffeine (natural sources only if any)
- NO diet pills or fat burners - ever
- Emphasize healthy relationship with food`;

      case 'college':
        return `This is a COLLEGE ATHLETE. You can include:
- Standard athletic nutrition protocols
- Protein at 0.8-1g per lb bodyweight
- Meal timing strategies for performance
- Appropriate supplement considerations if asked`;

      default:
        return `This is an ADULT athlete. Design nutrition appropriate for their goals.
- Protein at 0.7-1g per lb bodyweight for active individuals
- Standard macronutrient calculations based on goals
- Appropriate meal timing for their schedule`;
    }
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
export default openRouterService;
