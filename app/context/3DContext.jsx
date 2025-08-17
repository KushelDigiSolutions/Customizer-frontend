"use client";

import React, { createContext, useContext, useRef, useState } from "react";

const threeDcontext = createContext();

export const ThreeDProvider = ({ children }) => {
  // State to control screenshots modal
  const [showScreenshotsModal, setShowScreenshotsModal] = useState(false);
  const [threeDcolor, setthreeDColor] = useState("#ffffff");
  const [threeDtexture, setthreeDTexture] = useState(null);
  const [threeDselectedPart, setthreeDSelectedPart] = useState("Front");

  const [threeDtextFontFamily, setthreeDTextFontFamily] = useState("Arial");

  const [threeDzoom, setthreeDZoom] = useState(1);
  const [threeDoffsetX, setthreeDOffsetX] = useState(0);
  const [threeDoffsetY, setthreeDOffsetY] = useState(0);

  const [threeDtext, setthreeDText] = useState("");
  const [threeDtextTexture, setthreeDTextTexture] = useState(null);
  const [threeDtextColor, setthreeDTextColor] = useState("#000000");
  const [threeDoutlineColor, setthreeDOutlineColor] = useState("#ffffff");

  const [threeDtextScale, setthreeDTextScale] = useState(1);
  const [threeDtextPosX, setthreeDTextPosX] = useState(0.5);
  const [threeDtextPosY, setthreeDTextPosY] = useState(0.5);

  const [threeDscreenshots, setthreeDScreenshots] = useState([]);
  const [threeDloading, setthreeDLoading] = useState(false);

  const [threeDtextureMode, setthreeDTextureMode] = useState("full");
  const [threeDlogoScale, setthreeDLogoScale] = useState(0.5);
  const [threeDlogoPosX, setthreeDLogoPosX] = useState(0.5);
  const [threeDlogoPosY, setthreeDLogoPosY] = useState(0.5);

  const [threeDtextFontWeight, setthreeDTextFontWeight] = useState("normal");
  const [threeDtextFontStyle, setthreeDTextFontStyle] = useState("normal");

  const [customizationData, setCustomizationData] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // New state for add to cart functionality
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [isDesignSaved, setIsDesignSaved] = useState(false);
  const [savedDesignData, setSavedDesignData] = useState(null);

  const screenshotRef = useRef();

  // Function to check if design has been modified after save
  const checkDesignModification = () => {
    if (!isDesignSaved) return false;

    // Compare current customization data with saved data
    const currentData = JSON.stringify(customizationData);
    const savedData = JSON.stringify(savedDesignData?.customizationData);

    return currentData !== savedData;
  };

  // Function to handle design modifications
  const handleDesignModification = () => {
    if (isDesignSaved && checkDesignModification()) {
      setIsDesignSaved(false);
      setShowAddToCart(false);
    }
  };

  // Watch for changes in customization data
  // Temporarily disabled to fix Add to Cart button issue
  React.useEffect(() => {
    handleDesignModification();
  }, [
    customizationData,
    isDesignSaved,
    threeDcolor,
    threeDtexture,
    threeDselectedPart,
    threeDtextFontFamily,
    threeDzoom,
    threeDoffsetX,
    threeDoffsetY,
    threeDtext,
    threeDtextTexture,
    threeDtextColor,
    threeDoutlineColor,
    threeDtextScale,
    threeDtextPosX,
    threeDtextPosY,
    threeDtextureMode,
    threeDlogoScale,
    threeDlogoPosX,
    threeDlogoPosY,
    threeDtextFontWeight,
    threeDtextFontStyle,
  ]);

  const handleScreenshot = async () => {
    if (screenshotRef.current) {
      setthreeDLoading(true);

      try {
        const capturedImages = await screenshotRef.current.captureAll();
        setthreeDScreenshots(capturedImages);

        setCustomizationData((prev) => ({
          ...prev,
          screenshots: capturedImages.map((img) => ({
            angle: img.angle,
            image: img.image,
          })),
        }));

        return capturedImages;
      } catch (error) {
        console.error("Error capturing screenshots:", error);
        return [];
      } finally {
        setthreeDLoading(false);
      }
    }
    return [];
  };

  const handleClearSelectedPart = () => {
    setCustomizationData((prev) => {
      const newParts = { ...prev.parts };
      delete newParts[threeDselectedPart];
      return {
        ...prev,
        parts: newParts,
      };
    });

    // Get base color for selected part from customizationData
    const baseColor =
      customizationData?.baseColors?.[threeDselectedPart] || "#ffffff";
    setthreeDColor(baseColor);

    setthreeDTexture(null);
    setthreeDText("");
    setthreeDTextTexture(null);
    setthreeDTextColor("#000000");
    setthreeDOutlineColor("#ffffff");
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  React.useEffect(() => {
    if (savedDesignData) {
      setIsDesignSaved(true);
      setShowAddToCart(true);
      setShowScreenshotsModal(true); // Show screenshots modal after save
    }
  }, [savedDesignData]);

  return (
    <threeDcontext.Provider
      value={{
        threeDcolor,
        setthreeDColor,
        threeDtexture,
        setthreeDTexture,
        threeDselectedPart,
        setthreeDSelectedPart,
        threeDzoom,
        setthreeDZoom,
        threeDoffsetX,
        setthreeDOffsetX,
        threeDoffsetY,
        setthreeDOffsetY,
        threeDtext,
        setthreeDText,
        threeDtextTexture,
        setthreeDTextTexture,
        threeDtextColor,
        setthreeDTextColor,
        threeDoutlineColor,
        setthreeDOutlineColor,
        threeDtextScale,
        setthreeDTextScale,
        threeDtextPosX,
        setthreeDTextPosX,
        threeDtextPosY,
        setthreeDTextPosY,
        threeDscreenshots,
        setthreeDScreenshots,
        threeDloading,
        setthreeDLoading,
        threeDtextureMode,
        setthreeDTextureMode,
        threeDlogoScale,
        setthreeDLogoScale,
        threeDlogoPosX,
        setthreeDLogoPosX,
        threeDlogoPosY,
        setthreeDLogoPosY,
        customizationData,
        setCustomizationData,
        handleScreenshot,
        handleClearSelectedPart,
        screenshotRef,
        selectedProduct,
        setSelectedProduct,
        threeDtextFontFamily,
        threeDtextFontWeight,
        setthreeDTextFontWeight,
        threeDtextFontStyle,
        setthreeDTextFontStyle,
        setthreeDTextFontFamily,
        // New state for add to cart functionality
        showAddToCart,
        setShowAddToCart,
        isDesignSaved,
        setIsDesignSaved,
        savedDesignData,
        setSavedDesignData,
        handleDesignModification,
        previewUrl, setPreviewUrl,
        selectedFile, setSelectedFile,
        showScreenshotsModal, setShowScreenshotsModal,
      }}
    >
      {children}
    </threeDcontext.Provider>
  );
};

export const use3D = () => useContext(threeDcontext);
