"use client"

import React, { useEffect, useCallback } from 'react'
import './PreviewTab.css'

const PreviewTab = ({
    updateArrange,
    setShowImageEditModal,
    constrainObjectToProduct,
    applyClippingToObject, 
    editor
}) => {

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const canvas = editor?.canvas;

    const [isRemovingBg, setIsRemovingBg] = React.useState(false);

    const isCanvasReady = useCallback(() => {
        return canvas && canvas._objects !== undefined && editor && editor.canvas;
    }, [canvas, editor]);

    const getActiveDesignObject = useCallback(() => {
        if (!isCanvasReady()) {
            return null;
        }

        const activeObj = canvas.getActiveObject();
        if (activeObj && activeObj.type === "image" && !activeObj.isTshirtBase) {
            return activeObj;
        }

        const objects = canvas.getObjects();
        const designObjects = objects.filter(obj =>
            obj.type === "image" &&
            !obj.isTshirtBase &&
            obj.name === "design-image"
        );

        if (designObjects.length > 0) {
            return designObjects[designObjects.length - 1];
        }

        return null;
    }, [canvas, isCanvasReady]);

    const handleAlign = useCallback((alignment) => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            const productImage = canvas.getObjects().find(obj => obj.isTshirtBase);
            if (!productImage) {
                console.warn("Product image not found, cannot align to product");
                return;
            }

            const productBounds = productImage.getBoundingRect();
            const padding = 10; 

            const productLeft = productBounds.left + padding;
            const productRight = productBounds.left + productBounds.width - padding;
            const productTop = productBounds.top + padding;
            const productBottom = productBounds.top + productBounds.height - padding;
            const productCenterX = productBounds.left + productBounds.width / 2;
            const productCenterY = productBounds.top + productBounds.height / 2;

            const objWidth = designObj.width * designObj.scaleX;
            const objHeight = designObj.height * designObj.scaleY;

            switch (alignment) {
                case 'left':
                    designObj.set({ left: productLeft + objWidth / 2 });
                    break;
                case 'center':
                    designObj.set({ left: productCenterX });
                    break;
                case 'right':
                    designObj.set({ left: productRight - objWidth / 2 });
                    break;
                case 'top':
                    designObj.set({ top: productTop + objHeight / 2 });
                    break;
                case 'middle':
                    designObj.set({ top: productCenterY });
                    break;
                case 'bottom':
                    designObj.set({ top: productBottom - objHeight / 2 });
                    break;
            }

            // Apply constraints to keep within bounds
            constrainObjectToProduct(designObj, productImage);

            // 🔥 IMPORTANT: Apply clipping mask after alignment
            if (applyClippingToObject && typeof applyClippingToObject === 'function') {
                applyClippingToObject(designObj, productImage);
                console.log('✂️ Clipping mask applied after alignment');
            }

            designObj.setCoords();
            canvas.renderAll();
            
            console.log(`✅ Design aligned to ${alignment} with clipping mask`);
        } catch (error) {
            console.error("Error aligning design:", error);
        }
    }, [canvas, getActiveDesignObject, isCanvasReady, constrainObjectToProduct, applyClippingToObject]);

    const handleFlip = useCallback((direction) => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            if (direction === 'horizontal') {
                const newFlipX = !designObj.flipX;
                designObj.set('flipX', newFlipX);
            } else if (direction === 'vertical') {
                const newFlipY = !designObj.flipY;
                designObj.set('flipY', newFlipY);
            }

            // Apply clipping after flip as well
            const productImage = canvas.getObjects().find(obj => obj.isTshirtBase);
            if (productImage && applyClippingToObject) {
                applyClippingToObject(designObj, productImage);
            }

            designObj.setCoords();
            canvas.renderAll();
        } catch (error) {
            console.error("Error flipping design:", error);
        }
    }, [canvas, getActiveDesignObject, isCanvasReady, applyClippingToObject]);

    const handleOpacityChange = useCallback((value) => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            const opacityValue = Math.max(0, Math.min(100, value)) / 100;
            designObj.set('opacity', opacityValue);
            designObj.setCoords();
            canvas.renderAll();
        } catch (error) {
            console.error("Error changing design opacity:", error);
        }
    }, [canvas, getActiveDesignObject, isCanvasReady]);

    const handleRotateChange = useCallback((value) => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            const rotationValue = parseInt(value) || 0;
            designObj.set('angle', rotationValue);

            // Apply clipping after rotation
            const productImage = canvas.getObjects().find(obj => obj.isTshirtBase);
            if (productImage && applyClippingToObject) {
                applyClippingToObject(designObj, productImage);
            }

            designObj.setCoords();
            canvas.renderAll();
        } catch (error) {
            console.error("Error rotating design:", error);
        }
    }, [canvas, getActiveDesignObject, isCanvasReady, applyClippingToObject]);

    const handleArrange = useCallback((action) => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            if (updateArrange && typeof updateArrange === 'function') {
                canvas.setActiveObject(designObj);
                updateArrange(action);
            }

            // Apply clipping after arrange
            const productImage = canvas.getObjects().find(obj => obj.isTshirtBase);
            if (productImage && applyClippingToObject) {
                applyClippingToObject(designObj, productImage);
            }

            canvas.renderAll();
        } catch (error) {
            console.error("Error arranging design:", error);
        }
    }, [canvas, getActiveDesignObject, updateArrange, isCanvasReady, applyClippingToObject]);

    const getFlipStates = useCallback(() => {
        const designObj = getActiveDesignObject();
        return {
            flipX: designObj?.flipX || false,
            flipY: designObj?.flipY || false
        };
    }, [getActiveDesignObject]);

    const getDesignProperties = useCallback(() => {
        const designObj = getActiveDesignObject();
        if (!designObj) return null;

        return {
            opacity: Math.round((designObj.opacity || 1) * 100),
            rotation: Math.round(designObj.angle || 0),
            width: Math.round(designObj.width || 0),
            height: Math.round(designObj.height || 0),
            imageSrc: designObj.getSrc ? designObj.getSrc() : null
        };
    }, [getActiveDesignObject]);

    const flipStates = getFlipStates();
    const designProps = getDesignProperties();

    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (getActiveDesignObject()) {
                forceUpdate();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [getActiveDesignObject]);

    const handleRemoveBackground = useCallback(async () => {
        if (!isCanvasReady()) return;

        const designObj = getActiveDesignObject();
        if (!designObj) return;

        try {
            setIsRemovingBg(true);

            const currentImageSrc = designObj.getSrc();
            if (!currentImageSrc) {
                console.error("No image source found");
                return;
            }

            const response = await fetch(currentImageSrc);
            const blob = await response.blob();

            const form = new FormData();
            form.append("image_file", blob);

            const clipdropResponse = await fetch("https://clipdrop-api.co/remove-background/v1", {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                },
                body: form,
            });

            if (clipdropResponse.ok) {
                const buffer = await clipdropResponse.arrayBuffer();
                const resultBlob = new Blob([buffer], { type: "image/png" });
                const resultImageUrl = URL.createObjectURL(resultBlob);

                import("fabric").then(({ Image }) => {
                    const img = new window.Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        const newFabricImg = new Image(img, {
                            left: designObj.left,
                            top: designObj.top,
                            originX: designObj.originX,
                            originY: designObj.originY,
                            scaleX: designObj.scaleX,
                            scaleY: designObj.scaleY,
                            angle: designObj.angle,
                            opacity: designObj.opacity,
                            flipX: designObj.flipX,
                            flipY: designObj.flipY,
                            name: "design-image",
                            selectable: true,
                            evented: true,
                            hasControls: true,
                            hasBorders: true,
                            moveCursor: "move",
                            lockMovementX: false,
                            lockMovementY: false,
                            lockScalingX: false,
                            lockScalingY: false,
                            lockRotation: false
                        });

                        canvas.remove(designObj);
                        canvas.add(newFabricImg);
                        canvas.setActiveObject(newFabricImg);

                        // Apply clipping to the new background-removed image
                        const productImage = canvas.getObjects().find(obj => obj.isTshirtBase);
                        if (productImage && applyClippingToObject) {
                            setTimeout(() => {
                                applyClippingToObject(newFabricImg, productImage);
                                console.log('✂️ Clipping applied to background-removed image');
                            }, 100);
                        }

                        canvas.renderAll();
                    };
                    img.src = resultImageUrl;
                });
            } else {
                alert("Failed to remove the background. Please try again.");
            }
        } catch (error) {
            alert("An error occurred while removing the background. Please try again.");
        } finally {
            setIsRemovingBg(false);
        }
    }, [canvas, getActiveDesignObject, isCanvasReady, applyClippingToObject]);

    const handleUpscale = useCallback(() => {
        console.log("Upscale design clicked");
    }, []);

    return (
        <div className="kr-preview-container kr-reset-margin-padding">
            <div className='kr-preview-header kr-reset-margin'>
                <div className='kr-preview-title-section kr-reset-margin-padding'>
                    <h3 className='kr-preview-title kr-reset-margin-padding'>Preview</h3>
                </div>
                <div
                    onClick={() => setShowImageEditModal && setShowImageEditModal(false)}
                    className='kr-preview-close kr-reset-margin-padding'
                >
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            <hr className="kr-preview-divider kr-reset-margin-padding" />

            {designProps ? (
                <>
                    <div className='kr-preview-design-section kr-reset-margin'>
                        <div className="kr-preview-design-image kr-reset-margin">
                            {designProps.imageSrc ? (
                                <img
                                    src={designProps.imageSrc}
                                    alt="Design"
                                    className="kr-preview-design-img kr-reset-margin-padding"
                                />
                            ) : (
                                <div className="kr-preview-design-placeholder kr-reset-margin-padding">
                                    <span className="kr-preview-design-placeholder-text kr-reset-margin-padding">Design</span>
                                </div>
                            )}
                        </div>
                        <div className="kr-preview-design-info kr-reset-margin-padding">
                            <p className="kr-preview-dimensions-label kr-reset-margin-padding">Width x Height</p>
                            <div className='kr-preview-dimensions kr-reset-margin-padding'>
                                <span className='kr-preview-dimension-badge kr-reset-margin'>
                                    {(designProps.width / 50).toFixed(2)} in
                                </span>
                                <span className='kr-preview-dimension-badge kr-reset-margin'>
                                    {(designProps.height / 50).toFixed(2)} in
                                </span>
                            </div>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-flip-section kr-reset-margin'>
                        <h3 className='kr-preview-flip-title kr-reset-margin-padding'>Flip</h3>
                        <div className="kr-preview-flip-buttons kr-reset-margin-padding">
                            <button
                                onClick={() => handleFlip('horizontal')}
                                className={`kr-preview-flip-button kr-reset-margin-padding ${flipStates.flipX ? 'kr-active' : ''}`}
                            >
                                <img
                                    className="kr-preview-flip-icon kr-reset-margin-padding"
                                    src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507255/tune-vertical_ezas8p.png"
                                    alt="Flip Horizontal"
                                />
                            </button>
                            <button
                                onClick={() => handleFlip('vertical')}
                                className={`kr-preview-flip-button kr-reset-margin-padding ${flipStates.flipY ? 'kr-active' : ''}`}
                            >
                                <img
                                    className="kr-preview-flip-icon kr-reset-margin-padding"
                                    src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/flip-vertical_ajs5ur.png"
                                    alt="Flip Vertical"
                                />
                            </button>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-alignment-section kr-reset-margin'>
                        <h3 className='kr-preview-alignment-title kr-reset-margin-padding'>Alignment</h3>
                        <div className="kr-preview-alignment-grid">
                            <button onClick={() => handleAlign("left")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507255/align-horizontal-left_fbsuoo.png" alt="Left" />
                            </button>
                            <button onClick={() => handleAlign("center")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507255/Frame_46_rrtm82.png" alt="Center" />
                            </button>
                            <button onClick={() => handleAlign("right")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/align-horizontal-right_adq5ap.png" alt="Right" />
                            </button>
                            <button onClick={() => handleAlign("top")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/align-vertical-top_nmalzx.png" alt="Top" />
                            </button>
                            <button onClick={() => handleAlign("middle")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/align-vertical-center_wguxnj.png" alt="Middle" />
                            </button>
                            <button onClick={() => handleAlign("bottom")} className='kr-preview-alignment-button'>
                                <img className='kr-preview-alignment-icon kr-reset-padding' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749507254/align-vertical-bottom_damnnr.png" alt="Bottom" />
                            </button>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-control-section kr-reset-margin'>
                        <label className="kr-preview-control-label kr-reset-padding">Opacity</label>
                        <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={designProps?.opacity || 100}
                                onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
                                className="kr-preview-slider kr-reset-margin-padding"
                                style={{
                                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${designProps?.opacity || 100}%, #e5e7eb ${designProps?.opacity || 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <span className='kr-preview-value-display kr-reset-margin'>
                                {designProps?.opacity || 100}%
                            </span>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-control-section kr-reset-margin'>
                        <label className="kr-preview-control-label kr-reset-padding">Rotate</label>
                        <div className='kr-preview-control-input-group kr-reset-margin-padding'>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={designProps?.rotation || 0}
                                onChange={(e) => handleRotateChange(parseInt(e.target.value))}
                                className="kr-preview-slider "
                                style={{
                                    background: `linear-gradient(to right, #3559C7 0%, #3559C7 ${((designProps?.rotation || 0) / 360) * 100}%, #e5e7eb ${((designProps?.rotation || 0) / 360) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <span className='kr-preview-value-display'>
                                {designProps?.rotation || 0}°
                            </span>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-arrange-section kr-reset-margin'>
                        <h3 className='kr-preview-arrange-title kr-reset-margin-padding'>Arrange</h3>
                        <div className="kr-preview-arrange-buttons kr-reset-margin-padding">
                            <button onClick={() => handleArrange("bringForward")} className='kr-preview-arrange-button kr-reset-margin-padding'>
                                <img className='kr-preview-arrange-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-forward_vigco4.png" alt="Forward" />
                            </button>
                            <button onClick={() => handleArrange("bringToFront")} className='kr-preview-arrange-button kr-reset-margin-padding'>
                                <img className='kr-preview-arrange-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-bring-to-front_povosv.png" alt="Front" />
                            </button>
                            <button onClick={() => handleArrange("sendBackward")} className='kr-preview-arrange-button kr-reset-margin-padding'>
                                <img className='kr-preview-arrange-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508122/arrange-send-backward_buzw6f.png" alt="Backward" />
                            </button>
                            <button onClick={() => handleArrange("sendToBack")} className='kr-preview-arrange-button kr-reset-margin-padding'>
                                <img className='kr-preview-arrange-icon' src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508121/arrange-send-to-back_bcyzlu.png" alt="Back" />
                            </button>
                        </div>
                    </div>
                    <hr className="kr-preview-divider kr-reset-margin-padding" />

                    <div className='kr-preview-tools-section kr-reset-margin'>
                        <h3 className='kr-preview-tools-title kr-reset-margin-padding'>Tools</h3>

                        <button
                            className={`kr-preview-tool-button  ${isRemovingBg ? 'kr-disabled' : ''}`}
                            onClick={handleRemoveBackground}
                            disabled={isRemovingBg}
                        >
                            <img className="kr-preview-tool-icon" src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508617/circle-opacity_zvwbfk.png" alt="" />
                            <span className='kr-preview-tool-text'>
                                {isRemovingBg ? 'Removing...' : 'Remove Background'}
                            </span>
                        </button>

                        <button
                            className='kr-preview-tool-button'
                            onClick={handleUpscale}
                        >
                            <img className="kr-preview-tool-icon" src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749508617/move-resize-variant_karpuj.png" alt="" />
                            <span className='kr-preview-tool-text'>Upscale</span>
                        </button>
                    </div>
                </>
            ) : (
                <div className="kr-preview-empty-state">
                    <p className="kr-preview-empty-text kr-reset">No design selected</p>
                    <p className="kr-preview-empty-subtext kr-reset">Upload a design to start editing</p>
                </div>
            )}
        </div>
    )
}

export default PreviewTab