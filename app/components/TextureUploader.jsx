import { useState, useEffect } from 'react';
import * as THREE from 'three';

const TextureUploader = ({
  setTexture,
  text,
  textColor,
  outlineColor,
  baseColor
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

  const handleApplyTexture = () => {
    if (!previewUrl) return;

    const image = new Image();
    image.src = previewUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, size, size);

      ctx.drawImage(image, 0, 0, size, size);

      if (text.trim()) {
        ctx.font = 'bold 64px Arial';
        ctx.fillStyle = textColor;
        ctx.strokeStyle = outlineColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, size / 2, size / 2);
        ctx.strokeText(text, size / 2, size / 2);
      }

      const finalTexture = new THREE.CanvasTexture(canvas);
      finalTexture.needsUpdate = true;
      setTexture(finalTexture);
    };
  };

  return (
    <div className="bg-white p-3 rounded shadow-md mt-2">
      <label className="block mb-2 font-semibold">Upload Design:</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-contain border mb-2"
          />
          <button
            onClick={handleApplyTexture}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Apply Texture + Text
          </button>
        </div>
      )}
    </div>
  );
};

export default TextureUploader;
