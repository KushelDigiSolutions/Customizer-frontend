"use client";
import React, { useState, useEffect } from "react";
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

  // Get tab settings from selectedProduct, with fallback defaults
  const tabSettings = selectedProduct?.tabSettings || {
    aiEditor: true,
    imageEdit: true,
    textEdit: true,
    colors: true,
    clipart: true
  };

  // Define all possible tabs with their configurations
  const allTabs = [
    { 
      key: "editor", 
      label: "Editor", 
      icon: "Frame_4_vzkhrn",
      enabled: tabSettings.aiEditor,
      fallbackKey: "aiEditor" // Alternative key name mapping
    },
    { 
      key: "edit", 
      label: "Edit", 
      icon: "pencil-outline_c6lwsj",
      enabled: tabSettings.imageEdit,
      fallbackKey: "imageEdit"
    },
    { 
      key: "text", 
      label: "Text", 
      icon: "text-recognition_emsdp8",
      enabled: tabSettings.textEdit,
      fallbackKey: "textEdit"
    },
    { 
      key: "colors", 
      label: "Colors", 
      icon: "invert-colors_bybi8l",
      enabled: tabSettings.colors,
      fallbackKey: "colors"
    },
    { 
      key: "clipart", 
      label: "Customize", 
      icon: "heart-multiple-outline_rjqkb7",
      enabled: tabSettings.clipart,
      fallbackKey: "clipart"
    },
    // Uncomment if you want to use rightImage tab
    // { 
    //   key: "rightImage", 
    //   label: "Right Image", 
    //   icon: "heart-multiple-outline_rjqkb7",
    //   enabled: true // Add this to tabSettings if needed
    // },
  ];

  // Filter tabs based on database settings
  const visibleTabs = allTabs.filter(tab => tab.enabled === true);

  // Set default active tab to the first visible tab
  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.find(tab => tab.key === activeTab)) {
      const firstVisibleTab = visibleTabs[0];
      setActiveTab(firstVisibleTab.key);
      
      // Set appropriate modal based on first tab
      if (firstVisibleTab.key === "editor") {
        setShowEditorModal(true);
      }
    }
  }, [selectedProduct, visibleTabs.length]);

  const checkForDesignOnCanvas = () => {
    if (!editor?.canvas) return false;

    const objects = editor.canvas.getObjects();
    const designObjects = objects.filter(obj =>
      obj.type === "image" &&
      !obj.isTshirtBase &&
      obj.name === "design-image"
    );

    return designObjects.length > 0;
  };

  const checkForTextOnCanvas = () => {
    if (!editor?.canvas) return false;

    if (selectedProduct?.ProductType === "3d") {
      return !!threeDtext && threeDtext.trim() !== "";
    }

    const objects = editor.canvas.getObjects();
    const textObjects = objects.filter(obj => obj.type === "i-text");

    return textObjects.length > 0;
  };

  useEffect(() => {
    if (!editor?.canvas) return;

    const checkCanvasContent = () => {
      const designExists = checkForDesignOnCanvas();
      const textExists = checkForTextOnCanvas();

      if (!designExists && hasUploadedImage) {
        setHasUploadedImage(false);
        if (showImageEditModal) {
          setShowImageEditModal(false);
        }
      }

      if (!textExists && hasAddedText) {
        setHasAddedText(false);
        if (showEditModal) {
          setShowEditModal(false);
        }
      }

      if (textExists && !hasAddedText && activeTab === "text") {
        setHasAddedText(true);
        setShowAddModal(false);
        setShowEditModal(true);
      }

      if (designExists && !hasUploadedImage && activeTab === "edit") {
        setHasUploadedImage(true);
        setShowImageEditModal(true);
      } else {
        setHasUploadedImage(false);
      }
    };

    const canvas = editor.canvas;
    canvas.on('object:removed', checkCanvasContent);
    canvas.on('object:added', () => {
      setTimeout(checkCanvasContent, 100);
    });

    checkCanvasContent();

    return () => {
      canvas.off('object:removed', checkCanvasContent);
      canvas.off('object:added', checkCanvasContent);
    };
  }, [editor, hasUploadedImage, hasAddedText, showImageEditModal, showEditModal, activeTab]);

  const handleAddCustomTextWithTracking = () => {
    if (customText.trim() !== "") {
      handleAddCustomText();
      setHasAddedText(true);
      setShowAddModal(false);
      setShowEditModal(true);
    }
  };

  const update3DText = () => {
    setHasAddedText(true);
    setShowAddModal(false);
    setShowEditModal(true);
  }

  const handleTabClick = (key) => {
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
  };

  // Debug logging
  // useEffect(() => {
  //   console.log('📋 Tab Settings:', tabSettings);
  //   console.log('👁️ Visible Tabs:', visibleTabs.map(tab => tab.key));
  //   console.log('✨ Active Tab:', activeTab);
  // }, [tabSettings, visibleTabs, activeTab]);

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
        {visibleTabs.map(({ key, label, icon }) => (
          <div
            key={key}
            onClick={() => handleTabClick(key)}
            className="kr-tab kr-reset-margin-padding"
          >
            <img
              src={`https://res.cloudinary.com/dd9tagtiw/image/upload/v1749641805/${icon}.svg`}
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