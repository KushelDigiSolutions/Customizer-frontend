import * as THREE from 'three';

export const createTextTexture = ({
  text = '',
  font = 'bold 64px Arial',
  fontFamily = 'Arial',
  fontWeight = 'normal',      
  fontStyle = 'normal',      
  fill = '#000000',
  stroke = '#ffffff',
  baseColor = 'transparent',
  textScale = 1,
  textPosX = 0.5,
  textPosY = 0.5
}) => {
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = canvas.height = size;
  const ctx = canvas?.getContext('2d');

  ctx?.clearRect(0, 0, size, size);

  if (text.trim()) {
    // Use fontWeight and fontStyle
    ctx.font = `${fontWeight} ${fontStyle} ${Math.floor(64 * textScale)}px ${fontFamily}`;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = size * textPosX;
    const y = size * textPosY;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  texture.text = text;
  texture.fillStyle = fill;
  texture.strokeStyle = stroke;
  texture.textScale = textScale;
  texture.textPosX = textPosX;
  texture.textPosY = textPosY;
  texture.fontFamily = fontFamily;

  return texture;
};