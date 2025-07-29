import { useState } from 'react';
import * as THREE from 'three';

const TextureUploader = ({ setTexture }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result); // for preview
    };
    reader.readAsDataURL(selected);
  };

  const handleApplyTexture = () => {
    if (!previewUrl) return;

    const texture = new THREE.TextureLoader().load(previewUrl);
    setTexture(texture);
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
            Apply Texture
          </button>
        </div>
      )}
    </div>
  );
};

export default TextureUploader;
