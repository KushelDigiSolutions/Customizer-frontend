// Enhanced Topbar.jsx with Real-time Pricing

import React, { useEffect, useState } from 'react';
import { use3D } from '../context/3DContext';
import { use2D } from '../context/2DContext';
import './Topbar.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Topbar = ({
  setShowSidebar,
  onSave,
  isSaving,
  selectedProduct,
  productPrice, // Base product price from props
  currencyCode = '$', // Currency symbol
  productQuantity = 1,
  onTotalPriceChange,
  totalPrice,
  setPageLoading
}) => {
  const {
    handleScreenshot,
    handleClearSelectedPart,
    isDesignSaved,
    showAddToCart,
    customizationData,
    activeVariants,
    toggleRotation,
    isRotating,
    toggleExplode, isExploded,
    skeletonLoading // <-- Add this
  } = use3D();

  const {
    isDesignSaved: isDesignSaved2D,
    showAddToCart: showAddToCart2D,
    selectedLayers
  } = use2D();

  // const [totalPrice, setTotalPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState({
    basePrice: 0,
    designPrice: 0,
    variantPrice: 0
  });

  const is3D = selectedProduct?.ProductType === "3d";
  const is2D = selectedProduct?.ProductType === "2d";

  // Calculate total price for 3D products
  const calculate3DPrice = () => {
    let designPrice = 0;
    let variantPrice = 0;
    const basePrice = Number(productPrice) || 0;

    // Calculate design/pattern prices from customizationData
    if (customizationData?.parts) {
      Object.values(customizationData.parts).forEach(part => {
        if (part?.image?.price) {
          designPrice += Number(part.image.price) || 0;
        }
      });
    }

    // Calculate variant prices
    if (selectedProduct?.variants && activeVariants) {
      selectedProduct.variants.forEach(variantGroup => {
        const selectedVariantId = activeVariants[variantGroup.category];
        if (selectedVariantId) {
          const selectedOption = variantGroup.options.find(opt => opt.id === selectedVariantId);
          if (selectedOption?.price) {
            variantPrice += Number(selectedOption.price) || 0;
          }
        }
      });
    }

    return {
      basePrice,
      designPrice,
      variantPrice,
      totalPrice: basePrice + designPrice + variantPrice
    };
  };

  // Calculate total price for 2D products
  const calculate2DPrice = () => {
    let designPrice = 0;
    let layerPrice = 0;
    const basePrice = Number(productPrice) || 0;

    // Calculate design prices from layerDesign
    if (selectedProduct?.layerDesign) {
      Object.values(selectedProduct.layerDesign).forEach(designGroup => {
        if (Array.isArray(designGroup)) {
          // This would need to track which designs are currently applied
          // For now, we'll use a different approach based on selectedLayers
        }
      });
    }

    // Calculate layer prices (if any layers have associated prices)
    if (selectedLayers && typeof selectedLayers === 'object') {
      Object.values(selectedLayers).forEach(layer => {
        if (layer?.price) {
          layerPrice += Number(layer.price) || 0;
        }
      });
    }

    return {
      basePrice,
      designPrice,
      variantPrice: layerPrice, // Using variantPrice for layers in 2D
      totalPrice: basePrice + designPrice + layerPrice
    };
  };

  // Update pricing whenever relevant data changes
  useEffect(() => {
    let breakdown;

    if (is3D) {
      breakdown = calculate3DPrice();
    } else if (is2D) {
      breakdown = calculate2DPrice();
    } else {
      breakdown = {
        basePrice: Number(productPrice) || 0,
        designPrice: 0,
        variantPrice: 0,
        totalPrice: Number(productPrice) || 0
      };
    }

    setPriceBreakdown(breakdown);
    onTotalPriceChange(breakdown.totalPrice);
  }, [
    productPrice,
    customizationData,
    activeVariants,
    selectedLayers,
    selectedProduct,
    is3D,
    is2D
  ]);


  // Handle save for both 2d and 3d
  const handleSave = async () => {
    try {
      if (selectedProduct?.ProductType === "3d") {
        // Wait for screenshots to finish
        const screenshots = await handleScreenshot();

        if (!screenshots || screenshots.length === 0) {
          alert("Screenshots not ready yet. Please try again.");
          return;
        }

        // Pass screenshots to save logic
        if (onSave) {
          const result = await onSave(screenshots);
          // console.log('3D Save result:', result);
          if (result && result.success) {
            console.log('3D Design saved, showing Add to Cart button');
            // console.log('Saved data:', result.savedData);
          }
        }
      } else {
        if (onSave) {
          const result = await onSave();
          console.log('2D Save result:', result);
          if (result && result.success) {
            console.log('2D Design saved, showing Add to Cart button');
            // console.log('Saved data:', result.savedData);
          }
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed: ' + error.message);
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return `${currencyCode}${Number(price).toFixed(2)}`;
  };

  const hasValidExplodeConfig = (explodeConfig) => {
    if (!explodeConfig || typeof explodeConfig !== 'object') return false;
    return Object.values(explodeConfig).some(
      arr => Array.isArray(arr) && arr.some(cat => cat && cat.trim() !== "")
    );
  };

  return (
    <div className="kr-topbar kr-reset-margin-padding">
      <div className="kr-topbar-container">
        <div className="kr-logo-section kr-reset-margin-padding">
          {skeletonLoading ? (
            <Skeleton width={40} height={40} circle />
          ) : (
            <button
              onClick={() => setShowSidebar(prev => !prev)}
              className="kr-menu-button kr-reset-margin"
              aria-label="Toggle Sidebar"
            >
              <svg className="kr-menu-icon kr-reset-margin-padding" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
        <div className="kr-right-section kr-reset-margin-padding">
          {skeletonLoading ? (
            <>
              <Skeleton width={80} height={32} style={{ marginRight: 8 }} />
              {/* <Skeleton width={120} height={32} style={{ marginRight: 8 }} /> */}
              <Skeleton width={120} height={32} style={{ marginRight: 8 }} />
              <Skeleton width={40} height={40} circle />
            </>
          ) : (
            <>
              <div className="kr-total-price kr-reset-margin">
                {totalPrice > 0 && (
                  <>
                    {productQuantity} <span>x</span>{" "}
                  </>
                )}
                {formatPrice(totalPrice * productQuantity)}
              </div>

              {/* {
                selectedProduct?.ProductType === "3d" &&
                hasValidExplodeConfig(selectedProduct?.explodeConfig) && (
                  <button onClick={toggleExplode} className="kr-navbar-button kr-rotate-btn">
                    {isExploded ? "Reset" : "Explode"}
                  </button>
                )
              } */}

              {
                selectedProduct?.ProductType === "3d" && (
                  <button onClick={toggleRotation} className="kr-navbar-button kr-rotate-btn">
                    {isRotating ? "Stop Rotation" : "Start Rotation"}
                  </button>
                )
              }

              {selectedProduct?.ProductType === "3d" && selectedProduct?.parts?.length > 0 && (
                <button
                  className="kr-navbar-button kr-danger-button kr-reset-margin"
                  onClick={handleClearSelectedPart}
                >
                  Clear Part
                </button>
              )}

              {/* Save & Review / Add to Cart buttons */}
              {is3D && !isDesignSaved && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="kr-navbar-button kr-success-button kr-reset-margin"
                >
                  {isSaving ? (
                    <span className="kr-reset">Saving...</span>
                  ) : (
                    <span className="kr-reset">Save & Review</span>
                  )}
                </button>
              )}

              {is3D && isDesignSaved && showAddToCart && (
                <button className="kr-navbar-button kr-addtocart-handel kr-info-button kr-reset-margin kr-addtocart-custom"
                  title={`Add design to cart - Total: ${formatPrice(totalPrice)}`} data-kr-addtocart-handel>
                  <span className="kr-reset">Add to Cart</span>
                </button>
              )}

              {is2D && !isDesignSaved2D && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="kr-navbar-button kr-success-button kr-reset-margin"
                >
                  {isSaving ? (
                    <span className="kr-reset">Saving...</span>
                  ) : (
                    <span className="kr-reset">Save & Review</span>
                  )}
                </button>
              )}

              {is2D && isDesignSaved2D && showAddToCart2D && (
                <button
                  className="kr-navbar-button kr-addtocart-handel kr-info-button kr-reset-margin kr-addtocart-custom"
                  title={`Add design to cart - Total: ${formatPrice(totalPrice)}`} data-kr-addtocart-handel>
                  <span className="kr-reset">Add to Cart</span>
                </button>
              )}



              <button
                className="kr-close-button kr-reset-margin kr-close-handle"
                data-kr-close-handle
              >
                <svg
                  className="kr-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default Topbar;