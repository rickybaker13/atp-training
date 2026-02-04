/**
 * Spacing & Layout System
 * Elite Momentum Design - ATP Ascent Training Protocol
 */

export const spacing = {
  // Base spacing scale (4px baseline)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Border Radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 32,
  },
  
  // Shadows (iOS-style depth)
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
    glow: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 0,
    },
    glowMagenta: {
      shadowColor: '#FF00FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 0,
    },
  },
  
  // Z-Index scale
  zIndex: {
    base: 0,
    dropdown: 100,
    modal: 1000,
    toast: 10000,
  },
  
  // Timing (animations in ms)
  timing: {
    fast: 150,
    base: 200,
    slow: 300,
  },
};

export default spacing;
