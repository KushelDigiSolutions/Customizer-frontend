// Updated ClipartTab.js with proper price tracking

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
  currencyCode = '$',
  editor
}) => {
  const [view, setView] = useState('main');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedVariantGroup, setSelectedVariantGroup] = useState(null);

  useEffect(() => {
    console.log("🛠 selectedProduct:", selectedProduct);
  }, [selectedProduct]);

  const is3DProduct = selectedProduct?.ProductType === '3d';

  // Convert item name into a safe CSS class
  const makeSafeClassName = (name) => {
    if (!name) return '';
    return 'kr-' + name
      .toLowerCase()               // lowercase
      .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric -> "-"
      .replace(/^-+|-+$/g, '');    // trim "-" from start & end
  };


  // ✅ Get first layer key dynamically (since it may not always be "Designs")
  const layerDesignKey = selectedProduct?.layerDesign && typeof selectedProduct.layerDesign === 'object'
    ? Object.keys(selectedProduct.layerDesign)[0]
    : null;

  const shirtDesigns = layerDesignKey && selectedProduct?.layerDesign?.[layerDesignKey]
    ? selectedProduct.layerDesign[layerDesignKey]
    : [];

  const { setthreeDTexture, threeDcolor, setCustomizationData, threeDselectedPart, activeVariants, setActiveVariants, setthreeDselectedPart, customizationData } = use3D();

  // Enhanced 3D design application with proper price tracking
  const handleApply3DDesign = (designUrl, price) => {
    if (!threeDselectedPart) {
      alert("Please select a part to apply the texture.");
      return;
    }

    console.log(`🎨 Applying 3D Design: ${designUrl} with price: ${price}`);

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

      // Update customization data with proper price tracking
      setCustomizationData(prev => {
        console.log('💰 Updating customizationData with design price:', price);
        return {
          ...prev,
          parts: {
            ...prev.parts,
            [threeDselectedPart]: {
              ...(prev.parts?.[threeDselectedPart] || {}),
              image: {
                mode: "full",
                url: designUrl,
                price: Number(price) || 0 // Ensure price is stored as number
              }
            }
          }
        };
      });

      console.log('✅ 3D Design applied with price tracking');
    };
  };

  // Extract available categories from product data
  useEffect(() => {
    if (!selectedProduct) return;

    const categories = [];

    // Check layerDesign (for 2D products)
    if (selectedProduct.layerDesign) {
      Object.keys(selectedProduct.layerDesign).forEach(category => {
        if (selectedProduct.layerDesign[category] && selectedProduct.layerDesign[category].length > 0) {
          categories.push({
            key: category,
            name: getCategoryDisplayName(category),
            items: selectedProduct.layerDesign[category],
            type: 'layer'
          });
        }
      });
    }

    // Check variants (for 3D products with customizable parts)
    if (selectedProduct.variants && Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0) {
      selectedProduct.variants.forEach(variantGroup => {
        if (variantGroup.options && variantGroup.options.length > 0) {
          categories.push({
            key: variantGroup.category,
            name: variantGroup.name,
            items: variantGroup.options,
            type: 'variant',
            variantGroup: variantGroup
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

  // Enhanced item selection with proper price tracking
  const handleItemSelect = (item, category) => {
    console.log(`🎨 Selected item from ${category.key}:`, item.title, 'Price:', item.price);

    if (category.type === 'variant') {
      // Handle variant selection with price tracking
      setActiveVariants(prev => {
        const updated = {
          ...prev,
          [category.key]: item.id
        };
        return updated;
      });

      // Update customizationData with selected variant info including price
      setCustomizationData(prev => {
        console.log('💰 Updating variant price:', category.key, '→', item.price);
        return {
          ...prev,
          selectedVariants: {
            ...(prev.selectedVariants || {}),
            [category.key]: {
              id: item.id,
              name: item.name || item.title,
              price: Number(item.price) || 0, // Ensure price is stored as number
              image: item.thumbnail || item.url || null
            }
          }
        };
      });

      if (item.meshName) {
        setthreeDselectedPart(item.meshName);
      }
      console.log('✅ Updated variant with price tracking:', category.key, '→', item.id, 'Price:', item.price);
    } else {
      // Handle layer design selection
      switch (category.key) {
        case 'designs':
          handleAddDesignToCanvas(item.files?.[0] || item.url, item.position, item.offsetX, item.offsetY);
          // If design has a price, we might want to track it too
          if (item.price) {
            console.log('💰 Design applied with price:', item.price);
          }
          break;

        case 'patterns':
          handleAddPatternToCanvas(item.files?.[0] || item.url);
          // If pattern has a price, we might want to track it too
          if (item.price) {
            console.log('💰 Pattern applied with price:', item.price);
          }
          break;

        // Handle dynamic layer types (shoe parts, etc.)
        case 'sole':
        case 'surface':
        case 'middle':
        case 'lace':
          handleDynamicLayerChange && handleDynamicLayerChange(category.key, item);
          if (item.price) {
            console.log('💰 Layer applied with price:', item.price);
          }
          break;

        // Handle any other custom categories
        default:
          if (handleDynamicLayerChange) {
            handleDynamicLayerChange(category.key, item);
          } else {
            console.log(`No handler for category: ${category.key}`);
          }
          if (item.price) {
            console.log('💰 Custom layer applied with price:', item.price);
          }
          break;
      }
    }
  };

  // Check if there are any customization options available
  const hasAnyCustomizations = () => {
    const hasLayerDesigns = selectedProduct?.layerDesign &&
      Object.keys(selectedProduct.layerDesign).some(key =>
        selectedProduct.layerDesign[key] && selectedProduct.layerDesign[key].length > 0
      );

    const hasVariants = selectedProduct?.variants &&
      Array.isArray(selectedProduct.variants) &&
      selectedProduct.variants.length > 0 &&
      selectedProduct.variants.some(variant => variant.options && variant.options.length > 0);

    const has3DDesigns = is3DProduct && shirtDesigns.length > 0;

    return hasLayerDesigns || hasVariants || has3DDesigns;
  };

  // Render main category selection
  const renderMainView = () => (
    <>
      {/* Show 3D Designs for 3D products */}
      {is3DProduct && shirtDesigns.length > 0 && (
        <div className="kr-3d-section">
          {/* <h4 className="kr-section-title kr-reset kr-reset-margin-padding">3D Designs</h4> */}
          <div className="kr-3d-grid">
            {shirtDesigns.map((design, idx) => {
              const isActive =
                customizationData?.parts?.[threeDselectedPart]?.image?.url === design.files?.[0];

              return (
                <div
                  key={idx}
                  className={`kr-3d-item ${makeSafeClassName(design.title)} ${isActive ? "kr-3d-active" : ""}`}
                  onClick={() => handleApply3DDesign(design.files?.[0], design.price)}
                >
                  <img
                    src={design.files?.[0]}
                    alt={design.title}
                    className="kr-3d-image"
                  />
                  <div className="kr-3d-info">
                    <div className="kr-3d-name">{design.title}</div>
                    <div className="kr-3d-price">
                      {currencyCode}{Number(design?.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Show all available categories (both layer designs and variants) */}
      {availableCategories.length > 0 && (
        <div className="kr-clipart-content kr-clipart-space-y-2">
          {availableCategories.map((category) => (
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
                  <h4 className="kr-reset kr-variant-name kr-reset-margin-padding">{category.name}</h4>
                  <p className="kr-reset kr-reset-margin-padding">
                    {category.items.length} options available
                    {category.type === 'variant' && ' (Variant)'}
                  </p>
                </div>
              </div>
              <img
                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg"
                className="kr-chevron-icon"
              />
            </div>
          ))}
        </div>
      )}

      {/* Show empty state if no customizations available */}
      {!hasAnyCustomizations() && (
        <div className="kr-empty-state">
          <div className="kr-empty-icon">📦</div>
          <p className="kr-empty-text kr-reset">No customization options available</p>
          <p className="kr-empty-subtext kr-reset">This product doesn't have configurable layers or variants</p>
        </div>
      )}
    </>
  );

  // Render category items with price display
  const renderCategoryView = () => {
    const currentCategory = availableCategories.find(cat => cat.key === view);
    if (!currentCategory) return null;

    const isVariantCategory = currentCategory.type === 'variant';
    const isDesignCategory = ['designs', 'patterns'].includes(currentCategory.key);

    return (
      <div className="kr-category-content kr-reset-margin">
        {isDesignCategory ? (
          // Grid layout for designs and patterns
          <div className={currentCategory.key === 'designs' ? 'kr-design-grid-3 kr-reset-margin-padding' : 'kr-design-grid-2 kr-reset-margin-padding'}>
            {currentCategory.items.map((item, index) => (
              <div key={item.id || index} className={`kr-design-item ${makeSafeClassName(item.title || item.name)} kr-reset-margin-padding`}>
                {currentCategory.key === 'patterns' ? (
                  // Special layout for patterns
                  <div className="kr-pattern-container kr-reset-margin">
                    <img
                      src={item.files?.[0] || item.url}
                      alt={item.title || item.name}
                      className="kr-pattern-image kr-reset-padding"
                    />
                    <button
                      onClick={() => handleItemSelect(item, currentCategory)}
                      className="kr-add-pattern-btn kr-reset-margin"
                    >
                      ADD PATTERN
                      {item.price && (
                        <span className="kr-pattern-price">
                          {currencyCode}{Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </button>
                    <p className="kr-pattern-name kr-reset-padding">{item.title || item.name}</p>
                  </div>
                ) : (
                  // Simple grid for designs
                  <div
                    onClick={() => handleItemSelect(item, currentCategory)}
                    className="kr-design-simple kr-reset-margin"
                  >
                    <img
                      src={item.files?.[0] || item.url}
                      alt={item.title || item.name}
                      className="kr-design-image kr-reset-margin-padding"
                    />
                    {item.price && (
                      <div className="kr-design-price">
                        {currencyCode}{Number(item.price).toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List layout for variants and other categories
          <div className="kr-clipart-space-y-2 kr-reset-padding">
            {currentCategory.items.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleItemSelect(item, currentCategory)}
                className={`kr-variant-item ${makeSafeClassName(item.title || item.name)} kr-reset-margin ${isVariantCategory && activeVariants?.[currentCategory.key] === item.id ? 'kr-variant-active' : ''
                  }`}
              >
                <div className="kr-variant-thumbnail kr-reset-margin-padding">
                  {(item.previewFile && item.previewFile !== "") || item.files?.[0] || item.url || item.thumbnail ? (
                    <img
                      src={
                        item.previewFile && item.previewFile !== ""
                          ? item.previewFile
                          : item.files?.[0] || item.url || item.thumbnail
                      }
                      alt={item.title || item.name}
                    />
                  ) : null}
                </div>
                <div className="kr-variant-info kr-reset-margin-padding">
                  <h4 className="kr-variant-name kr-reset-margin-padding">{item.title || item.name}</h4>
                  {item.color && (
                    <p className="kr-variant-detail kr-reset-margin-padding">Color: {item.color}</p>
                  )}
                  {item.shortDescription && (
                    <p className="kr-variant-detail kr-reset-margin-padding">{item.shortDescription}</p>
                  )}
                  {item.description && (
                    <p className="kr-variant-detail kr-reset-margin-padding">{item.description}</p>
                  )}
                  {/* {item.meshName && (
                    <p className="kr-variant-detail kr-reset-margin-padding">Mesh: {item.meshName}</p>
                  )} */}
                  {item.price && (
                    <p className="kr-variant-price kr-reset-margin-padding">
                      Price: {currencyCode}{Number(item.price).toFixed(2)}
                    </p>
                  )}
                  {isVariantCategory && activeVariants?.[currentCategory.key] === item.id && (
                    <p className="kr-variant-detail kr-reset-margin-padding" style={{ color: '#007bff', fontWeight: 'bold' }}>
                      ✓ Selected
                    </p>
                  )}
                </div>
                <div className="kr-variant-arrow kr-reset-margin-padding">
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
          <div className="kr-empty-state">
            <div className="kr-empty-icon">🎨</div>
            <p className="kr-empty-text kr-reset">No {currentCategory.name.toLowerCase()} available</p>
            <p className="kr-empty-subtext kr-reset">This category is empty</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="kr-editor-container kr-reset-margin-padding">
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
    </div>
  );
};

export default DynamicClipartTab;