import React, { useState, useEffect } from 'react';
import FontSelector from './FontSelector';
import CustomColorSwatch from './CustomColorSwatch';
import { use2D } from '../../context/2DContext';
import { use3D } from '@/app/context/3DContext';
import './EditTextTab.css';

const EditTextTab = ({ editor, layerManager }) => {
    const {
        customText, setCustomText,
        textSize, setTextSize,
        textSpacing, setTextSpacing,
        textArc, setTextArc,
        textColor, setTextColor,
        fontFamily, setFontFamily,
        fontStyle, setFontStyle,
        textFlipX, setTextFlipX,
        textFlipY, setTextFlipY,
        showEditModal, setShowEditModal,
        showAddModal, setShowAddModal
    } = use2D();

    const {
        threeDtext, setthreeDText,
        threeDtextFontFamily, setthreeDTextFontFamily,
        threeDtextColor, setthreeDTextColor,
        threeDoutlineColor, setthreeDOutlineColor,
        threeDtextScale, setthreeDTextScale,
        threeDtextPosX, setthreeDTextPosX,
        threeDtextPosY, setthreeDTextPosY,
        selectedProduct, threeDtextFontWeight,
        setthreeDTextFontWeight,
        threeDtextFontStyle,
        setthreeDTextFontStyle,
    } = use3D();

    const [showColorTab, setShowColorTab] = useState(false);
    const [showTextSelectTab, setShowTextSelectTab] = useState(false);
    const [currentFont, setCurrentFont] = useState('Arial');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [activeTextObject, setActiveTextObject] = useState(null);
    const [textObjectsCount, setTextObjectsCount] = useState(0);

    // Get all i-text objects from canvas (excluding emojis)
    const getAllTextObjects = () => {
        if (!editor?.canvas) return [];
        return editor.canvas.getObjects().filter(obj =>
            obj.type === 'i-text' && !obj.isEmoji
        );
    };

    // Get the most recently added or selected text object
    const getActiveTextObject = () => {
        if (!editor?.canvas) return null;

        const textObjects = getAllTextObjects();

        if (textObjects.length === 0) {
            return null;
        }

        // Return the last added text object (highest index)
        return textObjects[textObjects.length - 1];
    };

    // Create a new text object with proper layer management
    const createNewTextObject = () => {
        if (!editor?.canvas) return null;

        import("fabric").then((fabric) => {
            const canvas = editor.canvas;
            const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);

            if (!productImage) {
                console.error('❌ No base product found for text placement');
                return null;
            }

            const productBounds = productImage.getBoundingRect();

            const newTextObj = new fabric.IText('Add your text here', {
                left: productBounds.left + productBounds.width * 0.25,
                top: productBounds.top + productBounds.height / 3.5,
                originX: "center",
                originY: "center",
                fontSize: textSize || 28,
                fill: currentColor || '#000000',
                fontFamily: currentFont || 'Arial',
                fontStyle: 'normal',
                selectable: false, // Consistent with parent component
                evented: false,    // Consistent with parent component
                hasControls: false,
                hasBorders: false,
                moveCursor: "default",
                lockMovementX: true,  // Consistent with parent component
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                editable: false // Consistent with parent component
            });

            canvas.add(newTextObj);

            // Apply proper layer management using the parent's layer system
            if (layerManager) {
                layerManager.setObjectLayer(newTextObj);
                layerManager.arrangeCanvasLayers();
            }

            setActiveTextObject(newTextObj);
            console.log('✅ New text object created with proper layering (zIndex: 5)');

            return newTextObj;
        });
    };

    // Auto-detect and sync with text objects
    useEffect(() => {
        if (!editor?.canvas) return;

        const syncWithTextObjects = () => {
            const textObjects = getAllTextObjects();
            const currentCount = textObjects.length;

            // Update count to trigger re-renders when text objects change
            setTextObjectsCount(currentCount);

            let targetTextObj = getActiveTextObject();

            // If we have text objects, work with the most recent one
            if (targetTextObj && targetTextObj !== activeTextObject) {
                setActiveTextObject(targetTextObj);

                // Sync all properties from the detected text object
                if (targetTextObj.text !== customText) {
                    setCustomText(targetTextObj.text || 'Add your text here');
                }
                setCurrentFont(targetTextObj.fontFamily || 'Arial');
                setCurrentColor(targetTextObj.fill || '#000000');
                setTextSize(targetTextObj.fontSize || 28);
                setTextSpacing(Math.round((targetTextObj.charSpacing || 0) / 10));
                setFontStyle(targetTextObj.fontWeight || 'normal');
                setTextFlipX(targetTextObj.flipX || false);
                setTextFlipY(targetTextObj.flipY || false);
                setTextColor(targetTextObj.fill || '#000000');

                console.log('🔄 Synced with existing text object:', targetTextObj.text);
            }
        };

        // Initial sync
        syncWithTextObjects();

        // Listen for canvas events to detect changes
        const handleCanvasEvents = () => {
            setTimeout(syncWithTextObjects, 50); // Small delay to ensure objects are properly added
        };

        // Monitor canvas changes
        editor.canvas.on('object:added', handleCanvasEvents);
        editor.canvas.on('object:removed', handleCanvasEvents);
        editor.canvas.on('object:modified', handleCanvasEvents);
        editor.canvas.on('path:created', handleCanvasEvents);

        // Cleanup
        return () => {
            if (editor?.canvas) {
                editor.canvas.off('object:added', handleCanvasEvents);
                editor.canvas.off('object:removed', handleCanvasEvents);
                editor.canvas.off('object:modified', handleCanvasEvents);
                editor.canvas.off('path:created', handleCanvasEvents);
            }
        };
    }, [editor?.canvas, activeTextObject, layerManager]);

    // Apply changes to the active text object
    const applyToTextObject = (updateFn) => {
        let textObj = activeTextObject || getActiveTextObject();

        if (!textObj) {
            // If no text object exists, create one
            textObj = createNewTextObject();
            if (!textObj) return;
        }

        if (textObj) {
            updateFn(textObj);
            editor.canvas.renderAll();

            // Ensure proper layering after any change
            if (layerManager) {
                setTimeout(() => {
                    layerManager.arrangeCanvasLayers();
                }, 10);
            }
        }
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setCustomText(newText);

        applyToTextObject((textObj) => {
            textObj.set('text', newText);
        });
    };

    const handleFontSelection = (font) => {
        if (is3D) {
            setthreeDTextFontFamily(font);
        } else {
            setFontFamily(font);
            setCurrentFont(font);
        }
        setShowTextSelectTab(false);
    };

    const handleColorSelection = (color) => {
        if (is3D) {
            setthreeDTextColor(color);
        } else {
            setTextColor(color);
            setCurrentColor(color);
        }
        setShowColorTab(false);
    };

    const handleFontStyleChange = (styleType) => {
        if (is3D) {
            // For 3D, update context state for fontWeight/fontStyle
            if (styleType === 'bold') {
                setthreeDTextFontWeight(prev => prev === 'bold' ? 'normal' : 'bold');
            } else if (styleType === 'italic') {
                setthreeDTextFontStyle(prev => prev === 'italic' ? 'normal' : 'italic');
            }
        } else {
            // 2D logic (fabric.js)
            applyToTextObject((textObj) => {
                if (styleType === 'bold') {
                    const currentWeight = textObj.fontWeight;
                    const newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
                    textObj.set('fontWeight', newWeight);
                    setFontStyle(newWeight);
                } else if (styleType === 'italic') {
                    const currentStyle = textObj.fontStyle;
                    const newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
                    textObj.set('fontStyle', newStyle);
                    setFontStyle(newStyle);
                }
            });
        }
    };

    const handleFlipX = () => {
        applyToTextObject((textObj) => {
            const currentFlipX = textObj.flipX;
            const newFlipX = !currentFlipX;
            textObj.set('flipX', newFlipX);
            setTextFlipX(newFlipX);
        });
    };

    const handleFlipY = () => {
        applyToTextObject((textObj) => {
            const currentFlipY = textObj.flipY;
            const newFlipY = !currentFlipY;
            textObj.set('flipY', newFlipY);
            setTextFlipY(newFlipY);
        });
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setTextSize(newSize);

        applyToTextObject((textObj) => {
            textObj.set("fontSize", newSize);
        });
    };

    const handleSpacingChange = (e) => {
        const newSpacing = parseInt(e.target.value);
        setTextSpacing(newSpacing);

        applyToTextObject((textObj) => {
            textObj.set("charSpacing", newSpacing * 10);
        });
    };

    // Enhanced arrange functions that work with the layer system
    const handleBringForward = () => {
        const textObj = activeTextObject || getActiveTextObject();
        if (textObj && editor?.canvas) {
            // Use the parent's bringForward if available, otherwise use canvas method
            if (bringForward) {
                bringForward();
            } else {
                editor.canvas.bringForward(textObj);
                editor.canvas.renderAll();
            }

            // Re-apply layer management after arrange
            if (layerManager) {
                setTimeout(() => {
                    layerManager.arrangeCanvasLayers();
                }, 50);
            }
        }
    };

    const handleArrangeAction = (action) => {
        const textObj = activeTextObject || getActiveTextObject();
        if (!textObj || !editor?.canvas) return;

        const canvas = editor.canvas;

        switch (action) {
            case 'bringToFront':
                canvas.bringToFront(textObj);
                break;
            case 'bringForward':
                canvas.bringForward(textObj);
                break;
            case 'sendBackward':
                canvas.sendBackwards(textObj);
                break;
            case 'sendToBack':
                canvas.sendToBack(textObj);
                break;
        }

        textObj.setCoords();
        canvas.renderAll();

        // Re-apply layer management to maintain proper order
        if (layerManager) {
            setTimeout(() => {
                layerManager.arrangeCanvasLayers();
            }, 50);
        }
    };

    const is3D = selectedProduct?.productType === "3D";
    const fontValue = is3D ? threeDtextFontFamily : currentFont;
    const colorValue = is3D ? threeDtextColor : currentColor;

    const shouldShowEditText = !showTextSelectTab && !showColorTab;

    return (
        <>
            {shouldShowEditText && (
                <div className="kr-edit-text-container kr-reset-margin-padding">

                    <div className='kr-edit-text-header kr-reset-margin'>
                        <div className='kr-edit-text-title-section kr-reset-margin-padding'>
                            <h3 className='kr-edit-text-title kr-reset-margin-padding'>Edit text</h3>
                            {activeTextObject && (
                                <span className='kr-edit-text-status kr-detected kr-reset-margin-padding'>
                                    ● Auto-detected ({textObjectsCount} text{textObjectsCount !== 1 ? 's' : ''})
                                </span>
                            )}
                            {!activeTextObject && textObjectsCount === 0 && (
                                <span className='kr-edit-text-status kr-ready kr-reset-margin-padding'>
                                    ● Ready to create
                                </span>
                            )}
                        </div>
                        <div className="kr-edit-text-close kr-reset-margin-padding" onClick={() => setShowEditModal(false)}>
                            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                        </div>
                    </div>
                    <hr className="kr-edit-text-divider kr-reset-margin-padding" />

                    <div className='kr-edit-text-content kr-reset-margin'>
                        <input
                            type="text"
                            value={customText}
                            onChange={handleTextChange}
                            placeholder="Add Headline"
                            className="kr-edit-text-input kr-reset-margin"
                        />
                        {!activeTextObject && (
                            <p className="kr-edit-text-hint kr-reset-margin-padding">
                                💡 Type text above to automatically create a text object
                            </p>
                        )}
                    </div>

                    {
                        selectedProduct.productType === "2D" && (
                            <>
                                <hr className="kr-edit-text-divider kr-reset-margin-padding" />

                                <div className='kr-edit-text-section kr-reset-margin-padding'>
                                    <div className='kr-edit-text-title-section kr-reset-margin-padding'>
                                        <h3 className='kr-edit-text-section-title kr-reset-margin-padding'>Flip</h3>
                                    </div>
                                    <div className="kr-edit-text-controls kr-reset-margin-padding">
                                        <img
                                            onClick={handleFlipX}
                                            className='kr-edit-text-control-icon'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507255/tune-vertical_ezas8p.png"
                                            alt="flip horizontal"
                                        />
                                        <img
                                            onClick={handleFlipY}
                                            className='kr-edit-text-control-icon'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/flip-vertical_ajs5ur.png"
                                            alt="flip vertical"
                                        />
                                    </div>
                                </div>

                            </>
                        )
                    }


                    <hr className="kr-edit-text-divider kr-reset-margin-padding" />

                    <div className='kr-edit-text-font-section kr-reset-margin'>
                        <div className='kr-edit-text-font-header kr-reset-margin-padding'>
                            <h3 className='kr-edit-text-section-title kr-reset-margin-padding'>Font</h3>
                        </div>
                        <div className="kr-edit-text-font-controls kr-reset-margin-padding">
                            <div
                                onClick={() => setShowTextSelectTab(true)}
                                className='kr-edit-text-font-selector kr-reset-margin'
                            >
                                <span className='kr-edit-text-font-name kr-reset-margin' >
                                    {fontValue}
                                </span>
                                <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750138078/chevron-right_p6kmcp.svg" alt="arrow" className="kr-edit-text-font-arrow" />
                            </div>


                            <img
                                className='kr-edit-text-style-icon kr-reset-margin-padding'
                                onClick={() => handleFontStyleChange('bold')}
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750137959/alpha-b_aygypw.svg"
                                alt="bold"
                            />
                            <img
                                className='kr-edit-text-style-icon kr-reset-margin-padding'
                                onClick={() => handleFontStyleChange('italic')}
                                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1750137959/format-italic_d9ndma.svg"
                                alt="italic"
                            />

                            <div
                                className="kr-edit-text-color-swatch kr-reset-margin-padding"
                                style={{ backgroundColor: colorValue }}
                                onClick={() => setShowColorTab(true)}
                            />

                        </div>
                    </div>

                    <hr className="kr-edit-text-divider kr-reset-margin-padding" />

                    <div className="kr-edit-text-3d-section kr-reset-margin">
                        <div className="kr-edit-text-3d-controls kr-reset-margin-padding">
                            <div className="kr-edit-text-3d-control kr-reset-margin-padding">
                                <label className="kr-edit-text-3d-label kr-reset-margin-padding">3D Text Scale: {threeDtextScale.toFixed(2)}</label>
                                <input type="range" min="0.2" max="2" step="0.05" value={threeDtextScale} onChange={(e) => setthreeDTextScale(parseFloat(e.target.value))} className="kr-edit-text-3d-range" />
                            </div>
                            <div className="kr-edit-text-3d-control kr-reset-margin-padding">
                                <label className="kr-edit-text-3d-label kr-reset-margin-padding">3D Text Position X: {threeDtextPosX.toFixed(2)}</label>
                                <input type="range" min="0" max="1" step="0.01" value={threeDtextPosX} onChange={(e) => setthreeDTextPosX(parseFloat(e.target.value))} className="kr-edit-text-3d-range" />
                            </div>
                            <div className="kr-edit-text-3d-control kr-reset-margin-padding" >
                                <label className="kr-edit-text-3d-label kr-reset-margin-padding">3D Text Position Y: {threeDtextPosY.toFixed(2)}</label>
                                <input type="range" min="0" max="1" step="0.01" value={threeDtextPosY} onChange={(e) => setthreeDTextPosY(parseFloat(e.target.value))} className="kr-edit-text-3d-range" />
                            </div>
                        </div>
                    </div>

                    <div className="kr-edit-text-3d-color-section kr-reset-margin">
                        <div className="kr-edit-text-3d-color-controls kr-reset-margin-padding">
                            <label className="kr-edit-text-3d-color-label kr-reset-margin-padding">Text Color:</label>
                            <input
                                type="color"
                                value={threeDtextColor}
                                onChange={(e) => setthreeDTextColor(e.target.value)}
                                className="kr-edit-text-3d-color-input kr-reset-margin-padding"
                            />

                            <label className="kr-edit-text-3d-color-label kr-reset-margin-padding">Outline Color:</label>
                            <input
                                type="color"
                                value={threeDoutlineColor}
                                onChange={(e) => setthreeDOutlineColor(e.target.value)}
                                className="kr-edit-text-3d-color-input kr-reset-margin-padding"
                            />
                        </div>
                    </div>

                    {
                        selectedProduct.productType === "2D" && (
                            <>
                                <div className='kr-edit-text-sliders kr-reset-margin'>
                                    <label className="kr-edit-text-slider-label kr-reset-margin-padding">Size</label>
                                    <input
                                        type="range"
                                        min={23}
                                        max={40}
                                        value={textSize}
                                        onChange={handleSizeChange}
                                        className="kr-edit-text-slider kr-reset-margin-padding"
                                    />

                                    <label className="kr-edit-text-slider-label kr-reset-margin-padding">Spacing</label>
                                    <input
                                        type="range"
                                        min={-10}
                                        max={100}
                                        value={textSpacing}
                                        onChange={handleSpacingChange}
                                        className="kr-edit-text-slider kr-reset-margin-padding"
                                    />
                                </div>

                                <hr className="kr-edit-text-divider kr-reset-margin-padding" />

                                <div className='kr-edit-text-arrange kr-reset-margin'>
                                    <h3 className='kr-edit-text-arrange-title kr-reset-margin-padding'>Arrange</h3>
                                    <div className="kr-edit-text-arrange-controls kr-reset-margin-padding">
                                        <img
                                            onClick={handleBringForward}
                                            className='kr-edit-text-arrange-icon kr-reset-margin-padding'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-forward_vigco4.png"
                                            alt="bring forward"
                                            title="Bring Forward"
                                        />
                                        <img
                                            onClick={() => handleArrangeAction('bringToFront')}
                                            className='kr-edit-text-arrange-icon kr-reset-margin-padding'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-to-front_povosv.png"
                                            alt="bring to front"
                                            title="Bring to Front"
                                        />
                                        <img
                                            onClick={() => handleArrangeAction('sendBackward')}
                                            className='kr-edit-text-arrange-icon kr-reset-margin-padding'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-send-backward_buzw6f.png"
                                            alt="send backward"
                                            title="Send Backward"
                                        />
                                        <img
                                            onClick={() => handleArrangeAction('sendToBack')}
                                            className='kr-edit-text-arrange-icon kr-reset-margin-padding'
                                            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508121/arrange-send-to-back_bcyzlu.png"
                                            alt="send to back"
                                            title="Send to Back"
                                        />
                                    </div>

                                </div>
                            </>
                        )
                    }

                </div>
            )}


            {showTextSelectTab && (
                <FontSelector
                    selectedFont={fontValue}
                    setShowTextSelectTab={setShowTextSelectTab}
                    setSelectedFont={handleFontSelection}
                />
            )}


            {showColorTab && (
                <CustomColorSwatch
                    setTextColor={is3D ? setthreeDTextColor : setTextColor}
                    setChangeTextColor={handleColorSelection}
                    selectedColor={colorValue}
                    setSelectedColor={is3D ? setthreeDTextColor : setCurrentColor}
                    setShowColorTab={setShowColorTab}
                />
            )}
        </>
    );
};

export default EditTextTab;