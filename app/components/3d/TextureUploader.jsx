import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { use3D } from '../../context/3DContext';

const TextureUploader = () => {
  const {
    setthreeDTexture,
    threeDtexture,
    threeDtext,
    threeDtextColor,
    threeDoutlineColor,
    threeDcolor,
    threeDtextureMode,
    setthreeDTextureMode,
    threeDlogoScale,
    setthreeDLogoScale,
    threeDlogoPosX,
    setthreeDLogoPosX,
    threeDlogoPosY,
    setthreeDLogoPosY,
    setCustomizationData,
    threeDselectedPart
  } = use3D();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleUploadDesign = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setIsUploading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (!previewUrl) return;

    const image = new window.Image();
    image.src = previewUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Fill base color
      ctx.fillStyle = threeDcolor || "#fff"; 
      ctx.fillRect(0, 0, size, size);

      // Apply image based on mode
      if (threeDtextureMode === 'full') {
        ctx.drawImage(image, 0, 0, size, size);
      } else if (threeDtextureMode === 'logo') {
        const logoSize = size * threeDlogoScale;
        const x = size * threeDlogoPosX - logoSize / 2;
        const y = size * threeDlogoPosY - logoSize / 2;
        ctx.drawImage(image, x, y, logoSize, logoSize);
      }

      const finalTexture = new THREE.CanvasTexture(canvas);
      finalTexture.needsUpdate = true;
      setthreeDTexture(finalTexture);

      setCustomizationData(prev => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            image: {
              mode: threeDtextureMode,
              url: previewUrl,
              position: { x: threeDlogoPosX, y: threeDlogoPosY },
              scale: threeDlogoScale
            }
          }
        }
      }));
    };
  // eslint-disable-next-line
  }, [
    previewUrl,
    threeDtextureMode,
    threeDlogoScale,
    threeDlogoPosX,
    threeDlogoPosY,
    threeDcolor,
    setthreeDTexture,
    setCustomizationData,
    threeDselectedPart
  ]);

  return (
    <div className="bg-white p-3 rounded shadow-md mt-2">
      <select
        className="mt-2 border rounded p-1"
        value={threeDtextureMode}
        onChange={(e) => setthreeDTextureMode(e.target.value)}
      >
        <option value="full">Full Texture</option>
        <option value="logo">Logo Only</option>
      </select>

      <div className='flex flex-col gap-4'>
        <h3 className='text-[14px] font-medium'>Original vector artwork best, if you have?</h3>
        <label className="block bg-[#E4E9EC] py-12 px-4 rounded-lg cursor-pointer hover:bg-[#d9e2e6] transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="text-center">
            <div className="bg-[#3559C7] text-white px-6 py-2 rounded-md inline-block mb-3">
              {selectedFile ? "Image Uploaded" : "Choose a file"}
            </div>
            <p className='text-gray-500 text-[12px]'>
              We support JPG, PNG, EAPS<br />
              An max 5 MB
            </p>
          </div>
        </label>
        <button
          onClick={handleUploadDesign}
          disabled={!selectedFile || isUploading}
          className={`w-full rounded-md py-3 text-[14px] font-medium cursor-pointer transition-colors ${selectedFile && !isUploading
            ? 'text-white bg-[#3559C7] hover:bg-[#2a47a3]'
            : 'bg-[#E6E9F3] text-[#B8C5E8] cursor-not-allowed'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {previewUrl && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-contain border mb-2"
          />
          <button
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              setPreviewUrl(null);
              setSelectedFile(null);
              setthreeDTexture(null);
              setCustomizationData(prev => ({
                ...prev,
                parts: {
                  ...prev.parts,
                  [threeDselectedPart]: {
                    ...prev.parts[threeDselectedPart],
                    image: null
                  }
                }
              }));
            }}
          >
            Remove Image
          </button>
        </div>
      )}

      {threeDtextureMode === 'logo' && (
        <div className="mt-3 space-y-2">
          <label className="block font-semibold">Logo Scale</label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={threeDlogoScale}
            onChange={(e) => setthreeDLogoScale(parseFloat(e.target.value))}
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
            value={threeDlogoPosX}
            onChange={(e) => setthreeDLogoPosX(parseFloat(e.target.value))}
          />

          <label className="block font-semibold mt-2">Logo Position Y</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threeDlogoPosY}
            onChange={(e) => setthreeDLogoPosY(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
};

export default TextureUploader;