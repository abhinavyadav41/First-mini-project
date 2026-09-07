import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// Standard SVG for normal icons
const standardSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'));

// Maskable SVG with full-bleed background and 20% safe-zone margin (emblem scaled down to fit 70% safe zone circle)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#4338CA" />
      <stop offset="100%" stop-color="#070B1A" />
    </linearGradient>
    <linearGradient id="mPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E0E7FF" />
    </linearGradient>
    <filter id="mShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#070B1A" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Full-bleed background with no rounded corners (Android handles mask clipping) -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Emblem scaled to sit comfortably inside 80% circular safe zone -->
  <g transform="translate(256, 256) scale(0.72) translate(-256, -256)" filter="url(#mShadow)">
    <!-- Open Book Left Page -->
    <path d="M 256 180 C 210 148, 140 148, 100 162 C 92 165, 86 173, 86 182 L 86 338 C 86 349, 97 357, 108 354 C 144 342, 210 342, 256 376 Z" 
          fill="url(#mPageGrad)" />
    
    <!-- Open Book Right Page -->
    <path d="M 256 180 C 302 148, 372 148, 412 162 C 420 165, 426 173, 426 182 L 426 338 C 426 349, 415 357, 404 354 C 368 342, 302 342, 256 376 Z" 
          fill="url(#mPageGrad)" />

    <!-- Book Spine -->
    <path d="M 256 180 L 256 376" stroke="#4338CA" stroke-width="6" stroke-linecap="round" />

    <!-- Subtle Page Lines Left -->
    <line x1="126" y1="216" x2="222" y2="216" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />
    <line x1="126" y1="252" x2="222" y2="252" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />
    <line x1="126" y1="288" x2="190" y2="288" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />

    <!-- Subtle Page Lines Right -->
    <line x1="290" y1="216" x2="386" y2="216" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />
    <line x1="290" y1="252" x2="386" y2="252" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />
    <line x1="290" y1="288" x2="354" y2="288" stroke="#6366F1" stroke-width="6" stroke-linecap="round" stroke-opacity="0.75" />

    <!-- Bookmark Ribbon -->
    <path d="M 246 160 L 246 250 L 256 240 L 266 250 L 266 160 Z" fill="#F59E0B" />

    <!-- Sparkle / Star -->
    <path d="M 256 94 L 263 118 L 287 125 L 263 132 L 256 156 L 249 132 L 225 125 L 249 118 Z" fill="#FBBF24" />
    <circle cx="340" cy="112" r="6" fill="#FDE68A" opacity="0.8" />
    <circle cx="172" cy="112" r="5" fill="#FDE68A" opacity="0.8" />
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA icons...');

  // 192x192 PNG
  await sharp(standardSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512 PNG
  await sharp(standardSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Maskable 512x512 PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // Apple touch icon 180x180 PNG
  await sharp(standardSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Favicon PNG (32x32) and favicon.ico
  const favicon32 = await sharp(standardSvg).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
  console.log('Created favicon.ico and favicon-32x32.png');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
