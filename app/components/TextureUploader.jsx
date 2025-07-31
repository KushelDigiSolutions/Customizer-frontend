import { useState, useEffect } from 'react';
import * as THREE from 'three';

const TextureUploader = ({
  setTexture,
  text,
  textColor,
  outlineColor,
  baseColor,
  textureMode,
  setTextureMode,
  logoScale,
  setLogoScale,
  logoPosX,
  setLogoPosX,
  logoPosY,
  setLogoPosY,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  useEffect(() => {
    if (!previewUrl) return;

    const image = new Image();
    image.src = previewUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Fill base color
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      // Apply image
      if (textureMode === 'full') {
        ctx.drawImage(image, 0, 0, size, size);
      } else if (textureMode === 'logo') {
        const logoSize = size * logoScale;
        const x = size * logoPosX - logoSize / 2;
        const y = size * logoPosY - logoSize / 2;
        ctx.drawImage(image, x, y, logoSize, logoSize);
      }

      // Draw text
      if (text.trim()) {
        ctx.font = 'bold 64px Arial';
        ctx.fillStyle = textColor;
        ctx.strokeStyle = outlineColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, size / 2, size * 0.85);
        ctx.strokeText(text, size / 2, size * 0.85);
      }

      const finalTexture = new THREE.CanvasTexture(canvas);
      finalTexture.needsUpdate = true;
      setTexture(finalTexture);
    };
  }, [
    previewUrl,
    textureMode,
    logoScale,
    logoPosX,
    logoPosY,
    text,
    textColor,
    outlineColor,
    baseColor,
    setTexture,
  ]);

  return (
    <div className="bg-white p-3 rounded shadow-md mt-2">
      <select
        className="mt-2 border rounded p-1"
        value={textureMode}
        onChange={(e) => setTextureMode(e.target.value)}
      >
        <option value="full">Full Texture</option>
        <option value="logo">Logo Only</option>
      </select>

      <label className="block mb-2 font-semibold mt-3">Upload Design:</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {previewUrl && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-contain border mb-2"
          />
        </div>
      )}

      {textureMode === 'logo' && (
        <div className="mt-3 space-y-2">
          <label className="block font-semibold">Logo Scale</label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={logoScale}
            onChange={(e) => setLogoScale(parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-sm">
            <span>Small</span><span>Large</span>
          </div>

          <label className="block font-semibold mt-2">Logo Position X</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={logoPosX}
            onChange={(e) => setLogoPosX(parseFloat(e.target.value))}
          />

          <label className="block font-semibold mt-2">Logo Position Y</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={logoPosY}
            onChange={(e) => setLogoPosY(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
};

export default TextureUploader;
