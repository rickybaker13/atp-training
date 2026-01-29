# ATP: Ascent Training Protocol - App Store Submission Checklist

## ✅ Already Completed
- [x] App built and uploaded to TestFlight
- [x] Bundle ID registered: `com.atp.training`
- [x] App created in App Store Connect (Apple ID: 6758416625)
- [x] Privacy Policy document created (`ATP-Privacy-Policy.docx`)
- [x] Terms of Service document created (`ATP-Terms-of-Service.docx`)
- [x] App Store metadata prepared (`AppStore-Metadata.md`)

---

## 📋 App Store Connect Setup

### 1. App Information (General → App Information)
- [ ] **Name:** ATP: Ascent Training Protocol
- [ ] **Subtitle:** AI-Powered Athletic Training
- [ ] **Primary Language:** English (U.S.)
- [ ] **Category:** Health & Fitness
- [ ] **Secondary Category:** Sports
- [ ] **Content Rights:** Confirm you have rights to all content

### 2. Pricing and Availability
- [ ] **Price:** Free
- [ ] **Availability:** All territories (or select specific ones)

### 3. Privacy Policy (App → App Privacy)
- [ ] **Privacy Policy URL:** Host your privacy policy and enter URL
  - Suggested: `https://atptraining.app/privacy`
  - Alternative: Use a free hosting service like GitHub Pages or Notion

### 4. App Privacy Details (App → App Privacy)
You'll need to answer Apple's privacy questions. For ATP, here's what to select:

**Data Types Collected:**
- [ ] **Contact Info** → Email Address (for account/support)
- [ ] **Identifiers** → User ID (for leaderboards/teams)
- [ ] **Usage Data** → Product Interaction (workout completions, points)

**Data Usage:**
- [ ] Analytics (to improve the app)
- [ ] App Functionality (for core features to work)

**Data Linked to User:** Yes (for leaderboard/team features)
**Data Used for Tracking:** No

### 5. In-App Purchases (Monetization → In-App Purchases)
Create these three products:

| Product | Reference Name | Product ID | Type | Price |
|---------|---------------|------------|------|-------|
| 1 | Custom Training Plan | `com.atp.training.custom_plan` | Non-Consumable | $1.99 |
| 2 | Nutrition Plan | `com.atp.training.nutrition` | Non-Consumable | $1.99 |
| 3 | Plan Regeneration | `com.atp.training.regeneration` | Consumable | $1.99 |

For each IAP, you'll need:
- [ ] Display Name
- [ ] Description
- [ ] Screenshot (capture the purchase screen from TestFlight)
- [ ] Review Notes (explain what it does)

### 6. App Version Details (App Store → iOS App)

#### Screenshots Required
**iPhone 6.9" Display (iPhone 15 Pro Max):** 1320 x 2868 px
- [ ] Screenshot 1: Home screen showing training plan
- [ ] Screenshot 2: CoachBot conversation
- [ ] Screenshot 3: Workout details
- [ ] Screenshot 4: Team/Leaderboard
- [ ] Screenshot 5: Nutrition plan (optional)

**iPhone 6.7" Display (iPhone 15 Plus):** 1290 x 2796 px
- [ ] Same screenshots (can use same images, will auto-scale)

**iPad Pro 13" (if supporting tablets):** 2064 x 2752 px
- [ ] Optional - mark "iPad not supported" if you skip this

#### App Description
- [ ] Copy from `AppStore-Metadata.md`

#### Keywords
- [ ] `training,workout,fitness,athlete,baseball,basketball,football,soccer,AI,coach,nutrition,leaderboard`

#### Promotional Text
- [ ] Copy from `AppStore-Metadata.md`

#### Support URL
- [ ] `https://atptraining.app/support` (or your support email/page)

#### Marketing URL (optional)
- [ ] `https://atptraining.app`

### 7. Build Selection
- [ ] Select your TestFlight build for submission

### 8. App Review Information
- [ ] **Contact Email:** matthew.w.ison@gmail.com
- [ ] **Contact Phone:** Your phone number
- [ ] **Demo Account:** Not needed (app doesn't require login)
- [ ] **Review Notes:** Explain how to test IAP features
  ```
  To test the app:
  1. Open app and view the home screen
  2. Tap "Training Plan" to start the AI coach conversation
  3. Answer the questions about sport, position, goals, etc.
  4. The AI will generate a personalized training plan

  Note: In-app purchases use the sandbox environment for testing.
  ```

### 9. Age Rating Questionnaire
Answer these questions:
- [ ] Cartoon or Fantasy Violence: None
- [ ] Realistic Violence: None
- [ ] Sexual Content or Nudity: None
- [ ] Profanity or Crude Humor: None
- [ ] Alcohol, Tobacco, or Drug Use: None
- [ ] Simulated Gambling: None
- [ ] Horror/Fear Themes: None
- [ ] Mature/Suggestive Themes: None
- [ ] Medical/Treatment Information: None (training guidance, not medical)

**Expected Rating: 4+**

---

## 🌐 Web Hosting Needed

You need to host these pages (can be simple):

1. **Privacy Policy Page**
   - URL: `https://atptraining.app/privacy`
   - Content: From `ATP-Privacy-Policy.docx`

2. **Terms of Service Page** (optional but recommended)
   - URL: `https://atptraining.app/terms`
   - Content: From `ATP-Terms-of-Service.docx`

3. **Support Page**
   - URL: `https://atptraining.app/support`
   - Can be simple: email address + FAQ

**Quick Hosting Options:**
- GitHub Pages (free)
- Notion (free, make pages public)
- Carrd.co (free tier available)
- Linktree (free)

---

## 📱 Screenshots Tips

To capture good screenshots:
1. Open your app in TestFlight
2. Use the iPhone's built-in screenshot (Side + Volume Up)
3. Or use Simulator on Mac for perfect dimensions

**Best practices:**
- Show the app in action with real content
- Use attractive data (good point totals, completed workouts)
- Consider adding marketing text overlays (optional)
- Keep it clean and readable

---

## 🚀 Submission Process

1. Complete all sections above
2. Click "Add for Review" on your app version
3. Answer the export compliance question (select "No" for encryption - the app doesn't use custom encryption)
4. Submit for review

**Review Time:** Usually 24-48 hours, but can take up to a week

---

## 📝 After Approval

Once approved, you can:
- [ ] Release immediately or schedule a release date
- [ ] Monitor reviews and respond to user feedback
- [ ] Set up App Analytics in App Store Connect

---

## Need Help?

Reference documents in your project:
- `AppStore-Metadata.md` - All text content for App Store
- `ATP-Privacy-Policy.docx` - Privacy Policy
- `ATP-Terms-of-Service.docx` - Terms of Service
- `NUTRITION-PHILOSOPHY.md` - Our nutrition approach (for reference)
