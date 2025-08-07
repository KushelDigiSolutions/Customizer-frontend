// Simplified Topbar.jsx without 3D functionality

import React from 'react';
import { use3D } from '../context/3DContext';

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
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-[1720px] mx-auto">

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">

            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749337982/Customizer_w0ruf6.png" alt="" />

            <button
              onClick={() => setShowSidebar(prev => !prev)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-3">

          {
            selectedProduct?.productType === "3D" && (
              <>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
                  onClick={handleScreenshot}
                >
                  Save All Views
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 h-full rounded mt-2 text-nowrap w-full"
                  onClick={handleClearSelectedPart}
                >
                  Clear Selected Part
                </button>
              </>
            )
          }

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSaving
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
              }`}
            title="Save design"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Save</span>
              </>
            )}
          </button>

          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749338383/Buttons_klifkp.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;