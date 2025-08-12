import React, { useState, useRef } from 'react';
import { FaUpload, FaArrowsAlt, FaSearchPlus, FaSearchMinus, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import './RightSideImageComponent.css';

const RightSideImageUpload = ({ 
  editor, 
  selectedProduct, 
  setShowrightImage,
  layerManager 
}) => {
  const [rightSideImage, setRightSideImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setRightSideImage(imageUrl);
      addRightSideImageToCanvas(imageUrl);
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Add image to canvas (right side only) with proper clipping
  const addRightSideImageToCanvas = (url) => {
    if (!editor?.canvas || !url) return;

    const canvas = editor.canvas;

    import("fabric").then((fabric) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        // Remove existing right side image
        const existingRightElements = canvas.getObjects().filter(obj => 
          obj.isRightSideImage === true
        );
        existingRightElements.forEach(element => {
          canvas.remove(element);
        });

        // Create the uploaded image positioned in the right half
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left + (productBounds.width * 0.75) + imagePosition.x, // Center in right half + offset
          top: productBounds.top + (productBounds.height * 0.5) + imagePosition.y, // Center vertically + offset
          originX: "center",
          originY: "center",
          scaleX: imageScale * 0.3, // Base scale + user adjustment
          scaleY: imageScale * 0.3,
          name: "right-side-uploaded-image",
          isRightSideImage: true,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true
        });

        // Create a clipping path that masks the left 50% of the product
        // This ensures the image only appears on the right 50%
        const clipPath = new fabric.Rect({
          left: productBounds.left + (productBounds.width * 0.5), // Start from middle
          top: productBounds.top,
          width: productBounds.width * 0.5, // Right 50% only
          height: productBounds.height,
          absolutePositioned: true
        });

        // Apply the clip path to the image
        imgInstance.clipPath = clipPath;

        canvas.add(imgInstance);

        // Apply layer management - should be on top layer
        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.arrangeCanvasLayers();
        }

        console.log('✅ Right side image added with proper clipping to right 50% (top layer)');
      };
    });
  };

  // Update image scale
  const handleScaleChange = (newScale) => {
    setImageScale(newScale);
    updateRightSideImage({ scale: newScale });
  };

  // Update image position
  const handlePositionChange = (direction, amount = 10) => {
    let newPosition = { ...imagePosition };
    
    switch (direction) {
      case 'up':
        newPosition.y -= amount;
        break;
      case 'down':
        newPosition.y += amount;
        break;
      case 'left':
        newPosition.x -= amount;
        break;
      case 'right':
        newPosition.x += amount;
        break;
    }
    
    setImagePosition(newPosition);
    updateRightSideImage({ position: newPosition });
  };

  // Update existing image on canvas
  const updateRightSideImage = ({ scale, position }) => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    const rightImage = canvas.getObjects().find(obj => obj.isRightSideImage === true);
    
    if (!rightImage) return;

    const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);
    if (!productImage) return;

    const productBounds = productImage.getBoundingRect();

    // Update scale if provided
    if (scale !== undefined) {
      rightImage.set({
        scaleX: scale * 0.5, // Updated to match the addRightSideImageToCanvas scale
        scaleY: scale * 0.5
      });
    }

    // Update position if provided
    if (position !== undefined) {
      rightImage.set({
        left: productBounds.left + (productBounds.width * 0.75) + position.x,
        top: productBounds.top + (productBounds.height * 0.5) + position.y
      });
    }

    rightImage.setCoords();
    canvas.renderAll();
  };

  // Remove right side image
  const removeRightSideImage = () => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;
    const rightImage = canvas.getObjects().find(obj => obj.isRightSideImage === true);
    
    if (rightImage) {
      canvas.remove(rightImage);
      canvas.renderAll();
    }

    setRightSideImage(null);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  return (
    <div className="kr-right-container kr-reset-margin">
      {/* Header */}
      <div className="kr-right-header kr-reset-margin-padding">
        <h3 className="kr-title kr-reset-margin-padding">Right Side Upload</h3>
        <div className="kr-spacer kr-reset-margin-padding"></div> {/* Spacer for balance */}
      </div>
      
      {/* Upload Section */}
      <div className="kr-upload-section kr-reset-padding">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="kr-file-input"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="kr-uploadright-button kr-reset-margin"
        >
          <FaUpload className="kr-upload-icon" />
          <span className="kr-upload-text">
            {isUploading ? 'Uploading...' : 'Upload for Right Side'}
          </span>
        </button>
      </div>

      {/* Controls - Only show when image is uploaded */}
      {rightSideImage && (
        <div className="kr-controls">
          {/* Preview */}
          <div className="kr-preview">
            <img 
              src={rightSideImage} 
              alt="Right side preview" 
              className="kr-preview-image"
            />
            <span className="kr-preview-text">Uploaded Image</span>
            <button
              onClick={removeRightSideImage}
              className="kr-remove-button"
            >
              <FaTimes />
            </button>
          </div>

          {/* Scale Controls */}
          <div className="kr-scale-section">
            <label className="kr-scale-label">
              Size: {Math.round(imageScale * 100)}%
            </label>
            <div className="kr-scale-controls">
              <button
                onClick={() => handleScaleChange(Math.max(0.2, imageScale - 0.1))}
                className="kr-scale-button"
              >
                <FaSearchMinus className="kr-icon" />
              </button>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={imageScale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="kr-scale-slider"
              />
              <button
                onClick={() => handleScaleChange(Math.min(3, imageScale + 0.1))}
                className="kr-scale-button"
              >
                <FaSearchPlus className="kr-icon" />
              </button>
            </div>
          </div>

          {/* Position Controls */}
          <div className="kr-position-section">
            <label className="kr-position-label">
              Position Controls
            </label>
            <div className="kr-position-grid">
              <div></div>
              <button
                onClick={() => handlePositionChange('up')}
                className="kr-position-button"
              >
                <FaArrowUp className="kr-icon" />
              </button>
              <div></div>
              
              <button
                onClick={() => handlePositionChange('left')}
                className="kr-position-button"
              >
                <FaArrowLeft className="kr-icon" />
              </button>
              <div className="kr-position-center">
                <FaArrowsAlt className="kr-center-icon" />
              </div>
              <button
                onClick={() => handlePositionChange('right')}
                className="kr-position-button"
              >
                <FaArrowRight className="kr-icon" />
              </button>
              
              <div></div>
              <button
                onClick={() => handlePositionChange('down')}
                className="kr-position-button"
              >
                <FaArrowDown className="kr-icon" />
              </button>
              <div></div>
            </div>
          </div>

          {/* Fine Position Controls */}
          <div className="kr-fine-position">
            <div className="kr-fine-position-item">
              <label className="kr-fine-position-label">X: {imagePosition.x}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={imagePosition.x}
                onChange={(e) => {
                  const newPos = { x: parseInt(e.target.value), y: imagePosition.y };
                  setImagePosition(newPos);
                  updateRightSideImage({ position: newPos });
                }}
                className="kr-fine-position-slider"
              />
            </div>
            <div className="kr-fine-position-item">
              <label className="kr-fine-position-label">Y: {imagePosition.y}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={imagePosition.y}
                onChange={(e) => {
                  const newPos = { x: imagePosition.x, y: parseInt(e.target.value) };
                  setImagePosition(newPos);
                  updateRightSideImage({ position: newPos });
                }}
                className="kr-fine-position-slider"
              />
            </div>
          </div>

          {/* Info */}
          <div className="kr-info">
            💡 Image appears behind product on right 50% - shows through transparent areas
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSideImageUpload;