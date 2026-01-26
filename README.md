# JoBoo - Ollie's Training App 🏋️⚾🏀

A personalized athletic training app for a 13-year-old dual-sport athlete focused on baseball and basketball.

## Features

- **📅 Weekly Calendar** - See your training schedule at a glance
- **🎯 Phase-Based Training** - 14-week program from foundation to peak performance
- **🔥 Streak Tracking** - Build and maintain workout streaks
- **⭐ Points System** - Earn points for completed workouts (50 pts per full workout)
- **🏆 Milestones** - Unlock achievements daily, weekly, and at phase completion
- **📱 Notifications** - Daily workout reminders at 4 PM
- **⚡ Busy Day Options** - 30-minute workouts when time is tight
- **⚾ Pitch Count Rules** - Built-in arm safety guidelines

## Training Phases

1. **Phase 1 (Weeks 1-4)**: Foundation & Movement
2. **Phase 2 (Weeks 5-8)**: Strength & Jump Development
3. **Phase 3 (Weeks 9-12)**: Power → Baseball Transfer
4. **Phase 4 (Weeks 13-14)**: Preseason Baseball Peak

## Quick Start - Run on iPhone

### Option 1: Expo Go (Fastest - For Testing)

1. **On your computer:**
   ```bash
   cd joboo-app
   npm install
   npx expo start
   ```

2. **On Ollie's iPhone:**
   - Download "Expo Go" from the App Store
   - Scan the QR code shown in your terminal
   - The app loads instantly!

### Option 2: Build for TestFlight (For Family/Team)

1. Create an Expo account at https://expo.dev
2. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   eas login
   ```

3. Build for iOS:
   ```bash
   eas build --platform ios
   ```

4. Submit to TestFlight:
   ```bash
   eas submit --platform ios
   ```

5. Invite Ollie and teammates via TestFlight

## Project Structure

```
joboo-app/
├── App.tsx                 # Main app component
├── src/
│   ├── data/
│   │   └── trainingProgram.ts  # All workouts, exercises, phases
│   ├── components/         # UI components (to expand)
│   ├── screens/           # Screen components (to expand)
│   ├── hooks/             # Custom hooks (to expand)
│   └── utils/             # Helper functions (to expand)
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── README.md
```

## Gamification System

### Points
- Full Strength Workout: 45-55 pts
- Speed/Agility Workout: 45-50 pts
- 30-Min Busy Day: 35 pts
- Recovery Session: 25 pts
- Rest Day: 10 pts

### Milestones
- 🏃 First Step: Complete first workout (+25 pts)
- 🔥 3-Day Warrior: 3-day streak (+50 pts)
- ⚡ Week Champion: 7-day streak (+100 pts)
- 🏆 Two Week Beast: 14-day streak (+200 pts)
- 👑 Monthly Legend: 30-day streak (+500 pts)
- ⭐ Perfect Week: All weekly workouts (+75 pts)
- 🧱 Foundation Built: Complete Phase 1 (+200 pts)
- 🦾 Strength Unlocked: Complete Phase 2 (+250 pts)
- ⚡ Power Activated: Complete Phase 3 (+300 pts)
- 🏆 Game Ready: Complete program (+500 pts)

## Future Features (Team Version)

- [ ] User authentication
- [ ] Team creation & friend codes
- [ ] Leaderboards (weekly/all-time)
- [ ] Teammate activity feed
- [ ] Coach dashboard
- [ ] Custom workout builder
- [ ] Video exercise guides
- [ ] Progress photos
- [ ] Performance metrics tracking

## Pitch Count Safety

Built-in rules for age 13:
- Max 75 pitches/game
- Max 95 pitches/week
- Rest requirements based on pitch count
- No pitching + heavy jumps same day

## Customization

To adjust the program start date, edit `PROGRAM_START_DATE` in `App.tsx`:
```typescript
const PROGRAM_START_DATE = new Date('2025-01-23');
```

## Tech Stack

- React Native / Expo
- TypeScript
- AsyncStorage (local data persistence)
- Expo Notifications
- Expo Linear Gradient

---

Built with 💪 for Ollie's athletic development
