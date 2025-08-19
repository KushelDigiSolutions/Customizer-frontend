'use client'

import React, { createContext, useContext, useState, useRef } from "react";

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
    
    // Store the design state at the time of saving
    const savedDesignSnapshot = useRef(null);

    // Function to get current design state
    const getCurrentDesignState = () => {
        return {
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
        };
    };

    // Function to compare current state with saved state
    const hasDesignChanged = () => {
        if (!savedDesignSnapshot.current) return false;
        
        const currentState = getCurrentDesignState();
        const savedState = savedDesignSnapshot.current;
        
        return JSON.stringify(currentState) !== JSON.stringify(savedState);
    };

    // Function to handle design modifications
    const handleDesignModification = () => {
        // Only hide Add to Cart if design was saved and has actually changed
        if (isDesignSaved && hasDesignChanged()) {
            console.log('🔄 Design modified after save, hiding Add to Cart button');
            setIsDesignSaved(false);
            setShowAddToCart(false);
            savedDesignSnapshot.current = null; // Clear the snapshot
        }
    };

    // Function to call when design is successfully saved
    const handleDesignSaved = (designData) => {
        console.log('💾 Design saved successfully, showing Add to Cart button');
        
        // Take a snapshot of current state
        savedDesignSnapshot.current = getCurrentDesignState();
        
        // Set the saved states
        setSavedDesignData(designData);
        setIsDesignSaved(true);
        setShowAddToCart(true);
    };

    // Watch for changes in customization data - but only trigger if design was actually saved
    React.useEffect(() => {
        if (isDesignSaved) {
            // Use a small delay to avoid rapid state changes during save process
            const timeoutId = setTimeout(() => {
                handleDesignModification();
            }, 100);
            
            return () => clearTimeout(timeoutId);
        }
    }, [
        customText, textSize, textSpacing, textArc, textColor, fontFamily, fontStyle,
        textFlipX, textFlipY, flipX, flipY, selectedColor, selectedTopColor,
        selectedBottomColor, selectedLayers, isDesignSaved
    ]);

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
            handleDesignSaved, // Export the new function
            getCurrentDesignState, // Export for external use
        }}>
            {children}
        </twoDcontext.Provider>
    );
};

export const use2D = () => useContext(twoDcontext);