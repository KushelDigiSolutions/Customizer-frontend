'use client'

import React, { createContext, useContext, useState } from "react";

const twoDcontext = createContext();

export const TwoDProvider = ({ children }) => {

    // Text customization states
    const [customText, setCustomText] = useState("");
    const [textSize, setTextSize] = useState(28);
    const [textSpacing, setTextSpacing] = useState(0);
    const [textArc, setTextArc] = useState(0);

    // Text properties
    const [textColor, setTextColor] = useState("#000");
    const [fontFamily, setFontFamily] = useState("Ubuntu");
    const [fontStyle, setFontStyle] = useState("normal");
    const [textFlipX, setTextFlipX] = useState(false);
    const [textFlipY, setTextFlipY] = useState(false);

    // Image properties  
    const [flipX, setFlipX] = useState(false);
    const [flipY, setFlipY] = useState(false);
    const [selectedColor, setSelectedColor] = useState({ color: "#ffffff", name: "White" });

    // NEW: Gradient states
    const [selectedTopColor, setSelectedTopColor] = useState(null);
    const [selectedBottomColor, setSelectedBottomColor] = useState(null);

    // Dynamic layer states for shoes
    const [selectedLayers, setSelectedLayers] = useState({});

    // UI states
    const [showAddModal, setShowAddModal] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showChatBox, setShowChatBox] = useState(false);

    // Save states
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Layer manager state
    const [layerManager, setLayerManager] = useState(null);

    return (
        <twoDcontext.Provider value={{
            customText, setCustomText,
            textSize, setTextSize,
            textSpacing, setTextSpacing,
            textArc, setTextArc,
            textColor, setTextColor,
            fontFamily, setFontFamily,
            fontStyle, setFontStyle,
            textFlipX, setTextFlipX,
            textFlipY, setTextFlipY,
            flipX, setFlipX,
            flipY, setFlipY,
            selectedColor, setSelectedColor,
            selectedTopColor, setSelectedTopColor,
            selectedBottomColor, setSelectedBottomColor,
            selectedLayers, setSelectedLayers,
            showAddModal, setShowAddModal,
            showEditModal, setShowEditModal,
            showSidebar, setShowSidebar,
            showChatBox, setShowChatBox,
            saveSuccess, setSaveSuccess,
            isSaving, setIsSaving,
            currentProductId, setCurrentProductId,
            layerManager, setLayerManager
        }}>
            {children}
        </twoDcontext.Provider>
    );
};

export const use2D = () => useContext(twoDcontext);
