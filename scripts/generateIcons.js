/**
 * App Icon Generator for "The Mountain"
 *
 * Run with: node scripts/generateIcons.js
 * Requires: npm install canvas
 *
 * This generates a minimalist mountain peak icon
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for iOS/Android
const sizes = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 48,
  'notification-icon.png': 96,
  'splash-icon.png': 512,
};

// Colors
const BACKGROUND = '#0a0a0f';
const MOUNTAIN_PRIMARY = '#f39c12';
const MOUNTAIN_SECONDARY = '#e67e22';
const SNOW_CAP = '#ffffff';

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, size, size);

  // Calculate proportions
  const centerX = size / 2;
  const padding = size * 0.12;

  // Main mountain (triangle)
  const peakY = size * 0.18;
  const baseY = size * 0.82;
  const leftX = padding;
  const rightX = size - padding;

  // Draw main mountain
  ctx.beginPath();
  ctx.moveTo(centerX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.lineTo(leftX, baseY);
  ctx.closePath();

  // Gradient fill for mountain
  const gradient = ctx.createLinearGradient(centerX, peakY, centerX, baseY);
  gradient.addColorStop(0, MOUNTAIN_PRIMARY);
  gradient.addColorStop(1, MOUNTAIN_SECONDARY);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Snow cap (smaller triangle at top)
  const snowHeight = size * 0.15;
  const snowWidth = snowHeight * 0.8;

  ctx.beginPath();
  ctx.moveTo(centerX, peakY);
  ctx.lineTo(centerX + snowWidth, peakY + snowHeight);
  ctx.lineTo(centerX - snowWidth, peakY + snowHeight);
  ctx.closePath();
  ctx.fillStyle = SNOW_CAP;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Add subtle shadow/depth on right side
  ctx.beginPath();
  ctx.moveTo(centerX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.lineTo(centerX, baseY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fill();

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'assets', filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${filename} (${size}x${size})`);
}

// Generate splash screen with centered icon
function generateSplash() {
  const width = 1284;
  const height = 2778;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, width, height);

  // Mountain icon in center
  const iconSize = 400;
  const centerX = width / 2;
  const centerY = height / 2 - 100;

  const peakY = centerY - iconSize / 2;
  const baseY = centerY + iconSize / 2;
  const leftX = centerX - iconSize / 2;
  const rightX = centerX + iconSize / 2;

  // Draw mountain
  ctx.beginPath();
  ctx.moveTo(centerX, peakY);
  ctx.lineTo(rightX, baseY);
  ctx.lineTo(leftX, baseY);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(centerX, peakY, centerX, baseY);
  gradient.addColorStop(0, MOUNTAIN_PRIMARY);
  gradient.addColorStop(1, MOUNTAIN_SECONDARY);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Snow cap
  const snowHeight = iconSize * 0.15;
  const snowWidth = snowHeight * 0.8;

  ctx.beginPath();
  ctx.moveTo(centerX, peakY);
  ctx.lineTo(centerX + snowWidth, peakY + snowHeight);
  ctx.lineTo(centerX - snowWidth, peakY + snowHeight);
  ctx.closePath();
  ctx.fillStyle = SNOW_CAP;
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;

  // App name text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE MOUNTAIN', centerX, baseY + 120);

  // Tagline
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '32px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('CLIMB EVERY DAY', centerX, baseY + 180);

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'assets', 'splash.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('Generated: splash.png');
}

// Ensure assets directory exists
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate all icons
console.log('Generating app icons for The Mountain...\n');
Object.entries(sizes).forEach(([filename, size]) => {
  generateIcon(size, filename);
});

generateSplash();

console.log('\nDone! Icons saved to /assets/');
