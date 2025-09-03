import { useState, useEffect } from "react";
import * as THREE from "three";
import { use3D } from "../../context/3DContext";
import "./TextureUploader.css";

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
    threeDselectedPart,
    threeDzoom,
    setthreeDZoom,
    threeDoffsetX,
    setthreeDOffsetX,
    threeDoffsetY,
    setthreeDOffsetY,
    previewUrl, setPreviewUrl,
    selectedFile, setSelectedFile,
  } = use3D();

  // const [previewUrl, setPreviewUrl] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

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
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setImageDimensions({ width: 0, height: 0 });
    setthreeDTexture(null);
    setCustomizationData((prev) => ({
      ...prev,
      parts: {
        ...prev.parts,
        [threeDselectedPart]: {
          ...prev.parts[threeDselectedPart],
          image: null,
        },
      },
    }));
  };

  useEffect(() => {
    if (!previewUrl) return;

    const image = new window.Image();
    image.src = previewUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      // Fill base color
      ctx.fillStyle = threeDcolor || "#fff";
      ctx.fillRect(0, 0, size, size);

      // Apply image based on mode
      if (threeDtextureMode === "full") {
        // For full texture, apply zoom and offset
        const scaledSize = size * threeDzoom;
        const offsetXPx = size * threeDoffsetX;
        const offsetYPx = size * threeDoffsetY;
        
        ctx.drawImage(image, offsetXPx, offsetYPx, scaledSize, scaledSize);
      } else if (threeDtextureMode === "logo") {
        const logoSize = size * threeDlogoScale;
        const x = size * threeDlogoPosX - logoSize / 2;
        const y = size * threeDlogoPosY - logoSize / 2;
        ctx.drawImage(image, x, y, logoSize, logoSize);
      }

      const finalTexture = new THREE.CanvasTexture(canvas);
      finalTexture.needsUpdate = true;
      setthreeDTexture(finalTexture);

      setCustomizationData((prev) => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            image: {
              mode: threeDtextureMode,
              url: previewUrl,
              position: { x: threeDlogoPosX, y: threeDlogoPosY },
              scale: threeDlogoScale,
              zoom: threeDzoom,
              offsetX: threeDoffsetX,
              offsetY: threeDoffsetY,
            },
          },
        },
      }));
    };
  }, [
    previewUrl,
    threeDtextureMode,
    threeDlogoScale,
    threeDlogoPosX,
    threeDlogoPosY,
    threeDzoom,
    threeDoffsetX,
    threeDoffsetY,
    threeDcolor,
    setthreeDTexture,
    setCustomizationData,
    threeDselectedPart,
  ]);

  // Show upload interface before upload
  if (!previewUrl) {
    return (
      <div className="kr-texture-uploader">
        <select
          className="kr-texture-mode-select"
          value={threeDtextureMode}
          onChange={(e) => setthreeDTextureMode(e.target.value)}
        >
          <option value="full">Full Texture</option>
          <option value="logo">Logo Only</option>
        </select>

        <div className="kr-texture-upload-container">
          <h3 className="kr-texture-upload-title">
            Original vector artwork best, if you have?
          </h3>
          <label className="kr-texture-upload-area">
            <input
              type="file"
              accept="image/*"
              className="kr-texture-file-input"
              onChange={handleFileSelect}
            />
            <div className="kr-texture-upload-content">
              <div className="kr-texture-upload-btn">
                {selectedFile ? "Image Selected" : "Choose a file"}
              </div>
              <p className="kr-texture-upload-text">
                We support JPG, PNG, EPS
                <br />
                Max 5 MB
              </p>
            </div>
          </label>
          <button
            onClick={handleUploadDesign}
            disabled={!selectedFile || isUploading}
            className={`kr-texture-submit-btn ${
              selectedFile && !isUploading
                ? "kr-texture-submit-btn-enabled"
                : "kr-texture-submit-btn-disabled"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    );
  }

  // Show preview and controls after upload
  return (
    <>
      <div className="kr-texture-uploader kr-reset-margin">
        {/* Preview Header */}
        {/* <div className='kr-preview-header kr-reset-margin'>
          <div className='kr-preview-title-section kr-reset-margin-padding'>
            <h3 className='kr-preview-title kr-reset-margin-padding'>Preview</h3>
          </div>
          <div
            onClick={handleRemoveImage}
            className='kr-preview-close kr-reset-margin-padding'
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <hr className="kr-preview-divider kr-reset-margin-padding" /> */}

        {/* Image Preview Section */}
        <div className="kr-preview-section kr-reset">
          <div className="kr-preview-design-image kr-reset-margin">
            <img
              src={previewUrl}
              alt="Design"
              className="kr-preview-design-img kr-reset-margin-padding"
            />
          </div>
          <div className="kr-preview-design-info kr-reset-margin-padding">
            <p className="kr-preview-dimensions-label kr-reset-margin-padding">
              Width x Height
            </p>
            <div className="kr-preview-dimensions kr-reset-margin-padding">
              <span className="kr-preview-dimension-badge kr-reset-margin">
                {(imageDimensions.width / 50).toFixed(2)} in
              </span>
              <span className="kr-preview-dimension-badge kr-reset-margin">
                {(imageDimensions.height / 50).toFixed(2)} in
              </span>
            </div>
          </div>
        </div>
        <hr className="kr-preview-divider kr-reset-margin-padding" />

        {/* Logo Controls */}
        {threeDtextureMode === "logo" && (
          <div className="kr-texture-logo-controls">
            {/* <h3 className='kr-preview-section-title kr-reset-margin-padding'>Logo Controls</h3> */}
            
            <div className="kr-texture-control-group">
              <label className="kr-texture-logo-label">Logo Scale: {threeDlogoScale.toFixed(2)}</label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={threeDlogoScale}
                  onChange={(e) => setthreeDLogoScale(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${((threeDlogoScale - 0.1) / 0.9) * 100}%, #e5e7eb ${((threeDlogoScale - 0.1) / 0.9) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDlogoScale.toFixed(2)}
                </span>
              </div>
              <div className="kr-texture-logo-labels">
                <span className="kr-reset">Small</span>
                <span className="kr-reset">Large</span>
              </div>
            </div>

            <div className="kr-texture-control-group">
              <label className="kr-texture-logo-label">Logo Position X: {threeDlogoPosX.toFixed(2)}</label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={threeDlogoPosX}
                  onChange={(e) => setthreeDLogoPosX(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${threeDlogoPosX * 100}%, #e5e7eb ${threeDlogoPosX * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDlogoPosX.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="kr-texture-control-group">
              <label className="kr-texture-logo-label">Logo Position Y: {threeDlogoPosY.toFixed(2)}</label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={threeDlogoPosY}
                  onChange={(e) => setthreeDLogoPosY(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${threeDlogoPosY * 100}%, #e5e7eb ${threeDlogoPosY * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDlogoPosY.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Full Texture Controls */}
        {threeDtextureMode === "full" && (
          <div className="kr-texture-controls-panel">
            {/* <h3 className='kr-preview-section-title kr-reset-margin-padding'>Full Texture Controls</h3> */}
            
            <div className="kr-texture-control-group">
              <label className="kr-texture-control-label">
                Zoom (Repeat): {threeDzoom.toFixed(2)}
              </label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  value={threeDzoom}
                  onChange={(e) => setthreeDZoom(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${((threeDzoom - 0.2) / 2.8) * 100}%, #e5e7eb ${((threeDzoom - 0.2) / 2.8) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDzoom.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="kr-texture-control-group">
              <label className="kr-texture-control-label">
                Offset X: {threeDoffsetX.toFixed(2)}
              </label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={threeDoffsetX}
                  onChange={(e) => setthreeDOffsetX(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${((threeDoffsetX + 1) / 2) * 100}%, #e5e7eb ${((threeDoffsetX + 1) / 2) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDoffsetX.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="kr-texture-control-group">
              <label className="kr-texture-control-label">
                Offset Y: {threeDoffsetY.toFixed(2)}
              </label>
              <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={threeDoffsetY}
                  onChange={(e) => setthreeDOffsetY(parseFloat(e.target.value))}
                  className="kr-preview-slider kr-reset-margin-padding"
                  style={{
                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${((threeDoffsetY + 1) / 2) * 100}%, #e5e7eb ${((threeDoffsetY + 1) / 2) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className='kr-preview-value-display kr-reset-margin'>
                  {threeDoffsetY.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TextureUploader;

