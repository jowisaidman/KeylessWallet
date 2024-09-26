// Function to hash text into a numeric seed
function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Function to generate a random color based on a hash
function getColorFromHash(hash: number, index: number): string {
  const r = (hash * (index + 1)) % 255;
  const g = (hash * (index + 2)) % 255;
  const b = (hash * (index + 3)) % 255;
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to create a pixelated avatar as an SVG
export default function createPixelatedAvatar(text: string): string {
  const hash = hashText(text);
  const avatarSize = 100; // Size of the avatar
  const gridSize = 10; // Grid size (10x10)

  // Calculate size of each pixel square
  const pixelSize = avatarSize / gridSize;

  let avatar = `<svg width="${avatarSize}" height="${avatarSize}" xmlns="http://www.w3.org/2000/svg">`;

  // Loop over grid and create each pixel square
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const color = getColorFromHash(hash, row * gridSize + col);
      const x = col * pixelSize;
      const y = row * pixelSize;
      avatar += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
    }
  }

  avatar += `</svg>`;
  return avatar;
}
