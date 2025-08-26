"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const threeDcontext = createContext();

export const ThreeDProvider = ({ children }) => {
  // State to control screenshots modal
  const [showScreenshotsModal, setShowScreenshotsModal] = useState(false);
  const [threeDcolor, setthreeDColor] = useState("#ffffff");
  const [threeDtexture, setthreeDTexture] = useState(null);
  const [threeDselectedPart, setthreeDSelectedPart] = useState('');

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

  const [activeVariants, setActiveVariants] = useState({});

  // Initialize from selectedProduct defaults whenever product changes
  useEffect(() => {
    if (selectedProduct?.variants) {
      const defaults = {};
      selectedProduct.variants.forEach(group => {
        const def = group.options.find(o => o.isDefault) || group.options[0];
        defaults[group.category] = def.id;
      });
      setActiveVariants(defaults);
    }
  }, [selectedProduct]);


  const screenshotRef = useRef();

  const controlsRef = useRef();          // OrbitControls ref
  const [isRotating, setIsRotating] = useState(false); // rotation state

  // Toggle rotation
  const toggleRotation = () => {
    if (controlsRef.current) {
      const newState = !isRotating;
      controlsRef.current.autoRotate = newState;
      setIsRotating(newState);
    }
  };

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
      setShowScreenshotsModal(true);
    }
  }, [savedDesignData]);

  const modelRef = useRef(null);
  const originalPositions = useRef(new Map());
  const [isExploded, setIsExploded] = useState(false);

  const registerModel = (model) => {
    modelRef.current = model;

    model.traverse((child) => {
      if (child.isMesh && !originalPositions.current.has(child.uuid)) {
        originalPositions.current.set(child.uuid, child.position.clone());
      }
    });
  };

  const directionVectors = {
    top: new THREE.Vector3(0, 1, 0),
    bottom: new THREE.Vector3(0, -1, 0),
    left: new THREE.Vector3(-1, 0, 0),
    right: new THREE.Vector3(1, 0, 0),
  };

  const explodeDistance = 0.8;

  function getDirectionForMesh(meshName, selectedProduct) {
    const explodeConfig = selectedProduct?.explodeConfig;
    if (!selectedProduct?.variants || !explodeConfig) return null;
    for (const [dir, categories] of Object.entries(explodeConfig)) {
      for (const cat of categories) {
        const variant = selectedProduct.variants.find(v => v.category === cat);
        if (variant) {
          if (variant.options.some(opt => meshName.includes(opt.meshName) && opt.meshName)) {
            return dir;
          }
        }
      }
    }
    return null;
  }

  const toggleExplode = () => {
    if (!modelRef.current) return;

    setIsExploded((prev) => {
      const newState = !prev;

      modelRef.current.traverse((child) => {
        if (child.isMesh && selectedProduct?.variants) {
          const dir = getDirectionForMesh(child.name, selectedProduct);
          if (dir && directionVectors[dir]) {
            const targetPos = child.position.clone();
            if (newState) {
              // Animate to exploded position
              const explodeVec = directionVectors[dir].clone().multiplyScalar(explodeDistance);
              gsap.to(child.position, {
                x: targetPos.x + explodeVec.x,
                y: targetPos.y + explodeVec.y,
                z: targetPos.z + explodeVec.z,
                duration: 0.7,
                ease: "power2.out"
              });
            } else {
              // Animate back to original position
              const original = originalPositions.current.get(child.uuid);
              if (original) {
                gsap.to(child.position, {
                  x: original.x,
                  y: original.y,
                  z: original.z,
                  duration: 0.7,
                  ease: "power2.inOut"
                });
              }
            }
          }
        }
      });

      return newState;
    });
  };

  useEffect(() => {
    if (selectedProduct?.parts && Array.isArray(selectedProduct.parts) && selectedProduct.parts.length > 0) {
      setthreeDSelectedPart(selectedProduct.parts[0]);
    }
    if (selectedProduct?.variants) {
      const defaults = {};
      selectedProduct.variants.forEach(group => {
        const def = group.options.find(o => o.isDefault) || group.options[0];
        defaults[group.category] = def.id;
      });
      setActiveVariants(defaults);
    }
  }, [selectedProduct]);

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
        activeVariants,
        setActiveVariants,
        controlsRef,
        isRotating, setIsRotating,
        toggleRotation,
        registerModel,
        toggleExplode,
        isExploded,
      }}
    >
      {children}
    </threeDcontext.Provider>
  );
};

export const use3D = () => useContext(threeDcontext);
