// Promo Code Service
// Handles promo/test codes for free access to paid features

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// CONFIGURATION
// ============================================

const STORAGE_KEY = 'atp_promo_code';
const REDEEMED_CODES_KEY = 'atp_redeemed_codes';

// Valid promo codes - add your test user codes here
// In production, these would be validated against a server
const VALID_PROMO_CODES: { [code: string]: PromoCodeConfig } = {
  // Test codes for development
  'ATP2026': {
    type: 'full_access',
    expiresAt: null, // Never expires
    maxUses: 100,
    description: 'Beta tester full access',
  },
  'TESTFLIGHT': {
    type: 'full_access',
    expiresAt: null,
    maxUses: 50,
    description: 'TestFlight tester access',
  },
  'COACH2026': {
    type: 'full_access',
    expiresAt: null,
    maxUses: 25,
    description: 'Coach/trainer access',
  },
  'ATHLETE': {
    type: 'training_only',
    expiresAt: null,
    maxUses: 100,
    description: 'Training plan only',
  },
  'FREENUTRITION': {
    type: 'nutrition_only',
    expiresAt: null,
    maxUses: 50,
    description: 'Nutrition plan only',
  },
  // Add more codes as needed
};

// ============================================
// TYPES
// ============================================

export type PromoCodeType = 'full_access' | 'training_only' | 'nutrition_only' | 'single_regen';

interface PromoCodeConfig {
  type: PromoCodeType;
  expiresAt: Date | null;
  maxUses: number;
  description: string;
}

interface RedeemedCode {
  code: string;
  type: PromoCodeType;
  redeemedAt: Date;
  expiresAt: Date | null;
}

export interface PromoCodeResult {
  success: boolean;
  message: string;
  type?: PromoCodeType;
}

// ============================================
// PROMO CODE SERVICE
// ============================================

class PromoCodeService {
  private activeCode: RedeemedCode | null = null;
  private initialized: boolean = false;

  /**
   * Initialize and load any previously redeemed code
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.activeCode = JSON.parse(stored);
        // Check if code has expired
        if (this.activeCode?.expiresAt) {
          const expiryDate = new Date(this.activeCode.expiresAt);
          if (expiryDate < new Date()) {
            await this.clearCode();
          }
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize promo code service:', error);
      this.initialized = true;
    }
  }

  /**
   * Validate and redeem a promo code
   */
  async redeemCode(code: string): Promise<PromoCodeResult> {
    await this.initialize();

    const normalizedCode = code.toUpperCase().trim();

    // Check if code exists
    const codeConfig = VALID_PROMO_CODES[normalizedCode];
    if (!codeConfig) {
      return {
        success: false,
        message: 'Invalid promo code. Please check and try again.',
      };
    }

    // Check if code has expired
    if (codeConfig.expiresAt && new Date(codeConfig.expiresAt) < new Date()) {
      return {
        success: false,
        message: 'This promo code has expired.',
      };
    }

    // Check if user already has an active code
    if (this.activeCode) {
      return {
        success: false,
        message: `You already have an active promo code (${this.activeCode.code}). Only one code can be active at a time.`,
      };
    }

    // Redeem the code
    const redeemedCode: RedeemedCode = {
      code: normalizedCode,
      type: codeConfig.type,
      redeemedAt: new Date(),
      expiresAt: codeConfig.expiresAt,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(redeemedCode));
      this.activeCode = redeemedCode;

      // Track redeemed codes
      const redeemedCodes = await this.getRedeemedCodes();
      redeemedCodes.push(normalizedCode);
      await AsyncStorage.setItem(REDEEMED_CODES_KEY, JSON.stringify(redeemedCodes));

      return {
        success: true,
        message: this.getSuccessMessage(codeConfig.type),
        type: codeConfig.type,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to redeem code. Please try again.',
      };
    }
  }

  /**
   * Check if user has free access to a specific feature
   */
  async hasAccess(feature: 'training' | 'nutrition' | 'regeneration'): Promise<boolean> {
    await this.initialize();

    if (!this.activeCode) return false;

    switch (this.activeCode.type) {
      case 'full_access':
        return true;
      case 'training_only':
        return feature === 'training';
      case 'nutrition_only':
        return feature === 'nutrition';
      case 'single_regen':
        return feature === 'regeneration';
      default:
        return false;
    }
  }

  /**
   * Get the currently active promo code
   */
  async getActiveCode(): Promise<RedeemedCode | null> {
    await this.initialize();
    return this.activeCode;
  }

  /**
   * Check if any promo code is active
   */
  async hasActiveCode(): Promise<boolean> {
    await this.initialize();
    return this.activeCode !== null;
  }

  /**
   * Clear the active promo code
   */
  async clearCode(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      this.activeCode = null;
    } catch (error) {
      console.error('Failed to clear promo code:', error);
    }
  }

  /**
   * Get list of previously redeemed codes
   */
  private async getRedeemedCodes(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(REDEEMED_CODES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get success message based on code type
   */
  private getSuccessMessage(type: PromoCodeType): string {
    switch (type) {
      case 'full_access':
        return '🎉 Full access unlocked! You have free access to all training and nutrition features.';
      case 'training_only':
        return '🏋️ Training access unlocked! You can generate free custom training plans.';
      case 'nutrition_only':
        return '🥗 Nutrition access unlocked! You can generate free nutrition plans.';
      case 'single_regen':
        return '🔄 One free plan regeneration unlocked!';
      default:
        return 'Code redeemed successfully!';
    }
  }

  /**
   * Get description of current access level
   */
  async getAccessDescription(): Promise<string | null> {
    await this.initialize();

    if (!this.activeCode) return null;

    switch (this.activeCode.type) {
      case 'full_access':
        return 'Full Access (Training + Nutrition)';
      case 'training_only':
        return 'Training Plans Only';
      case 'nutrition_only':
        return 'Nutrition Plans Only';
      case 'single_regen':
        return 'One Free Regeneration';
      default:
        return null;
    }
  }
}

// Export singleton
export const promoCodeService = new PromoCodeService();
export default promoCodeService;
