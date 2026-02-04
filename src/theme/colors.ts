/**
 * Elite Momentum Color Palette
 * Design System - ATP Ascent Training Protocol
 */

export const colors = {
  // Primary Branding
  primary: '#00D9FF', // Cyan - main accent
  secondary: '#FF00FF', // Magenta - secondary accent
  tertiary: '#FF1654', // Red - warnings & intensity
  
  // Semantic Colors
  success: '#39FF14', // Neon green - achievements
  warning: '#FF1654', // Red - warnings
  error: '#FF1654', // Red - errors
  
  // Background Palette
  background: {
    dark: '#050810', // Main dark background
    card: '#0f1a2e', // Card background (blue-ish)
    cardAlt: '#1a0f2e', // Alternate card (purple-ish)
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF', // White text
    secondary: '#C9C9C9', // Light gray
    muted: '#999999', // Muted gray
    subtle: '#666666', // Subtle gray
  },
  
  // Transparency Helpers
  transparent: {
    cyan: 'rgba(0, 217, 255, 0.2)', // Cyan border
    magenta: 'rgba(255, 0, 255, 0.2)', // Magenta border
    white: 'rgba(255, 255, 255, 0.1)', // White overlay
  },
  
  // Gradient Stops
  gradients: {
    primary: ['#00D9FF', '#FF00FF'], // Cyan to Magenta
    dark: ['#050810', '#0f1a2e'], // Dark to darker blue
  },
};

export default colors;
