// Purchase Service
// Handles In-App Purchase flow and triggers LLM generation after payment
// Note: This uses a mock implementation. Replace with expo-in-app-purchases
// or react-native-iap when ready for production.

import { Alert } from 'react-native';
import { openRouterService } from './openRouterService';
import {
  LLMResponse,
  GeneratedTrainingPlan,
  GeneratedNutritionPlan,
} from '../types';

// ============================================
// PRODUCT IDS
// ============================================

export const PRODUCT_IDS = {
  CUSTOM_TRAINING_PLAN: 'com.atp.training.custom_plan', // $1.99
  NUTRITION_PLAN_ADDON: 'com.atp.training.nutrition',   // $1.99
  PLAN_REGENERATION: 'com.atp.training.regeneration',   // $1.99
} as const;

// ============================================
// TYPES
// ============================================

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PlanGenerationResult {
  success: boolean;
  trainingPlan?: GeneratedTrainingPlan;
  nutritionPlan?: GeneratedNutritionPlan;
  error?: string;
}

type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

// ============================================
// PURCHASE SERVICE CLASS
// ============================================

class PurchaseService {
  private purchasedProducts: Set<string> = new Set();
  private isProcessing: boolean = false;

  /**
   * Initialize IAP connection
   * In production, this would connect to App Store / Play Store
   */
  async initialize(): Promise<void> {
    // TODO: Initialize expo-in-app-purchases or react-native-iap
    // await InAppPurchases.connectAsync();
    // const { results } = await InAppPurchases.getProductsAsync([
    //   PRODUCT_IDS.CUSTOM_TRAINING_PLAN,
    //   PRODUCT_IDS.NUTRITION_PLAN_ADDON,
    //   PRODUCT_IDS.PLAN_REGENERATION,
    // ]);
    console.log('PurchaseService initialized (mock mode)');
  }

  /**
   * Check if user has purchased a specific product
   */
  hasPurchased(productId: ProductId): boolean {
    return this.purchasedProducts.has(productId);
  }

