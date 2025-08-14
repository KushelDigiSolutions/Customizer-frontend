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
    const [showBgColorsModal, setShowBgColorsModal] = useState(false);

    // Save states
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    // Layer manager state
    const [layerManager, setLayerManager] = useState(null);

    // New state for add to cart functionality
    const [showAddToCart, setShowAddToCart] = useState(false);
    const [isDesignSaved, setIsDesignSaved] = useState(false);
    const [savedDesignData, setSavedDesignData] = useState(null);

    // Function to check if design has been modified after save
    const checkDesignModification = () => {
        if (!isDesignSaved) return false;

        // Compare current customization data with saved data
        const currentData = JSON.stringify({
            customText,
            textSize,
            textSpacing,
            textArc,
            textColor,
            fontFamily,
            fontStyle,
            textFlipX,
            textFlipY,
            flipX,
            flipY,
            selectedColor,
            selectedTopColor,
            selectedBottomColor,
            selectedLayers
        });
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

    React.useEffect(() => {
        if (savedDesignData) {
            setIsDesignSaved(true);
            setShowAddToCart(true);
        }
    }, [savedDesignData]);

    // Watch for changes in customization data
    // Temporarily disabled to fix Add to Cart button issue
    React.useEffect(() => {
        handleDesignModification();
    }, [customText, textSize, textSpacing, textArc, textColor, fontFamily, fontStyle, textFlipX, textFlipY, flipX, flipY, selectedColor, selectedTopColor, selectedBottomColor, selectedLayers, isDesignSaved]);

    return (
        <twoDcontext.Provider value={{
            // Text customization states
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
            showBgColorsModal, setShowBgColorsModal,
            saveSuccess, setSaveSuccess,
            isSaving, setIsSaving,
            currentProductId, setCurrentProductId,
            layerManager, setLayerManager,
            // New state for add to cart functionality
            showAddToCart, setShowAddToCart,
            isDesignSaved, setIsDesignSaved,
            savedDesignData, setSavedDesignData,
            handleDesignModification,
        }}>
            {children}
        </twoDcontext.Provider>
    );
};

export const use2D = () => useContext(twoDcontext);
