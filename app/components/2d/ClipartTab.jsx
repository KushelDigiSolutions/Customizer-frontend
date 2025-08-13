// Updated ClipartTab.js - Completely Dynamic Based on Product Data
'use client'

import { use3D } from '@/app/context/3DContext';
import React, { useState, useEffect } from 'react';
import * as THREE from 'three'
import './ClipartTab.css';

const DynamicClipartTab = ({
  setShowClipartTab,
  selectedProduct,
  handleAddDesignToCanvas,
  handleAddPatternToCanvas,
  handleDynamicLayerChange,
  currencyCode,
  editor
}) => {
  const [view, setView] = useState('main');
  const [availableCategories, setAvailableCategories] = useState([]);

  const is3DProduct = selectedProduct?.ProductType === '3d';
   // ✅ Get first layer key dynamically (since it may not always be "Designs")
  const layerDesignKey = selectedProduct?.layerDesign
    ? Object.keys(selectedProduct.layerDesign)[0]
    : null;

  const shirtDesigns = layerDesignKey
    ? selectedProduct?.layerDesign[layerDesignKey] || []
    : [];

  const { setthreeDTexture, threeDcolor, setCustomizationData, threeDselectedPart } = use3D();

  const handleApply3DDesign = (designUrl) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = designUrl;
    image.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas?.getContext('2d');
      ctx.fillStyle = threeDcolor || "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, 0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setthreeDTexture(texture);

      setCustomizationData(prev => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            image: {
              mode: "full",
              url: designUrl
            }
          }
        }
      }));
    };
  };

  // Extract available categories from product data
  useEffect(() => {
    if (!selectedProduct) return;

    const categories = [];

    // Check what data is available in the product
    if (selectedProduct.layersDesigns) {
      Object.keys(selectedProduct.layersDesigns).forEach(category => {
        if (selectedProduct.layersDesigns[category] && selectedProduct.layersDesigns[category].length > 0) {
          categories.push({
            key: category,
            name: getCategoryDisplayName(category),
            items: selectedProduct.layersDesigns[category]
          });
        }
      });
    }

    setAvailableCategories(categories);
    console.log('📦 Available categories from product:', categories.map(c => c.name));
  }, [selectedProduct]);

  // Convert category keys to display names
  const getCategoryDisplayName = (key) => {
    const displayNames = {
      designs: 'Product Designs',
      patterns: 'Product Patterns',
      sole: 'Shoe Sole Options',
      surface: 'Surface Colors',
      middle: 'Middle Parts',
      lace: 'Lace Colors',
      backgrounds: 'Background Designs',
      textures: 'Texture Patterns',
      graphics: 'Graphic Elements',
      logos: 'Logo Designs',
      typography: 'Typography Styles'
    };

    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleBack = () => {
    setView('main');
  };

  const getHeaderTitle = () => {
    const backIcon = (
      <img
        src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg"
        className="kr-back-icon"
      />
    );

    if (view === 'main') {
      return 'Product Customization';
    }

    const currentCategory = availableCategories.find(cat => cat.key === view);
    const categoryName = currentCategory ? currentCategory.name : 'Back';

    return (
      <span className='kr-back-button' onClick={handleBack}>
        {backIcon}
        <span className='kr-back-text'>
          {categoryName}
        </span>
      </span>
    );
  };

  // Handle item selection based on category type
  const handleItemSelect = (item, categoryKey) => {
    console.log(`🎨 Selected item from ${categoryKey}:`, item.name);

    switch (categoryKey) {
      case 'designs':
        handleAddDesignToCanvas(item.url, item.position, item.offsetX, item.offsetY);
        break;

      case 'patterns':
        handleAddPatternToCanvas(item.url);
        break;

      // Handle dynamic layer types (shoe parts, etc.)
      case 'sole':
      case 'surface':
      case 'middle':
      case 'lace':
        handleDynamicLayerChange && handleDynamicLayerChange(categoryKey, item);
        break;

      // Handle any other custom categories
      default:
        if (handleDynamicLayerChange) {
          handleDynamicLayerChange(categoryKey, item);
        } else {
          console.log(`No handler for category: ${categoryKey}`);
        }
        break;
    }
  };
  

  // Render main category selection
  const renderMainView = () => (
    <>
      {
        selectedProduct.ProductType === '2d' && (
          <div className="kr-clipart-content kr-clipart-space-y-2">
            {availableCategories.length === 0 ? (
              <div className="kr-empty-state">
                <div className="kr-empty-icon">📦</div>
                <p className="kr-empty-text kr-reset">No customization options available</p>
                <p className="kr-empty-subtext kr-reset">This product doesn't have configurable layers</p>
              </div>
            ) : (
              availableCategories.map((category) => (
                <div
                  key={category.key}
                  onClick={() => setView(category.key)}
                  className="kr-category-item"
                >
                  <div className="kr-category-left">
                    <div className="kr-category-badge">
                      {category.items.length}
                    </div>
                    <div className="kr-category-info">
                      <h4 className="kr-reset kr-reset-margin-padding">{category.name}</h4>
                      <p className="kr-reset kr-reset-margin-padding">{category.items.length} options available</p>
                    </div>
                  </div>
                  <img
                    src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg"
                    className="kr-chevron-icon"
                  />
                </div>
              ))
            )}
          </div>
        )
      }

      {is3DProduct && shirtDesigns.length > 0 && (
        <div className="kr-3d-section">
          <div className="kr-3d-grid">
            {shirtDesigns.map((design, idx) => (
              <div
                key={idx}
                className="kr-3d-item"
                onClick={() => handleApply3DDesign(design.files?.[0])}
              >
                <img
                  src={design.files?.[0]}
                  alt={design.title}
                  className="kr-3d-image"
                />
                <div className="kr-3d-info">
                  <div className="kr-3d-name">{design.title}</div>
                  <div className="kr-3d-price">{currencyCode}{design?.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // Render category items
  const renderCategoryView = () => {
    const currentCategory = availableCategories.find(cat => cat.key === view);
    if (!currentCategory) return null;

    const isShoeCategory = ['sole', 'surface', 'middle', 'lace'].includes(view);
    const isDesignCategory = ['designs', 'patterns'].includes(view);

    return (
      <div className="kr-category-content kr-reset-margin">
        {isDesignCategory ? (
          // Grid layout for designs and patterns
          <div className={view === 'designs' ? 'kr-design-grid-3 kr-reset-margin-padding' : 'kr-design-grid-2 kr-reset-margin-padding'}>
            {currentCategory.items.map((item, index) => (
              <div key={item.id || index} className="kr-design-item kr-reset-margin-padding">
                {view === 'patterns' ? (
                  // Special layout for patterns
                  <div className="kr-pattern-container kr-reset-margin">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="kr-pattern-image kr-reset-padding"
                    />
                    <button
                      onClick={() => handleItemSelect(item, view)}
                      className="kr-add-pattern-btn kr-reset-margin"
                    >
                      ADD PATTERN
                    </button>
                    <p className="kr-pattern-name kr-reset-padding">{item.name}</p>
                  </div>
                ) : (
                  // Simple grid for designs
                  <div
                    onClick={() => handleItemSelect(item, view)}
                    className="kr-design-simple kr-reset-margin"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="kr-design-image kr-reset-margin-padding"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List layout for shoe parts and other categories
          <div className="kr-clipart-space-y-2 kr-reset-padding">
            {currentCategory.items.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleItemSelect(item, view)}
                className="kr-shoe-item kr-reset-margin"
              >
                <div className="kr-shoe-thumbnail kr-reset-margin-padding">
                  <img
                    src={item.url}
                    alt={item.name}
                  />
                </div>
                <div className="kr-shoe-info kr-reset-margin-padding">
                  <h4 className="kr-shoe-name kr-reset-margin-padding">{item.name}</h4>
                  {item.color && (
                    <p className="kr-shoe-detail kr-reset-margin-padding">Color: {item.color}</p>
                  )}
                  {item.description && (
                    <p className="kr-shoe-detail kr-reset-margin-padding">{item.description}</p>
                  )}
                </div>
                <div className="kr-shoe-arrow kr-reset-margin-padding">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state for categories with no items */}
        {currentCategory.items.length === 0 && (
          <div className="kr-empty-state ">
            <div className="kr-empty-icon">🎨</div>
            <p className="kr-empty-text kr-reset">No {currentCategory.name.toLowerCase()} available</p>
            <p className="kr-empty-subtext kr-reset">This category is empty</p>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="kr-clipart-container kr-reset-margin-padding">
      <div className='kr-clipart-header kr-reset-margin'>
        <h3 className='kr-clipart-title kr-reset-margin-padding'>
          {getHeaderTitle()}
        </h3>
        <div className="kr-clipart-close kr-reset-margin-padding" onClick={() => setShowClipartTab(false)}>
          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
        </div>
      </div>
      <hr className="kr-clipart-divider kr-reset-margin-padding" />

      {view === 'main' ? renderMainView() : renderCategoryView()}

      {/* Dynamic info footer */}
      {/* <div className="kr-footer">
        {view === 'main'
          ? `Product Type: ${selectedProduct?.type || 'Unknown'} • ${availableCategories.length} categories available`
          : `Select an option to customize your ${selectedProduct?.type || 'product'}`
        }
      </div> */}
    </div>
  );
};

export default DynamicClipartTab;