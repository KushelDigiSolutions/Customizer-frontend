"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import EditorTab from "./2d/EditorTab";
import PreviewTab from "./2d/PreviewTab";
import EditTab from "./2d/EditTab";
import AddTextTab from "./2d/AddTextTab";
import EditTextTab from "./2d/EditTextTab";
import SelectColorsTab from "./2d/SelectColorsTab";
import DynamicClipartTab from "./2d/ClipartTab";
import RightSideImageUpload from "./2d/RightSideImageComponent";
import "./Sidebar.css";
import { use3D } from '@/app/context/3DContext';

const Sidebar = ({
  editor,
  selectedProduct,
  handleAddCustomText,
  customText,
  setCustomText,
  showAddModal,
  showEditModal,
  setShowEditModal,
  setShowAddModal,
  textSize,
  setTextSize,
  textSpacing,
  setTextSpacing,
  textArc,
  setTextArc,
  handleColorChange,
  selectedColor,
  setSelectedColor,
  addEmojiTextToCanvas,
  updateArrange,
  setTextColor,
  setTextFontFamily,
  setFontStyle,
  alignFabricObject,
  bringForward,
  handleAddDesignToCanvas,
  constrainObjectToProduct,
  addIconToCanvas,
  handleAddPatternToCanvas,
  applyClippingToObject,
  setFlipX,
  setFlipY,
  layerManager,
  handleTopColorChange,
  handleBottomColorChange,
  selectedTopColor,
  selectedBottomColor,
  setTextFlipX,
  setTextFlipY,
  handleDynamicLayerChange,
  selectedLayers,
  handleDynamicColorChange,
  currencyCode
}) => {
  const [activeTab, setActiveTab] = useState("editor");
  const [showClipartTab, setShowClipartTab] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(true);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [showBgColorsModal, setShowBgColorsModal] = useState(false);
  const [showrightImage, setShowrightImage] = useState(false);

  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [hasAddedText, setHasAddedText] = useState(false);
  const { threeDtext } = use3D();

  // Memoize tab settings to prevent recreation on every render
  const tabSettings = useMemo(() => {
    return selectedProduct?.tabSettings || {
      aiEditor: true,
      imageEdit: true,
      textEdit: true,
      colors: true,
      clipart: true
    };
  }, [selectedProduct?.tabSettings]);

  // Memoize visible tabs to prevent recreation on every render
  const visibleTabs = useMemo(() => {
    const allTabs = [
      { 
        key: "editor", 
        label: "Editor", 
        iconInactive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1755419667/Frame_4_1_qksveu.svg",
        iconActive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/Frame_4_vzkhrn.svg",
        enabled: tabSettings.aiEditor,
        fallbackKey: "aiEditor"
      },
      { 
        key: "edit", 
        label: "Edit", 
        iconActive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1755419580/pencil-outline_vwjaxg.svg",
        iconInactive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/pencil-outline_c6lwsj.svg",
        enabled: tabSettings.imageEdit,
        fallbackKey: "imageEdit"
      },
      { 
        key: "text", 
        label: "Text", 
        iconActive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1755419580/text-recognition_zcj3e3.svg",
        iconInactive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/text-recognition_emsdp8.svg",
        enabled: tabSettings.textEdit,
        fallbackKey: "textEdit"
      },
      { 
        key: "colors", 
        label: "Colors", 
        iconActive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1755419579/invert-colors_zidv8o.svg",
        iconInactive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/invert-colors_bybi8l.svg",
        enabled: tabSettings.colors,
        fallbackKey: "colors"
      },
      { 
        key: "clipart", 
        label: "Customize", 
        iconActive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1755419579/heart-multiple-outline_ru3ina.svg",
        iconInactive: "https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/heart-multiple-outline_rjqkb7.svg",
        enabled: tabSettings.clipart,
        fallbackKey: "clipart"
      },
    ];

    return allTabs.filter(tab => tab.enabled === true);
  }, [tabSettings]);

  // Memoize canvas content checking functions
  const checkForDesignOnCanvas = useCallback(() => {
    if (!editor?.canvas) return false;

    const objects = editor.canvas.getObjects();
    const designObjects = objects.filter(obj =>
      obj.type === "image" &&
      !obj.isTshirtBase &&
      (obj.name === "design-image" || obj.layerType === "image")
    );

    return designObjects.length > 0;
  }, [editor?.canvas]);

  const checkForTextOnCanvas = useCallback(() => {
    if (!editor?.canvas) return false;

    if (selectedProduct?.ProductType === "3d") {
      return !!threeDtext && threeDtext.trim() !== "";
    }

    const objects = editor.canvas.getObjects();
    const textObjects = objects.filter(obj => obj.type === "i-text");

    return textObjects.length > 0;
  }, [editor?.canvas, selectedProduct?.ProductType, threeDtext]);

  // Set default active tab to the first visible tab - FIXED with proper dependencies
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.find(tab => tab.key === activeTab)) {
      const firstVisibleTab = visibleTabs[0];
      setActiveTab(firstVisibleTab.key);
      
      // Set appropriate modal based on first tab
      if (firstVisibleTab.key === "editor") {
        setShowEditorModal(true);
      }
    }
  }, [selectedProduct?.id, visibleTabs.length]); // Only depend on product ID and visibleTabs length

  // Canvas content checking - FIXED with stable dependencies
  useEffect(() => {
    if (!editor?.canvas) return;

    const checkCanvasContent = () => {
      const designExists = checkForDesignOnCanvas();
      const textExists = checkForTextOnCanvas();

      // Update image state
      if (!designExists && hasUploadedImage) {
        setHasUploadedImage(false);
        if (showImageEditModal) {
          setShowImageEditModal(false);
        }
      } else if (designExists && !hasUploadedImage && activeTab === "edit") {
        setHasUploadedImage(true);
        setShowImageEditModal(true);
      }

      // Update text state
      if (!textExists && hasAddedText) {
        setHasAddedText(false);
        if (showEditModal) {
          setShowEditModal(false);
        }
      } else if (textExists && !hasAddedText && activeTab === "text") {
        setHasAddedText(true);
        setShowAddModal(false);
        setShowEditModal(true);
      }
    };

    const canvas = editor.canvas;
    
    // Debounce the canvas content check to prevent excessive calls
    let timeoutId;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkCanvasContent, 100);
    };

    canvas.on('object:removed', debouncedCheck);
    canvas.on('object:added', debouncedCheck);

    // Initial check
    checkCanvasContent();

    return () => {
      canvas.off('object:removed', debouncedCheck);
      canvas.off('object:added', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, [editor?.canvas, activeTab]); // Removed unstable dependencies

  // Memoize handlers to prevent recreation
  const handleAddCustomTextWithTracking = useCallback(() => {
    if (customText.trim() !== "") {
      handleAddCustomText();
      setHasAddedText(true);
      setShowAddModal(false);
      setShowEditModal(true);
    }
  }, [customText, handleAddCustomText]);

  const update3DText = useCallback(() => {
    setHasAddedText(true);
    setShowAddModal(false);
    setShowEditModal(true);
  }, []);

  const handleTabClick = useCallback((key) => {
    // Reset all modal states
    setShowEditorModal(false);
    setShowImageEditModal(false);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowBgColorsModal(false);
    setShowClipartTab(false);
    setShowrightImage(false);
    setActiveTab(key);

    // Set appropriate modal based on tab
    switch (key) {
      case "editor":
        setShowEditorModal(true);
        break;
      case "edit":
        const designExists = checkForDesignOnCanvas();
        if (designExists) {
          setHasUploadedImage(true);
          setShowImageEditModal(true);
        } else {
          setHasUploadedImage(false);
        }
        break;
      case "text":
        const textExists = checkForTextOnCanvas();
        if (textExists) {
          setHasAddedText(true);
          setShowEditModal(true);
          setShowAddModal(false);
        } else {
          setHasAddedText(false);
          setShowAddModal(true);
          setShowEditModal(false);
        }
        break;
      case "colors":
        setShowBgColorsModal(true);
        break;
      case "clipart":
        setShowClipartTab(true);
        break;
      case "rightImage":
        setShowrightImage(true);
        break;
    }
  }, [checkForDesignOnCanvas, checkForTextOnCanvas]);

  // Memoized handlers for text styling
  const handleApplyTextColor = useCallback((color) => {
    if (!editor?.canvas) return;
    const textObj = editor.canvas.getObjects().find(obj => obj.type === "i-text");
    if (textObj) {
      textObj.set("fill", color);
      editor.canvas.renderAll();
    }
    setTextColor(color);
  }, [editor?.canvas, setTextColor]);

  const handleApplyFontFamily = useCallback((font) => {
    if (!editor?.canvas) return;
    const textObj = editor.canvas.getObjects().find(obj => obj.type === "i-text");
    if (textObj) {
      textObj.set("fontFamily", font);
      editor.canvas.renderAll();
    }
    setTextFontFamily(font);
  }, [editor?.canvas, setTextFontFamily]);

  console.log("Active Tab:", activeTab);
  console.log("showImageEditModal", showImageEditModal);
  console.log("Has Uploaded Image:", hasUploadedImage);

  // Show message if no tabs are enabled
  if (visibleTabs.length === 0) {
    return (
      <div className="kr-sidebar kr-reset-margin-padding">
        <div className="kr-sidebar-empty kr-reset-margin">
          <p className="kr-reset-margin-padding">No customization options available for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kr-sidebar kr-reset-margin-padding">
      <div className="kr-sidebar-menu kr-reset-margin">
        {visibleTabs.map(({ key, label, iconActive, iconInactive }) => (
          <div
            key={key}
            onClick={() => handleTabClick(key)}
            className="kr-tab kr-reset-margin"
          >
            <img
              src={activeTab === key ? iconActive : iconInactive}
              alt={label}
              className="kr-tab-icon kr-reset-margin-padding"
            />
            <p className={`kr-tab-label kr-reset-margin-padding ${activeTab === key ? "kr-active" : ""}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Content - Only render if the tab is enabled */}
      {activeTab === "editor" && tabSettings.aiEditor && showEditorModal && (
        <EditorTab setShowEditorModal={setShowEditorModal} />
      )}

      {activeTab === "edit" && tabSettings.imageEdit && (
        <>
          {!hasUploadedImage && (
            <EditTab
              handleAddDesignToCanvas={handleAddDesignToCanvas}
              editor={editor}
              setShowImageEditModal={setShowImageEditModal}
              setHasUploadedImage={setHasUploadedImage}
              selectedProduct={selectedProduct}
              setActiveTab={setActiveTab}
            />
          )}
          {hasUploadedImage && showImageEditModal && (
            <PreviewTab
              editor={editor}
              setShowImageEditModal={setShowImageEditModal}
              updateArrange={updateArrange}
              constrainObjectToProduct={constrainObjectToProduct}
              applyClippingToObject={applyClippingToObject}
            />
          )}
        </>
      )}

      {activeTab === "text" && tabSettings.textEdit && (
        <>
          {!hasAddedText && showAddModal && (
            <AddTextTab
              setShowAddModal={setShowAddModal}
              customText={customText}
              setCustomText={setCustomText}
              handleAddCustomText={handleAddCustomTextWithTracking}
              update3DText={update3DText}
            />
          )}
          {hasAddedText && showEditModal && (
            <EditTextTab
              setTextColor={setTextColor}
              editor={editor}
              setShowEditModal={setShowEditModal}
              customText={customText}
              setCustomText={setCustomText}
              textSize={textSize}
              setTextSize={setTextSize}
              textSpacing={textSpacing}
              setTextSpacing={setTextSpacing}
              setTextFontFamily={setTextFontFamily}
              setFontStyle={setFontStyle}
              setTextFlipX={setTextFlipX}
              setTextFlipY={setTextFlipY}
              bringForward={bringForward}
              layerManager={layerManager}
            />
          )}
        </>
      )}

      {activeTab === "colors" && tabSettings.colors && showBgColorsModal && (
        <SelectColorsTab
          handleColorChange={handleColorChange}
          selectedColor={selectedColor}
          setShowBgColorsModal={setShowBgColorsModal}
          handleTopColorChange={handleTopColorChange}
          handleBottomColorChange={handleBottomColorChange}
          selectedTopColor={selectedTopColor}
          selectedBottomColor={selectedBottomColor}
          selectedProduct={selectedProduct}
          handleDynamicColorChange={handleDynamicColorChange}
          editor={editor}
          handleApplyTextColor={handleApplyTextColor}
          handleApplyFontFamily={handleApplyFontFamily}
        />
      )}

      {activeTab === "clipart" && tabSettings.clipart && showClipartTab && (
        <DynamicClipartTab
          addEmojiTextToCanvas={addEmojiTextToCanvas}
          setShowClipartTab={setShowClipartTab}
          selectedProduct={selectedProduct}
          handleAddDesignToCanvas={handleAddDesignToCanvas}
          addIconToCanvas={addIconToCanvas}
          editor={editor}
          handleAddPatternToCanvas={handleAddPatternToCanvas}
          handleDynamicLayerChange={handleDynamicLayerChange}
          selectedLayers={selectedLayers}
          currencyCode={currencyCode}
        />
      )}

      {/* Uncomment if you want to use rightImage tab */}
      {/* {activeTab === "rightImage" && showrightImage && (
        <RightSideImageUpload
          editor={editor}
          selectedProduct={selectedProduct}
          layerManager={layerManager}
          setShowrightImage={setShowrightImage}
        />
      )} */}
    </div>
  );
};

export default Sidebar;