// Simplified Topbar.jsx without 3d functionality

import React, { useEffect } from 'react';
import { use3D } from '../context/3DContext';
import { use2D } from '../context/2DContext';
import './Topbar.css';

const Topbar = ({
  setShowSidebar,
  onSave,
  isSaving,
  selectedProduct
}) => {
  const { handleScreenshot, handleClearSelectedPart, isDesignSaved, showAddToCart } = use3D();
  const { isDesignSaved: isDesignSaved2D, showAddToCart: showAddToCart2D } = use2D();

  const is3D = selectedProduct?.ProductType === "3d";
  const is2D = selectedProduct?.ProductType === "2d";

  // Debug logging
  useEffect(() => {
    console.log('Topbar state debug:', new Date(), {
      is3D,
      showAddToCart,
      isDesignSaved,
      selectedProduct: selectedProduct?.ProductType
    });
  }, [ showAddToCart, isDesignSaved]);

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
          console.log('3D Save result:', result);
          if (result && result.success) {
            console.log('3D Design saved, showing Add to Cart button');
            console.log('Saved data:', result.savedData);
          }
        }
      } else {
        if (onSave) {
          const result = await onSave();
          console.log('2D Save result:', result);
          if (result && result.success) {
            console.log('2D Design saved, showing Add to Cart button');
            console.log('Saved data:', result.savedData);
          }
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Save failed: ' + error.message);
    }
  };

  // // Handle add to cart
  // const handleAddToCart = () => {
  //   // Get saved design data from localStorage
  //   const savedData = localStorage.getItem('krDesignData');
  //   if (savedData) {
  //     const designData = JSON.parse(savedData);
  //     console.log('Adding to cart:', designData);
  //     // Here you can implement the actual add to cart logic
  //     alert('Design added to cart!');
  //   } else {
  //     console.log('No saved design data found in localStorage');
  //     alert('No design data found. Please save your design first.');
  //   }
  // };

  return (
    <div className="kr-topbar kr-reset-margin-padding">
      <div className="kr-topbar-container">

        <div className="kr-logo-section kr-reset-margin-padding">

          {/* <img className='kr-reset-margin-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749337982/Customizer_w0ruf6.png" alt="" /> */}

          <button
            onClick={() => setShowSidebar(prev => !prev)}
            className="kr-menu-button kr-reset-margin"
            aria-label="Toggle Sidebar"
          >
            <svg className="kr-menu-icon kr-reset-margin-padding" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="kr-right-section kr-reset-margin-padding">

          {
            selectedProduct?.ProductType === "3d" && (
              <>
                {/* <button
                  className="kr-navbar-button kr-success-button kr-reset-margin"
                  onClick={handleScreenshot}
                >
                  Save all Views
                </button> */}

                <button
                  className="kr-navbar-button kr-danger-button kr-reset-margin"
                  onClick={handleClearSelectedPart}
                >
                  Clear Part
                </button>
              </>
            )
          }

          {/* Show Save & Review button initially, Add to Cart after save */}
          {/* {console.log('Button render debug - currentShowAddToCart:', currentShowAddToCart)}
          {!currentShowAddToCart ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="kr-navbar-button kr-success-button kr-reset-margin"
              title="Save and review design"
            >
              {isSaving ? (
                <>
                  <span className="kr-reset">Saving...</span>
                </>
              ) : (
                <>
                  <span className="kr-reset">Save & Review</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="kr-navbar-button kr-addtocart-handel kr-success-button kr-reset-margin"
              title="Add design to cart"
            >
              <span className="kr-reset">Add to Cart</span>
            </button>
          )} */}

          {is3D && !isDesignSaved && (
            <button onClick={handleSave}
              disabled={isSaving}
              className="kr-navbar-button kr-success-button kr-reset-margin">{isSaving ? (
                <>
                  <span className="kr-reset">Saving...</span>
                </>
              ) : (
                <>
                  <span className="kr-reset">Save & Review</span>
                </>
              )}</button>
          )}
          {is3D && isDesignSaved && showAddToCart && (
            <button onClick={handleAddToCart}
              className="kr-navbar-button kr-addtocart-handel kr-success-button kr-reset-margin"
              title="Add design to cart"
            >
              <span className="kr-reset">Add to Cart</span>
            </button>
          )}
          {is2D && !isDesignSaved2D && (
            <button onClick={handleSave}
              disabled={isSaving}
              className="kr-navbar-button kr-success-button kr-reset-margin">{isSaving ? (
                <>
                  <span className="kr-reset">Saving...</span>
                </>
              ) : (
                <>
                  <span className="kr-reset">Save & Review</span>
                </>
              )}</button>
          )}
          {is2D && isDesignSaved2D && showAddToCart2D && (
            <button
              className="kr-navbar-button kr-addtocart-handel kr-info-button kr-reset-margin"
              title="Add design to cart"
            >
              <span className="kr-reset">Add to Cart</span>
            </button>
          )}

          {/* <img className='kr-user-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749338383/Buttons_klifkp.png" alt="user" /> */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;