  /**
   * Initiate a purchase
   * Returns transaction details on success
   */
  async purchaseProduct(productId: ProductId): Promise<PurchaseResult> {
    if (this.isProcessing) {
      return { success: false, error: 'Another purchase is in progress' };
    }

    this.isProcessing = true;

    try {
      // TODO: Replace with actual IAP implementation
      // const { responseCode, results } = await InAppPurchases.purchaseItemAsync(productId);
      // if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      //   this.purchasedProducts.add(productId);
      //   return { success: true, transactionId: results[0].transactionId };
      // }

      // MOCK: Simulate successful purchase
      // In development, this auto-succeeds. Remove for production.
      console.log(`[MOCK] Processing purchase for: ${productId}`);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as purchased
      this.purchasedProducts.add(productId);

      const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        transactionId: mockTransactionId,
      };

    } catch (error: any) {
      console.error('Purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Purchase and generate a custom training plan
   * This is the main entry point for the purchase flow
   */
  async purchaseAndGenerateTrainingPlan(
    userInputs: { [key: string]: any },
    includeNutrition: boolean = false,
    onProgress?: (status: string) => void
  ): Promise<PlanGenerationResult> {
    try {
      // Step 1: Process training plan purchase
      onProgress?.('Processing payment...');
      const trainingPurchase = await this.purchaseProduct(PRODUCT_IDS.CUSTOM_TRAINING_PLAN);

      if (!trainingPurchase.success) {
        return {
          success: false,
          error: trainingPurchase.error || 'Payment failed',
        };
      }

      // Step 2: If nutrition is included, process that purchase too
      if (includeNutrition) {
        onProgress?.('Processing nutrition add-on...');
        const nutritionPurchase = await this.purchaseProduct(PRODUCT_IDS.NUTRITION_PLAN_ADDON);

        if (!nutritionPurchase.success) {
          // Training purchase succeeded but nutrition failed
          // Still generate training plan, but note the nutrition failure
          console.warn('Nutrition purchase failed, generating training plan only');
        }
      }

      // Step 3: Verify API is configured
      if (!openRouterService.isConfigured()) {
        return {
          success: false,
          error: 'Plan generation service is temporarily unavailable. Please contact support.',
        };
      }

      // Step 4: Generate the training plan
      onProgress?.('Creating your personalized training plan...');
      const trainingResult = await openRouterService.generateTrainingPlan(userInputs);

      if (!trainingResult.success) {
        return {
          success: false,
          error: trainingResult.error || 'Failed to generate training plan',
        };
      }

      let nutritionPlan: GeneratedNutritionPlan | undefined;

      // Step 5: Generate nutrition plan if purchased
      if (includeNutrition && this.hasPurchased(PRODUCT_IDS.NUTRITION_PLAN_ADDON)) {
        onProgress?.('Creating your nutrition plan...');
        const nutritionResult = await openRouterService.generateNutritionPlan(userInputs);

        if (nutritionResult.success) {
          nutritionPlan = nutritionResult.data as GeneratedNutritionPlan;
        } else {
          console.warn('Nutrition plan generation failed:', nutritionResult.error);
        }
      }

      onProgress?.('Plan ready!');

      return {
        success: true,
        trainingPlan: trainingResult.data as GeneratedTrainingPlan,
        nutritionPlan,
      };

    } catch (error: any) {
      console.error('Plan generation flow error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  /**
   * Purchase plan regeneration
   * Allows users to regenerate their plan with different inputs
   */
  async purchaseRegeneration(
    userInputs: { [key: string]: any },
    includeNutrition: boolean = false,
    onProgress?: (status: string) => void
  ): Promise<PlanGenerationResult> {
    try {
      // Process regeneration purchase
      onProgress?.('Processing regeneration fee...');
      const regenPurchase = await this.purchaseProduct(PRODUCT_IDS.PLAN_REGENERATION);

      if (!regenPurchase.success) {
        return {
          success: false,
          error: regenPurchase.error || 'Payment failed',
        };
      }

      // Generate new plan using same flow
      return this.generatePlansOnly(userInputs, includeNutrition, onProgress);

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Regeneration failed',
      };
    }
  }

  /**
   * Generate plans only (for regeneration after purchase)
   */
  private async generatePlansOnly(
    userInputs: { [key: string]: any },
    includeNutrition: boolean,
    onProgress?: (status: string) => void
  ): Promise<PlanGenerationResult> {
    // Verify API is configured
    if (!openRouterService.isConfigured()) {
      return {
        success: false,
        error: 'Plan generation service is temporarily unavailable.',
      };
    }

    // Generate training plan
    onProgress?.('Regenerating your training plan...');
    const trainingResult = await openRouterService.generateTrainingPlan(userInputs);

    if (!trainingResult.success) {
      return {
        success: false,
        error: trainingResult.error,
      };
    }

    let nutritionPlan: GeneratedNutritionPlan | undefined;

    // Generate nutrition plan if applicable
    if (includeNutrition && this.hasPurchased(PRODUCT_IDS.NUTRITION_PLAN_ADDON)) {
      onProgress?.('Regenerating nutrition plan...');
      const nutritionResult = await openRouterService.generateNutritionPlan(userInputs);

      if (nutritionResult.success) {
        nutritionPlan = nutritionResult.data as GeneratedNutritionPlan;
      }
    }

    onProgress?.('New plan ready!');

    return {
      success: true,
      trainingPlan: trainingResult.data as GeneratedTrainingPlan,
      nutritionPlan,
    };
  }

  /**
   * Restore previous purchases
   * Important for users who reinstall or switch devices
   */
  async restorePurchases(): Promise<{ restored: string[]; error?: string }> {
    try {
      // TODO: Implement actual restore logic
      // const { results } = await InAppPurchases.getPurchaseHistoryAsync();
      // results.forEach(purchase => {
      //   this.purchasedProducts.add(purchase.productId);
      // });

      console.log('[MOCK] Restore purchases called');

      return {
        restored: Array.from(this.purchasedProducts),
      };

    } catch (error: any) {
      return {
        restored: [],
        error: error.message || 'Failed to restore purchases',
      };
    }
  }

  /**
   * Get pricing info for display
   */
  getPricing(): { training: string; nutrition: string; regeneration: string } {
    // TODO: Fetch actual prices from store
    return {
      training: '$1.99',
      nutrition: '$1.99',
      regeneration: '$1.99',
    };
  }

  /**
   * Cleanup when app closes
   */
  async disconnect(): Promise<void> {
    // TODO: Disconnect from IAP service
    // await InAppPurchases.disconnectAsync();
    console.log('PurchaseService disconnected');
  }
}

// Export singleton instance
export const purchaseService = new PurchaseService();
export default purchaseService;
