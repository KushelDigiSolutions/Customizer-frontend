// Simplified Topbar.jsx without 3D functionality

import React from 'react';
import { use3D } from '../context/3DContext';
import './Topbar.css';

const Topbar = ({
  setShowSidebar,
  onSave,
  isSaving,
  // selectedProduct
}) => {
  const { handleScreenshot, handleClearSelectedPart, selectedProduct, threeDscreenshots } = use3D();

  // Handle save for both 2D and 3D
  const handleSave = async () => {
    if (selectedProduct?.productType === "3D") {
      // Wait for screenshots to finish
      const screenshots = await handleScreenshot();

      if (!screenshots || screenshots.length === 0) {
        alert("Screenshots not ready yet. Please try again.");
        return;
      }

      // Pass screenshots to save logic
      if (onSave) {
        onSave(screenshots);
      }
    } else {
      if (onSave) {
        onSave();
      }
    }
  };



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
            selectedProduct?.productType === "3D" && (
              <>
                <button
                  className="kr-navbar-button kr-success-button kr-reset-margin"
                  onClick={handleScreenshot}
                >
                  Save all Views
                </button>

                <button
                  className="kr-navbar-button kr-danger-button kr-reset-margin"
                  onClick={handleClearSelectedPart}
                >
                  Clear Part
                </button>
              </>
            )
          }

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="kr-navbar-button kr-info-button kr-reset-margin"
            title="Save design"
          >
            {isSaving ? (
              <>
                <span className="kr-reset">Adding...</span>
              </>
            ) : (
              <>
                <span className="kr-reset">Add to Cart</span>
              </>
            )}
          </button>

          {/* <img className='kr-user-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749338383/Buttons_klifkp.png" alt="user" /> */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;