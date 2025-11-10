const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Create directory for category images if it doesn't exist
const categoryDir = path.join(__dirname, 'img', 'category');
if (!fs.existsSync(categoryDir)) {
  fs.mkdirSync(categoryDir, { recursive: true });
}

// Function to create a Nepal-themed image with text
async function createNepalThemedImage(filename, width, height, bgColor, text, icon) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, lightenColor(bgColor, 20));
  
  // Draw background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle pattern
  ctx.fillStyle = lightenColor(bgColor, 30);
  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      if ((i + j) % 40 === 0) {
        ctx.beginPath();
        ctx.arc(i, j, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Add Nepal-themed elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.font = 'bold 80px Arial';
  ctx.fillText('🇳🇵', width/2 - 40, height/2 + 30);
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, width/2, height/2 - 40);
  
  // Add category icon
  ctx.font = '48px Arial';
  ctx.fillText(icon, width/2, height/2 + 40);
  
  // Add border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);
  
  // Save image
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(categoryDir, filename);
  fs.writeFileSync(filePath, buffer);
  
  console.log(`Created ${filename}`);
}

// Helper function to lighten a color
function lightenColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  
  R = Math.min(255, R + (255 - R) * (percent / 100));
  G = Math.min(255, G + (255 - G) * (percent / 100));
  B = Math.min(255, B + (255 - B) * (percent / 100));
  
  const RR = Math.round(R).toString(16).padStart(2, '0');
  const GG = Math.round(G).toString(16).padStart(2, '0');
  const BB = Math.round(B).toString(16).padStart(2, '0');
  
  return `#${RR}${GG}${BB}`;
}

// Create images for each category
async function createAllImages() {
  console.log('Creating Nepal-themed images...');
  
  // Create images with Nepal-themed colors and icons
  await createNepalThemedImage('news.png', 300, 200, '#3498db', 'News', '📰');
  await createNepalThemedImage('marketplace.png', 300, 200, '#2ecc71', 'Marketplace', '🛍️');
  await createNepalThemedImage('community.png', 300, 200, '#9b59b6', 'Community', '👥');
  await createNepalThemedImage('jobs.png', 300, 200, '#e74c3c', 'Jobs', '💼');
  await createNepalThemedImage('freelance.png', 300, 200, '#f39c12', 'Freelance', '💻');
  await createNepalThemedImage('rentals.png', 300, 200, '#1abc9c', 'Rentals', '🏠');
  
  // Create a hero image
  await createNepalThemedImage('hero.png', 1200, 400, '#ff6b35', 'Welcome to NepLink', '🇳🇵');
  
  // Create feature images
  await createNepalThemedImage('feature-news.png', 400, 300, '#3498db', 'Latest News', '📰');
  await createNepalThemedImage('feature-marketplace.png', 400, 300, '#2ecc71', 'Marketplace', '🛍️');
  await createNepalThemedImage('feature-jobs.png', 400, 300, '#e74c3c', 'Job Portal', '💼');
  await createNepalThemedImage('feature-rentals.png', 400, 300, '#1abc9c', 'Rentals', '🏠');
  await createNepalThemedImage('feature-community.png', 400, 300, '#9b59b6', 'Community', '👥');
  await createNepalThemedImage('feature-freelance.png', 400, 300, '#f39c12', 'Freelancing', '💻');
  
  console.log('All Nepal-themed images created successfully!');
}

// Run the image creation
createAllImages().catch(console.error);