import * as THREE from 'three';

export const createTextTexture = ({
  text = '',
  font = 'bold 64px Arial',
  fill = '#000000',
  stroke = '#ffffff',
  baseColor = 'transparent',
  textScale = 1,
  textPosX = 0.5, // Default centered X
  textPosY = 0.5
}) => {
  const canvas = document.createElement('canvas');
  const size = 1024; // Match the ModelViewer canvas size
  canvas.width = canvas.height = size;
  const ctx = canvas?.getContext('2d');

  // Make background transparent for text overlay
  //ctx?.clearRect(0, 0, size, size);

  if (text.trim()) {
    ctx.font = `bold ${Math.floor(64 * textScale)}px Arial`;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = size * textPosX;
    const y = size * textPosY;
    
    // Draw text with outline
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  
  // Store text properties for reference
  texture.text = text;
  texture.fillStyle = fill;
  texture.strokeStyle = stroke;
  texture.textScale = textScale;
  texture.textPosX = textPosX;
  texture.textPosY = textPosY;

  return texture;
};