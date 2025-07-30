import * as THREE from 'three';

export const createTextTexture = ({
  text = '',
  font = 'bold 64px Arial',
  fill = '#000000',
  stroke = '#ffffff',
  baseColor = '#ffffff'
}) => {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, size / 2, size / 2);
  ctx.strokeText(text, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
};
