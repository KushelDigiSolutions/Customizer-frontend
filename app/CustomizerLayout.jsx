"use client";
import { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useFabricJSEditor, FabricJSCanvas } from "fabricjs-react";
import LayerContextMenu from "./components/2d/LayerContextMenu";
import useCanvasContextMenu from "./hooks/useCanvasContextMenu";
import ThreeDCustomize from "./3DCustomize";
import ScreenshotGallery from "./components/3d/ScreenshotGallery";
import "./CustomizerLayout.css";
import { use2D } from "./context/2DContext";
import { use3D } from "./context/3DContext";
import { backendProducts } from "./data/productsData";

const CustomizerLayout = (props) => {
  console.log("props V1");
  // console.log(props);
  // console.log(props?.productPrice);
  // console.log(props?.pageLoading);
  // console.log(props?.productQuantity);

  // Get all 2d context state and setters
  const {
    customText,
    setCustomText,
    textSize,
    setTextSize,
    textSpacing,
    setTextSpacing,
    textArc,
    setTextArc,
    textColor,
    setTextColor,
    fontFamily,
    setFontFamily,
    fontStyle,
    setFontStyle,
    textFlipX,
    setTextFlipX,
    textFlipY,
    setTextFlipY,
    flipX,
    setFlipX,
    flipY,
    setFlipY,
    selectedColor,
    setSelectedColor,
    selectedTopColor,
    setSelectedTopColor,
    selectedBottomColor,
    setSelectedBottomColor,
    selectedLayers,
    setSelectedLayers,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showSidebar,
    setShowSidebar,
    showChatBox,
    setShowChatBox,
    saveSuccess,
    setSaveSuccess,
    isSaving,
    setIsSaving,
    currentProductId,
    setCurrentProductId,
    layerManager,
    setLayerManager,
    showAddToCart: showAddToCart2D,
    setShowAddToCart: setShowAddToCart2D,
    isDesignSaved: isDesignSaved2D,
    setIsDesignSaved: setIsDesignSaved2D,
    setSavedDesignData: setSavedDesignData2D,
    handleDesignSaved
  } = use2D();

  const {
    threeDscreenshots,
    setthreeDScreenshots,
    threeDselectedPart,
    setthreeDSelectedPart,
    threeDloading,
    selectedProduct,
    setSelectedProduct,
    customizationData,
    showAddToCart,
    setShowAddToCart,
    isDesignSaved,
    setIsDesignSaved,
    setSavedDesignData,
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
    threeDcolor,
    threeDtexture,
    showScreenshotsModal,
    activeVariants
  } = use3D();

  const [pageLoading, setPageLoading] = useState(props?.pageLoading || false);

  // Function to handle design modifications and hide add to cart button
  const handleDesignModification = () => {
    if (selectedProduct?.ProductType === "3d") {
      if (isDesignSaved || showAddToCart) {
        setIsDesignSaved(false);
        setShowAddToCart(false);
      }
    } else {
      if (isDesignSaved2D || showAddToCart2D) {
        setIsDesignSaved2D(false);
        setShowAddToCart2D(false);
      }
    }
  };

  // Watch for changes in 2D customization data
  // Temporarily disabled to fix Add to Cart button issue
  // useEffect(() => {
  //   if (selectedProduct?.ProductType === "2d") {
  //     handleDesignModification();
  //   }
  // }, [
  //   customText,
  //   textSize,
  //   textSpacing,
  //   textArc,
  //   textColor,
  //   fontFamily,
  //   fontStyle,
  //   textFlipX,
  //   textFlipY,
  //   flipX,
  //   flipY,
  //   selectedColor,
  //   selectedTopColor,
  //   selectedBottomColor,
  //   selectedLayers,
  // ]);

  // Watch for changes in 3D customization data
  // Temporarily disabled to fix Add to Cart button issue
  useEffect(() => {
    if (selectedProduct?.ProductType === "3d") {
      handleDesignModification();
    }
  }, [
    customizationData,
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

  console.log("productId", props.productId);
  console.log("storeHash", props.storeHash);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!props.productId || !props.storeHash) return;

    setLoading(true);
    fetch(
      `https://customise.shikharjobs.com/api/developer/product?productId=${props.productId}&storeHash=${props.storeHash}`
    )
      .then(res => res.json())
      .then(data => {
        setProduct(data?.data || null);
        setSelectedProduct(data?.data || null);
        // console.log("Selected Product:", data?.data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [props.productId, props.storeHash, setSelectedProduct]);

  // if (props?.productId != "" && typeof props?.productId != "undefined") {
  //   const idFromPath = props?.productId || 6;
  //   const product = backendProducts.find(
  //     (p) => String(p.id) === String(idFromPath)
  //   );
  //   setSelectedProduct(product);
  // }

  const parts = selectedProduct?.parts || [];
  const [totalPrice, setTotalPrice] = useState(0);

  class SimpleLayerManager {
    constructor(canvas, layerOrder) {
      this.canvas = canvas;
      this.layerOrder = layerOrder || {};
    }

    setObjectLayer(obj) {
      if (!obj) return;

      let zIndex = 0;

      // Dynamically assign zIndex based on product's layerOrder
      if (obj.isTshirtBase && this.layerOrder.PRODUCT !== undefined) {
        zIndex = this.layerOrder.PRODUCT;
      } else if (
        obj.isRightSideImage &&
        this.layerOrder.RIGHT_SIDE_IMAGE !== undefined
      ) {
        zIndex = this.layerOrder.RIGHT_SIDE_IMAGE;
      } else if (
        (obj.layerType === "image" || obj.name === "design-image") &&
        this.layerOrder.IMAGE !== undefined
      ) {
        // Handle uploaded images for the IMAGE layer
        zIndex = this.layerOrder.IMAGE;
      }
      else if (obj.type === "i-text" && this.layerOrder.TEXT !== undefined) {
        zIndex = this.layerOrder.TEXT;
      } else if (
        obj.type === "image" &&
        obj.isTopGradient &&
        this.layerOrder.TOP_GRADIENT !== undefined
      ) {
        zIndex = this.layerOrder.TOP_GRADIENT;
      } else if (
        obj.type === "image" &&
        obj.isPattern &&
        this.layerOrder.PATTERN !== undefined
      ) {
        zIndex = this.layerOrder.PATTERN;
      } else if (
        obj.type === "image" &&
        obj.isBottomGradient &&
        this.layerOrder.BOTTOM_GRADIENT !== undefined
      ) {
        zIndex = this.layerOrder.BOTTOM_GRADIENT;
      } else if (
        (obj.isBottomGradientFade || obj.isBottomGradientTopTransparent) &&
        this.layerOrder.BOTTOM_GRADIENT !== undefined
      ) {
        zIndex = this.layerOrder.BOTTOM_GRADIENT + 0.1;
      } else if (
        obj.type === "image" &&
        obj.layerType &&
        this.layerOrder[obj.layerType?.toUpperCase()] !== undefined
      ) {
        // Dynamic layers (e.g., shoes, t-shirts)
        zIndex = this.layerOrder[obj.layerType.toUpperCase()];
      } else if (
        obj.type === "image" &&
        !obj.isTshirtBase &&
        this.layerOrder.DESIGN !== undefined
      ) {
        zIndex = this.layerOrder.DESIGN;
      } else if (
        obj.isColorEffect &&
        this.layerOrder.BASE_COLOR !== undefined
      ) {
        zIndex = this.layerOrder.BASE_COLOR;
      }

      obj.zIndex = zIndex;
      // console.log(
      //   `✅ Object assigned layer: ${obj.type} -> zIndex: ${zIndex}${obj.layerType ? ` (${obj.layerType})` : ""
      //   }${obj.isRightSideImage ? " (Right Side Image)" : ""}`
      // );
    }

    arrangeCanvasLayers() {
      const objects = this.canvas.getObjects();

      // Sort objects by their zIndex
      objects.sort((a, b) => {
        const aIndex = a.zIndex || 0;
        const bIndex = b.zIndex || 0;
        return aIndex - bIndex;
      });

      // Clear and re-add in correct order
      this.canvas._objects = [];
      objects.forEach((obj) => {
        this.canvas._objects.push(obj);
      });

      this.canvas.renderAll();
      // console.log(
      //   "✅ Layer arrangement complete - Updated with dynamic layers support"
      // );
    }
  }

  import("fabric").then(({ Canvas }) => {
    if (Canvas && !Canvas.prototype.updateZIndices) {
      Canvas.prototype.updateZIndices = function () {
        const objects = this.getObjects();
        objects.forEach((obj, index) => {
          obj.zIndex = index;
        });
      };
    }
  });

  const { editor, onReady } = useFabricJSEditor();

  const {
    contextMenu,
    closeContextMenu,
    handleDelete,
    handleLock,
    handleFlipHorizontal,
    handleFlipVertical,
    handleBringToFront,
    handleBringForward,
    handleSendBackward,
    handleSendToBack,
  } = useCanvasContextMenu(editor);

  // Initialize layer manager when canvas is ready
  useEffect(() => {
    if (editor?.canvas && !layerManager && selectedProduct?.layers) {
      const manager = new SimpleLayerManager(
        editor.canvas,
        selectedProduct.layers
      );
      setLayerManager(manager);
      // console.log("🎯 Layer Manager initialized with dynamic layers system");
    }
  }, [editor?.canvas, selectedProduct?.layers]);

  // Helper function to get current product data with customizations
  const getCurrentProductData = () => {
    if (!selectedProduct) return null;

    return {
      ...selectedProduct,
      text: customText,
      textSize,
      textSpacing,
      textArc,
      fontFamily,
      fontStyle,
      fill: textColor,
      imgflipX: flipX,
      imgflipY: flipY,
      flipX: textFlipX,
      flipY: textFlipY,
      opacity: 100,
      rotate: 0,
      alignment: "center",
      color: selectedColor.color,
      topColor: selectedTopColor,
      bottomColor: selectedBottomColor,
      selectedLayers: selectedLayers,
    };
  };

  const handleColorChange = (colorObj) => {
    setSelectedColor(colorObj);
    updateCanvasColor(colorObj.color);
  };

  // NEW: Handle top gradient color - FIXED
  const handleTopColorChange = (colorObj) => {
    setSelectedTopColor(colorObj);
    handleAddTopGradientToCanvas(colorObj.url);
  };

  // NEW: Handle bottom gradient color - FIXED
  const handleBottomColorChange = (colorObj) => {
    setSelectedBottomColor(colorObj);
    handleAddBottomGradientToCanvas(colorObj.url);
  };

  // NEW: Handle dynamic layer changes for shoes
  const handleDynamicLayerChange = (layerType, item) => {
    // console.log(`🔄 Changing layer: ${layerType} to ${item.name}`);

    // Update selected layers state
    setSelectedLayers((prev) => ({
      ...prev,
      [layerType]: item,
    }));

    // Add the layer to canvas
    handleAddDynamicLayerToCanvas(layerType, item.url);
  };

  // Canvas background color change
  const updateCanvasColor = (color) => {
    if (!editor?.canvas) {
      console.error("❌ Canvas not available for color change");
      return;
    }

    // console.log("🎨 Changing canvas background color to:", color);

    const canvas = editor.canvas;

    canvas.setBackgroundColor(color, () => {
      canvas.renderAll();
      // console.log("✅ Canvas background color changed to:", color);
    });
  };

  // NEW: Add dynamic layer function for shoes
  const handleAddDynamicLayerToCanvas = (layerType, url) => {
    if (!editor?.canvas || !url) return;

    const canvas = editor.canvas;

    import("fabric").then((fabric) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        const productImage = canvas
          .getObjects()
          .find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        // Remove existing layer of the same type
        const existingLayers = canvas
          .getObjects()
          .filter((obj) => obj.layerType === layerType);
        existingLayers.forEach((layer) => {
          canvas.remove(layer);
        });

        // Create new layer with exact same dimensions as product
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left,
          top: productBounds.top,
          originX: "left",
          originY: "top",
          scaleX: productBounds.width / imgElement.width,
          scaleY: productBounds.height / imgElement.height,
          name: `${layerType}-layer`,
          layerType: layerType,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });

        canvas.add(imgInstance);

        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.arrangeCanvasLayers();
        }

        console.log(`✅ ${layerType} layer added - Dynamic layer system`);
      };
      console.log("🎨 Image element created:", imgElement);
    });
  };

  // Load default layers for products that have them
  const loadDefaultLayers = () => {
    if (!selectedProduct?.defaultLayers || !editor?.canvas) return;

    console.log("🔧 Loading default layers for product:", selectedProduct.id);

    const defaultLayers = selectedProduct.defaultLayers;
    const initialLayers = {};

    Object.keys(defaultLayers).forEach((layerType) => {
      const url = defaultLayers[layerType];
      if (url) {
        // Find the corresponding item in layerDesign
        const layerDesigns = selectedProduct.layerDesign?.[layerType];
        if (layerDesigns) {
          const defaultItem =
            layerDesigns.find((item) => item.url === url) || layerDesigns[0]; // Fallback to first item

          if (defaultItem) {
            initialLayers[layerType] = defaultItem;
            handleAddDynamicLayerToCanvas(layerType, url);
          }
        }
      }
    });

    setSelectedLayers(initialLayers);
    console.log("✅ Default layers loaded:", Object.keys(initialLayers));
  };

  // NEW: Add bottom gradient function - FIXED
  const handleAddBottomGradientToCanvas = (url) => {
    if (!editor?.canvas || !url) return;

    const canvas = editor.canvas;

    import("fabric").then((fabric) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        const productImage = canvas
          .getObjects()
          .find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        // Remove existing bottom gradient and all its overlays
        const existingBottomElements = canvas
          .getObjects()
          .filter(
            (obj) =>
              obj.isBottomGradient === true ||
              obj.isBottomGradientFade === true ||
              obj.isBottomGradientTopTransparent === true
          );
        existingBottomElements.forEach((element) => {
          canvas.remove(element);
        });

        // Create bottom gradient image that only covers the BOTTOM 50% with fade effect
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left,
          top: productBounds.top + productBounds.height * 0.5, // Start from 50% height
          originX: "left",
          originY: "top",
          opacity: 0.5,
          scaleX: productBounds.width / imgElement.width,
          scaleY: (productBounds.height * 0.5) / imgElement.height, // Only cover bottom 50%
          name: "bottom-gradient-image",
          isBottomGradient: true,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });

        // Add the image to canvas first
        canvas.add(imgInstance);

        // Create fade effect overlay that makes the top part of bottom gradient transparent
        const fadeOverlay = new fabric.Rect({
          left: productBounds.left,
          top: productBounds.top + productBounds.height * 0.5, // Start from 50% height
          width: productBounds.width,
          height: productBounds.height * 0.5, // Bottom 50%
          originX: "left",
          originY: "top",
          fill: new fabric.Gradient({
            type: "linear",
            gradientUnits: "pixels",
            coords: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: productBounds.height * 0.5, // Gradient in bottom 50%
            },
            colorStops: [
              { offset: 0, color: "rgba(0,0,0,1)" }, // Fully opaque at 50% mark (hides image)
              { offset: 0.3, color: "rgba(0,0,0,0.7)" }, // Quick fade transition
              { offset: 1, color: "rgba(0,0,0,0)" }, // Fully transparent at bottom (shows image)
            ],
          }),
          name: "bottom-gradient-fade-overlay",
          isBottomGradientFade: true,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          globalCompositeOperation: "destination-out", // This removes parts of the bottom gradient
        });

        // Add the fade overlay
        canvas.add(fadeOverlay);

        // Apply layer management for all elements
        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.setObjectLayer(fadeOverlay);
          layerManager.arrangeCanvasLayers();
        }

        console.log(
          "✅ Bottom gradient added - Only covers bottom 50% with fade effect, top 50% remains transparent"
        );
      };
    });
  };

  // NEW: Add top gradient function - FIXED
  const handleAddTopGradientToCanvas = (url) => {
    if (!editor?.canvas || !url) return;

    const canvas = editor.canvas;

    import("fabric").then((fabric) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        const productImage = canvas
          .getObjects()
          .find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        // Remove existing top gradient
        const existingTopGradient = canvas
          .getObjects()
          .filter((obj) => obj.isTopGradient === true);
        existingTopGradient.forEach((gradient) => {
          canvas.remove(gradient);
        });

        // Create top gradient with EXACT same dimensions as product
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left,
          top: productBounds.top,
          originX: "left",
          originY: "top",
          scaleX: productBounds.width / imgElement.width,
          scaleY: productBounds.height / imgElement.height,
          name: "top-gradient-image",
          isTopGradient: true,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });

        canvas.add(imgInstance);

        // Apply layer management
        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.arrangeCanvasLayers();
        }

        console.log("✅ Top gradient added (zIndex: 2) - Top color applied");
      };
    });
  };

  const handleAddCustomText = () => {
    if (!editor || !customText.trim()) return;

    console.log("🔤 Adding custom text:", customText);

    import("fabric").then((fabric) => {
      const canvas = editor.canvas;

      // Remove existing text objects (but not emojis)
      const existingText = canvas
        .getObjects()
        .filter((obj) => obj.type === "i-text" && !obj.isEmoji);
      existingText.forEach((obj) => canvas.remove(obj));

      const imageObj = canvas
        .getObjects()
        .find((obj) => obj.isTshirtBase && (obj.type === "image" || obj.type === "rect"));
      if (!imageObj) {
        console.error("❌ No base product image found");
        alert("Error: Product not loaded properly. Please refresh the page.");
        return;
      }

      const imageBounds = imageObj.getBoundingRect();
      const topRatio = selectedProduct?.textTopRatio || 3.5;

      const textObject = new fabric.IText(customText.slice(0, 9), {
        left: imageBounds.left + imageBounds.width * 0.25,
        top: imageBounds.top + imageBounds.height / topRatio,
        originX: "center",
        originY: "center",
        fontSize: textSize,
        fill: textColor,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        selectable: true,
        evented: true,
        moveCursor: "move",
        hasControls: true,
        hasBorders: true,
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        editable: true,
      });

      console.log("✅ Text object created:", textObject);

      canvas.add(textObject);

      // Apply layer management - IMMEDIATE arrangement
      if (layerManager) {
        layerManager.setObjectLayer(textObject);
        layerManager.arrangeCanvasLayers();
      }

      console.log("✅ Text added with proper layer (zIndex: 5) - Non-moveable");

      setCustomText("");
      setShowAddModal(false);
      setShowEditModal(true);
    });
  };

  const alignFabricObject = (_, canvas, alignment) => {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const objWidth = obj.width * obj.scaleX;
    const objHeight = obj.height * obj.scaleY;

    switch (alignment) {
      case "left":
        obj.set({ left: objWidth / 2 });
        break;
      case "center":
        obj.set({ left: canvasWidth / 2 });
        break;
      case "right":
        obj.set({ left: canvasWidth - objWidth / 2 });
        break;
      case "top":
        obj.set({ top: objHeight / 2 });
        break;
      case "middle":
        obj.set({ top: canvasHeight / 2 });
        break;
      case "bottom":
        obj.set({ top: canvasHeight - objHeight / 2 });
        break;
    }

    obj.setCoords();
    canvas.renderAll();
  };

  const updateArrange = (action) => {
    if (!editor || !editor.canvas) return;

    const canvas = editor.canvas;
    const obj = canvas.getActiveObject();
    if (!obj) return;

    switch (action) {
      case "bringToFront":
        canvas.bringToFront(obj);
        break;
      case "sendToBack":
        canvas.sendToBack(obj);
        break;
      case "bringForward":
        canvas.bringForward(obj);
        break;
      case "sendBackward":
        canvas.sendBackwards(obj);
        break;
    }

    obj.setCoords();
    canvas.renderAll();
  };

  const addEmojiTextToCanvas = (emojiChar) => {
    if (!editor || !editor.canvas) return;

    import("fabric").then(({ IText }) => {
      const canvas = editor.canvas;
      const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);
      if (!productImage) return;

      const existingEmoji = canvas
        .getObjects()
        .find((obj) => obj.isEmoji === true);
      if (existingEmoji) {
        canvas.remove(existingEmoji);
      }

      const productBounds = productImage.getBoundingRect();

      const emojiText = new IText(emojiChar, {
        left: productBounds.left + productBounds.width / 2,
        top: productBounds.top + productBounds.height / 2,
        originX: "center",
        originY: "center",
        fontSize: 48,
        fill: "#000",
        selectable: false,
        evented: false,
        hasBorders: false,
        hasControls: false,
        moveCursor: "default",
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        editable: false,
      });

      emojiText.isEmoji = true;

      canvas.add(emojiText);

      // Apply layer management - IMMEDIATE arrangement
      if (layerManager) {
        layerManager.setObjectLayer(emojiText);
        layerManager.arrangeCanvasLayers();
      }

      console.log(
        "✅ Emoji added with proper layer (zIndex: 5) - Non-moveable"
      );
    });
  };

  // Design function - Perfect merge with equal dimensions
  // const handleAddDesignToCanvas = (
  //   url,
  //   position = "center",
  //   offsetX = 0,
  //   offsetY = 0
  // ) => {
  //   if (!editor || !url) return;

  //   import("fabric").then((fabric) => {
  //     const canvas = editor.canvas;
  //     const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);
  //     if (!productImage) return;

  //     const imgElement = new Image();
  //     imgElement.crossOrigin = "anonymous";
  //     imgElement.src = url;

  //     imgElement.onload = () => {
  //       // Get product dimensions for perfect matching
  //       const productBounds = productImage.getBoundingRect();

  //       // Remove existing design before adding new one
  //       const existingDesign = canvas
  //         .getObjects()
  //         .find((obj) => obj.name === "design-image");
  //       if (existingDesign) {
  //         canvas.remove(existingDesign);
  //       }

  //       // Create design with EXACT same dimensions as product for perfect merge
  //       const imgInstance = new fabric.Image(imgElement, {
  //         left: productBounds.left,
  //         top: productBounds.top,
  //         originX: "left",
  //         originY: "top",
  //         // Scale to match product dimensions EXACTLY
  //         scaleX: productBounds.width / imgElement.width,
  //         scaleY: productBounds.height / imgElement.height,
  //         name: "design-image",
  //         selectable: false,
  //         evented: false,
  //         hasControls: false,
  //         hasBorders: false,
  //         moveCursor: "default",
  //         lockMovementX: true,
  //         lockMovementY: true,
  //         lockScalingX: true,
  //         lockScalingY: true,
  //         lockRotation: true,
  //       });

  //       canvas.add(imgInstance);

  //       // Apply layer management - IMMEDIATE arrangement
  //       if (layerManager) {
  //         layerManager.setObjectLayer(imgInstance);
  //         layerManager.arrangeCanvasLayers();
  //       }

  //       console.log(
  //         "✅ Design added with perfect merge dimensions (zIndex: 4) - Non-moveable"
  //       );
  //     };
  //   });
  // };

  // Updated handleAddDesignToCanvas function for layer-based image placement
  // Updated handleAddDesignToCanvas function for layer-based image placement
  const handleAddDesignToCanvas = (
    url,
    position = "center",
    offsetX = 0,
    offsetY = 0
  ) => {
    if (!editor || !url) return;

    import("fabric").then((fabric) => {
      const canvas = editor.canvas;
      const productImage = canvas.getObjects().find((obj) => obj.isTshirtBase);
      if (!productImage) return;

      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        // Get product dimensions for perfect matching
        const productBounds = productImage.getBoundingRect();

        // Remove existing design images from IMAGE layer before adding new one
        const existingDesignImages = canvas
          .getObjects()
          .filter((obj) =>
            (obj.layerType === "image" && obj.name === "design-image") ||
            (obj.name === "design-image" && !obj.isTshirtBase)
          );
        existingDesignImages.forEach((obj) => canvas.remove(obj));

        // Create design image with EXACT same dimensions as product for perfect merge
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left,
          top: productBounds.top,
          originX: "left",
          originY: "top",
          // Scale to match product dimensions EXACTLY
          scaleX: productBounds.width / imgElement.width,
          scaleY: productBounds.height / imgElement.height,
          name: "design-image",
          layerType: "image", // Set layer type as "image" for IMAGE layer (z-index 2)
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });

        canvas.add(imgInstance);

        // Apply layer management - IMMEDIATE arrangement
        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.arrangeCanvasLayers();
        }

        console.log(
          "✅ Design image added to IMAGE layer (z-index: 2) - Non-moveable"
        );
      };

      imgElement.onerror = () => {
        console.error("Failed to load design image:", url);
      };
    });
  };

  // Pattern function - Perfect merge with equal dimensions + FIXED old pattern removal
  const handleAddPatternToCanvas = (url) => {
    if (!editor?.canvas || !url) return;

    const canvas = editor.canvas;

    import("fabric").then((fabric) => {
      const imgElement = new Image();
      imgElement.crossOrigin = "anonymous";
      imgElement.src = url;

      imgElement.onload = () => {
        // Get product dimensions for perfect matching
        const productImage = canvas
          .getObjects()
          .find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        // Remove existing patterns before adding new one
        const existingPatterns = canvas
          .getObjects()
          .filter((obj) => obj.isPattern === true);
        existingPatterns.forEach((pattern) => {
          canvas.remove(pattern);
        });

        // Create pattern with EXACT same dimensions as product for perfect merge
        const imgInstance = new fabric.Image(imgElement, {
          left: productBounds.left,
          top: productBounds.top,
          originX: "left",
          originY: "top",
          // Scale to match product dimensions EXACTLY
          scaleX: productBounds.width / imgElement.width,
          scaleY: productBounds.height / imgElement.height,
          name: "pattern-image",
          isPattern: true,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          moveCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
        });

        canvas.add(imgInstance);

        // Apply layer management - IMMEDIATE arrangement
        if (layerManager) {
          layerManager.setObjectLayer(imgInstance);
          layerManager.arrangeCanvasLayers();
        }

        console.log(
          "✅ Pattern added with perfect merge dimensions (zIndex: 3) - Non-moveable"
        );
      };
    });
  };

  const addIconToCanvas = async (iconData) => {
    if (!editor || !editor.canvas) return;

    try {
      const response = await fetch(
        `https://api.iconify.design/${iconData.name}.svg?color=%23000000&width=64&height=64`
      );
      const svgText = await response.text();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);

      import("fabric").then(({ Image }) => {
        const canvas = editor.canvas;
        const productImage = canvas
          .getObjects()
          .find((obj) => obj.isTshirtBase);
        if (!productImage) return;

        const productBounds = productImage.getBoundingRect();

        Image.fromURL(svgUrl, (img) => {
          img.set({
            left: productBounds.left + productBounds.width / 2,
            top: productBounds.top + productBounds.height / 2,
            originX: "center",
            originY: "center",
            scaleX: 0.8,
            scaleY: 0.8,
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            moveCursor: "default",
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
          });

          img.isIcon = true;
          img.iconData = iconData;
          img.name = "icon-image";

          canvas.add(img);

          // Apply layer management - IMMEDIATE arrangement
          if (layerManager) {
            layerManager.setObjectLayer(img);
            layerManager.arrangeCanvasLayers();
          }

          console.log(
            "✅ Icon added with proper layer (zIndex: 4) - Non-moveable"
          );

          URL.revokeObjectURL(svgUrl);
        });
      });
    } catch (error) {
      console.error("Failed to load icon:", error);
    }
  };

  const applySelectedDesign = (designData) => {
    if (!designData || !editor?.canvas) return;

    console.log("🎨 Applying user-selected design:", designData.name);

    handleAddDesignToCanvas(
      designData.url,
      designData.position,
      designData.offsetX,
      designData.offsetY
    );
  };

  // Initialize canvas with product - UPDATED for default layers
  useEffect(() => {
    if (!selectedProduct || !editor?.canvas) return;

    console.log(
      `🆕 Initializing canvas for product ${selectedProduct.id} (${selectedProduct.type})`
    );

    const initializeCanvas = () => {
      import("fabric").then(({ Image }) => {
        editor.canvas.clear();

        // For products with defaultLayers, show only shadow/outline initially
        const showProductImage = !selectedProduct.defaultLayers;

        if (showProductImage) {
          // Show full product image (for t-shirts, etc.)
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = selectedProduct.image;

          img.onload = () => {
            const targetWidth = selectedProduct.width || 300;
            const targetHeight =
              selectedProduct.height || targetWidth * (img.height / img.width);

            const scaleX = targetWidth / img.width;
            const scaleY = targetHeight / img.height;

            const fabricImg = new Image(img, {
              left: editor.canvas.getWidth() / 2,
              top: editor.canvas.getHeight() / 2,
              isTshirtBase: true,
              originX: "center",
              originY: "center",
              scaleX: scaleX,
              scaleY: scaleY,
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              flipX: flipX,
              flipY: flipY,
            });

            fabricImg.customId = selectedProduct.id;
            editor.canvas.add(fabricImg);

            if (layerManager) {
              layerManager.setObjectLayer(fabricImg);
              layerManager.arrangeCanvasLayers();
            }

            fabricImg.setCoords();
            editor.canvas.renderAll();
            console.log(
              `✅ Product loaded with dimensions: ${targetWidth}x${targetHeight}`
            );
          };

          img.onerror = () => {
            console.error(
              "Failed to load product image:",
              selectedProduct.image
            );
          };
        } else {
          // For products with defaultLayers (shoes), create invisible base
          const targetWidth = selectedProduct.width || 300;
          const targetHeight = selectedProduct.height || 300; // Square for shoes

          // Create invisible base rectangle to define product bounds
          import("fabric").then((fabric) => {
            const baseRect = new fabric.Rect({
              left: editor.canvas.getWidth() / 2,
              top: editor.canvas.getHeight() / 2,
              width: targetWidth,
              height: targetHeight,
              isTshirtBase: true,
              originX: "center",
              originY: "center",
              fill: "transparent",
              stroke: "transparent",
              selectable: false,
              evented: false,
              hasControls: false,
              hasBorders: false,
              lockMovementX: true,
              lockMovementY: true,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              visible: false, // Make it invisible but keep for bounds calculation
            });

            baseRect.customId = selectedProduct.id;
            editor.canvas.add(baseRect);

            if (layerManager) {
              layerManager.setObjectLayer(baseRect);
              layerManager.arrangeCanvasLayers();
            }

            console.log(
              `✅ Invisible base created for layered product: ${targetWidth}x${targetHeight}`
            );

            // Load default layers after base is created
            setTimeout(() => {
              loadDefaultLayers();
            }, 100);
          });
        }
      });
    };

    const timeoutId = setTimeout(initializeCanvas, 100);
    return () => clearTimeout(timeoutId);
  }, [selectedProduct?.id, editor, layerManager]);

  // Setup canvas event handlers - No selection allowed
  useEffect(() => {
    if (!editor || !editor.canvas) return;

    const canvas = editor.canvas;

    // Disable selection completely
    canvas.selection = false;
    canvas.hoverCursor = "default";
    canvas.defaultCursor = "default";

    const handleObjectMoving = (e) => {
      // Product should stay in center
      if (e.target.isTshirtBase) {
        e.target.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
        });
        e.target.setCoords();
        return;
      }

      // Prevent any object from moving
      e.preventDefault();
      return false;
    };

    const handleObjectModified = (e) => {
      // Prevent any modifications
      e.preventDefault();
      return false;
    };

    const handleSelectionCreated = (e) => {
      // Prevent any selections
      canvas.discardActiveObject();
      canvas.renderAll();
    };

    // Prevent canvas click from affecting layers
    const handleCanvasClick = (e) => {
      // Maintain layer order after any interaction
      if (layerManager) {
        setTimeout(() => {
          layerManager.arrangeCanvasLayers();
        }, 10);
      }
    };

    canvas.on("object:moving", handleObjectMoving);
    canvas.on("object:scaling", handleObjectMoving);
    canvas.on("object:rotating", handleObjectMoving);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("mouse:down", handleCanvasClick);

    return () => {
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:scaling", handleObjectMoving);
      canvas.off("object:rotating", handleObjectMoving);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("mouse:down", handleCanvasClick);
    };
  }, [editor, selectedProduct?.id, layerManager]);

  // Update text properties for active text object
  useEffect(() => {
    if (!editor || !editor.canvas) return;

    const canvas = editor.canvas;
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "i-text") {
      activeObject.set({
        fill: textColor,
        fontFamily: fontFamily,
        fontStyle: fontStyle,
        flipX: textFlipX,
        flipY: textFlipY,
      });
      canvas.renderAll();
    }
  }, [textColor, fontFamily, fontStyle, textFlipX, textFlipY, editor]);

  const baseUrl = "https://my-backend-blond.vercel.app";

  const uploadToCloudinaryImg = async ({ image }) => {
    try {
      const formdata = new FormData();
      formdata.append("image", image);

      const response = await fetch(`${baseUrl}/uploadfile`, {
        method: "POST",
        body: formdata,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const getSelectedVariantsData = () => {
    if (!selectedProduct?.variants || !activeVariants) return [];
    return selectedProduct.variants.map(variantGroup => {
      const selectedId = activeVariants[variantGroup.category];
      const selectedOption = variantGroup.options.find(opt => opt.id === selectedId);
      if (!selectedOption) return null;
      return {
        category: variantGroup.category,
        name: variantGroup.name,
        id: selectedOption.id,
        price: selectedOption.price,
        image: selectedOption.thumbnail || selectedOption.url || null
      };
    }).filter(Boolean);
  };

  const getSelectedVariantsTotalPrice = (selectedVariantsData) => {
    return selectedVariantsData.reduce((sum, v) => sum + (Number(v.price) || 0), 0);
  };

  const handleSave = async (screenshotsFrom3D = null) => {
    if (!editor?.canvas) {
      alert("Canvas not ready!");
      return { success: false, error: "Canvas not ready" };
    }

    if (!selectedProduct) {
      alert("No product selected!");
      return { success: false, error: "No product selected" };
    }

    if (selectedProduct.ProductType === "3d") {
      setIsSaving(true);
      setPageLoading(true);

      try {
        // Upload screenshots to Cloudinary
        let cloudinaryScreenshots = [];
        const screenshots =
          screenshotsFrom3D || customizationData?.screenshots || [];
        for (const screenshot of screenshots) {
          const blob = await (await fetch(screenshot.image)).blob();
          const file = new File([blob], `3d-screenshot-${Date.now()}.png`, {
            type: "image/png",
          });
          const cloudinaryResponse = await uploadToCloudinaryImg({
            image: file,
          });
          cloudinaryScreenshots.push({
            angle: screenshot.angle,
            url: cloudinaryResponse.url,
          });
        }

        // Upload applied design/image/logo to Cloudinary (if present)
        let appliedImageCloudUrl = null;
        const appliedImageUrl =
          customizationData?.parts?.[customizationData?.selectedPart]?.image
            ?.url;
        if (appliedImageUrl) {
          const blob = await (await fetch(appliedImageUrl)).blob();
          const file = new File([blob], `3d-applied-image-${Date.now()}.png`, {
            type: "image/png",
          });
          const cloudinaryResponse = await uploadToCloudinaryImg({
            image: file,
          });
          appliedImageCloudUrl = cloudinaryResponse.url;
        }

        // NEW: Get selected variants data
        const selectedVariantsData = getSelectedVariantsData();
        const selectedVariantsTotalPrice = getSelectedVariantsTotalPrice(selectedVariantsData);
        const totalPatternPrice = getTotalPatternPrice();

        // Combine prices
        const krCustomizedPrice = Number(totalPatternPrice) + Number(selectedVariantsTotalPrice);

        // Prepare save payload - exclude screenshots from customizations
        const { screenshots: _, ...customizationsWithoutScreenshots } = customizationData;

        const saveData = {
          storeHash: selectedProduct.storeHash || '1234',
          customizations: {
            ...customizationsWithoutScreenshots,
            appliedImageCloudUrl,
            krCustomizedPrice,
            selectedVariants: selectedVariantsData
          },
          screenshots: cloudinaryScreenshots,
          ProductType: "3d",
        };

        let savedProductId = null;
        let savedData = null;

        try {
          // Save to backend
          const response = await fetch(
            "https://customise.shikharjobs.com/api/save-product",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(saveData),
            }
          );

          if (response.ok) {
            const result = await response.json();
            savedProductId =
              result.product?.id ||
              result._id ||
              result.data?._id ||
              result.product?._id;
            savedData = {
              krDesignId: savedProductId,
              krCustomizedPrice, // <-- Only this price now
              selectedVariants: selectedVariantsData,
            };

            localStorage.setItem("krDesignData", JSON.stringify(savedData));
            const existingDesigns = JSON.parse(
              localStorage.getItem("krDesigns") || "{}"
            );
            existingDesigns[savedProductId] = savedData;
            localStorage.setItem("krDesigns", JSON.stringify(existingDesigns));

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          } else {
            throw new Error("Save failed");
          }
          setSavedDesignData({ customizationData });
          setIsDesignSaved(true);
          setShowAddToCart(true);
        } catch (apiError) {
          const localId = `local_${Date.now()}`;
          savedData = {
            krDesignId: localId,
            krCustomizedPrice, // <-- Only this price now
            selectedVariants: selectedVariantsData,
          };

          localStorage.setItem("krDesignData", JSON.stringify(savedData));
          const existingDesigns = JSON.parse(
            localStorage.getItem("krDesigns") || "{}"
          );
          existingDesigns[savedData.krDesignId] = savedData;
          localStorage.setItem("krDesigns", JSON.stringify(existingDesigns));
        }

        return {
          success: true,
          productId: savedProductId,
          savedData: savedData,
        };
      } catch (error) {
        alert("Save failed: " + error.message);
        return { success: false, error: error.message };
      } finally {
        setIsSaving(false);
        setPageLoading(false);
      }
    } else if (selectedProduct.ProductType === "2d") {
      setIsSaving(true);
      setPageLoading(true);

      try {
        // Take screenshot of canvas
        const canvasDataURL = editor.canvas.toDataURL({
          format: "png",
          quality: 1,
        });

        // Upload canvas screenshot to Cloudinary
        const blob = await (await fetch(canvasDataURL)).blob();
        const file = new File([blob], `2d-design-${Date.now()}.png`, {
          type: "image/png",
        });
        const cloudinaryResponse = await uploadToCloudinaryImg({ image: file });

        // Get current 2D customization data
        const current2DData = {
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
          selectedLayers,
        };

        // Prepare save payload for 2D
        const saveData = {
          timestamp: new Date().toISOString(),
          storeHash: selectedProduct.storeHash || '1234',
          customizations: current2DData,
          canvas: editor.canvas.toJSON(),
          ProductType: "2d",
          screenshots: [
            {
              angle: "finalProduct",
              url: cloudinaryResponse.url,
            },
          ],
        };

        let savedProductId = null;
        let savedData = null;

        try {
          // Save to backend
          const response = await fetch(
            "https://customise.shikharjobs.com/api/save-product",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(saveData),
            }
          );

          if (response.ok) {
            const result = await response.json();
            // Extract product ID from the correct path in response
            savedProductId =
              result.product?.id ||
              result._id ||
              result.data?._id ||
              result.product?._id;
            savedData = {
              krDesignId: savedProductId, // Store actual database ID
              krImageURL: [cloudinaryResponse.url], // Store as array for consistency
              krDesignArea: current2DData, // Store all customizations
              customizationData: current2DData,
              canvas: editor.canvas.toJSON(),
            };

            // Store in localStorage
            localStorage.setItem("krDesignData", JSON.stringify(savedData));

            // Store designs in an object
            const existingDesigns = JSON.parse(
              localStorage.getItem("krDesigns") || "{}"
            );
            existingDesigns[savedProductId] = savedData;
            localStorage.setItem("krDesigns", JSON.stringify(existingDesigns));

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            // setIsDesignSaved(true);
            // setShowAddToCart(true);
          } else {
            throw new Error("Save failed");
          }
          // setSavedDesignData({ customizationData: current2DData });
          // setIsDesignSaved(true);
          // setShowAddToCart(true);
          // setSavedDesignData({ customizationData: current2DData }); // <-- update first
          // setIsDesignSaved2D(true);
          // setShowAddToCart2D(true);
          handleDesignSaved({ customizationData: current2DData });
        } catch (apiError) {
          console.error("Database save error:", apiError);

          // Even if API fails, store in localStorage with local ID
          const localId = `local_${Date.now()}`;
          console.log("2D API failed, using local ID:", localId);
          savedData = {
            krDesignId: localId, // Use local ID when API fails
            krImageURL: [cloudinaryResponse.url], // Store as array for consistency
            krDesignArea: current2DData, // Store all customizations
            customizationData: current2DData,
            canvas: editor.canvas.toJSON(),
          };

          localStorage.setItem("krDesignData", JSON.stringify(savedData));

          const existingDesigns = JSON.parse(
            localStorage.getItem("krDesigns") || "{}"
          );
          existingDesigns[savedData.krDesignId] = savedData;
          localStorage.setItem("krDesigns", JSON.stringify(existingDesigns));
          handleDesignSaved({ customizationData: current2DData });
        }

        return {
          success: true,
          productId: savedProductId,
          savedData: savedData,
        };
      } catch (error) {
        alert("Save failed: " + error.message);
        return { success: false, error: error.message };
      } finally {
        setIsSaving(false);
        setPageLoading(false)
      }
    }
  };

  console.log("🔍 Debug threeDselectedPart:", threeDselectedPart);
  console.log("🔍 Debug activeVariants:", activeVariants);
  console.log("🔍 Debug prev.parts:", parts);

  const getTotalPatternPrice = () => {
    if (!customizationData?.parts) return 0;
    let total = 0;
    Object.values(customizationData.parts).forEach(part => {
      if (part?.image?.price) {
        total += Number(part.image.price);
      }
    });
    return total;
  };

  useEffect(() => {
    setPageLoading(props?.pageLoading || false);
  }, [props?.pageLoading]);

  return (
    <div className="kr-layout-container kr-reset-margin">
      {pageLoading && <div className="kr-loading-overlay">
        <div className="kr-spinner"></div></div>}
      <Topbar
        setShowSidebar={setShowSidebar}
        onSave={handleSave}
        isSaving={isSaving}
        selectedProduct={selectedProduct}
        productPrice={props?.productPrice || 0}
        currencyCode={props?.currencyCode || '$'}
        productQuantity={props?.productQuantity || 1}
        onTotalPriceChange={setTotalPrice}
        totalPrice={totalPrice}
      />

      {showSidebar && selectedProduct && (
        <Sidebar
          bringForward={() => updateArrange("bringForward")}
          currencyCode={props?.currencyCode}
          editor={editor}
          layerManager={layerManager}
          selectedProduct={selectedProduct}
          customText={customText}
          textSize={textSize}
          textSpacing={textSpacing}
          textArc={textArc}
          setTextFontFamily={setFontFamily}
          setFontStyle={setFontStyle}
          setTextColor={setTextColor}
          setFlipX={setFlipX}
          setFlipY={setFlipY}
          setTextFlipX={setTextFlipX}
          setTextFlipY={setTextFlipY}
          handleAddCustomText={handleAddCustomText}
          setCustomText={setCustomText}
          showAddModal={showAddModal}
          showEditModal={showEditModal}
          setShowAddModal={setShowAddModal}
          setShowEditModal={setShowEditModal}
          setTextSize={setTextSize}
          setTextSpacing={setTextSpacing}
          setTextArc={setTextArc}
          handleColorChange={handleColorChange}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          addEmojiTextToCanvas={addEmojiTextToCanvas}
          updateArrange={updateArrange}
          setChangeTextColor={setTextColor}
          setChangeFontFamily={setFontFamily}
          setChangeFontStyle={setFontStyle}
          setChangeFlipX={setFlipX}
          setChangeFlipy={setFlipY}
          alignFabricObject={alignFabricObject}
          setChangeTextFlipX={setTextFlipX}
          setChangeTextFlipY={setTextFlipY}
          handleAddDesignToCanvas={handleAddDesignToCanvas}
          addIconToCanvas={addIconToCanvas}
          handleAddPatternToCanvas={handleAddPatternToCanvas}
          applySelectedDesign={applySelectedDesign}
          handleTopColorChange={handleTopColorChange}
          handleBottomColorChange={handleBottomColorChange}
          selectedTopColor={selectedTopColor}
          selectedBottomColor={selectedBottomColor}
          handleDynamicLayerChange={handleDynamicLayerChange}
          selectedLayers={selectedLayers}
        />
      )}

      {selectedProduct?.ProductType !== "3d" && (
        <FabricJSCanvas
          className="kr-canvas-container"
          onReady={onReady}
          editor={editor}
          savedProductId={currentProductId}
        />
      )}

      {selectedProduct?.ProductType === "3d" && <ThreeDCustomize />}

      {selectedProduct?.ProductType === "3d" && threeDloading && (
        <div className="kr-loading-overlay kr-reset-margin-padding">
          <div className="kr-loading-content kr-reset-margin-padding">
            <div className="kr-loading-spinner "></div>
            <div className="kr-loading-text">Capturing screenshots...</div>
          </div>
        </div>
      )}

      {selectedProduct?.ProductType === "3d" &&
        threeDscreenshots.length > 0 &&
        showScreenshotsModal && (
          <ScreenshotGallery
            screenshots={threeDscreenshots}
            totalPrice={totalPrice}
            productQuantity={props?.productQuantity || 1}
            onClose={() => setthreeDScreenshots([])}
            onDownloadAll={() => console.log("All downloaded")}
          />
        )}

      {/*
        {selectedProduct && (
          <div className="kds-controls-bar">
            <div className="kds-controls-group">
              <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749345256/undo_kp3eto.png" alt="undo" />
              <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749345256/undo_kp3eto.png" alt="redo" className="kds-transform-flip" />
            </div>
            <hr className="kds-controls-divider" />
              <div className="kds-controls-zoom">
                <FaMinus />
                <span className="kds-reset">100%</span>
                <FaPlus />
              </div>
          </div>
        )}
      */}

      {selectedProduct?.ProductType === "3d" && parts.length > 0 && (
        <div className="kr-controls-bar">
          {parts.map((part) => (
            <button
              key={part}
              onClick={() => setthreeDSelectedPart(part)}
              className={`kr-part-button kr-reset-margin ${threeDselectedPart === part ? "active" : ""
                }`}
            >
              {part}
            </button>
          ))}
        </div>
      )}

      <LayerContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isVisible={contextMenu.isVisible}
        selectedObject={contextMenu.selectedObject}
        onClose={closeContextMenu}
        onDelete={handleDelete}
        onLock={handleLock}
        onFlipHorizontal={handleFlipHorizontal}
        onFlipVertical={handleFlipVertical}
        onBringToFront={handleBringToFront}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
        onSendToBack={handleSendToBack}
      />

      {saveSuccess && (
        <div className="kr-save-success kr-reset-margin">
          <div className="kr-save-success-content kr-reset-margin-padding">
            <svg
              className="kr-save-success-icon kr-reset-margin-padding"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="kr-reset">Design saved successfully!</span>
          </div>
        </div>
      )}

      {showChatBox && (
        <div className="kr-chat-box kr-reset-margin-padding">
          <div className="kr-chat-header kr-reset-margin">
            <div className="kr-chat-header-top kr-reset-margin-padding">
              <img
                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749345784/qqchat_jn7bok.png"
                alt=""
              />
              <img
                onClick={() => setShowChatBox(false)}
                src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png"
                alt=""
                className="kr-chat-close-btn"
              />
            </div>
            <div className="kr-chat-title kr-reset-padding">
              <h2 className="kr-reset-margin-padding">
                Customizer's Help Center
              </h2>
              <p className="kr-reset-margin-padding">
                How can we help you today?
              </p>
            </div>
          </div>

          <div className="kr-chat-content kr-reset-margin-padding">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="kr-chat-item kr-reset-margin">
                  <span className="kr-chat-item-text kr-reset-margin-padding">
                    How customizer work?
                  </span>
                  <span className="kr-chat-item-arrow kr-reset-margin-padding">
                    ›
                  </span>
                </div>
                <hr className="kr-chat-divider kr-reset-margin-padding" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div onClick={() => setShowChatBox(!showChatBox)} className="kr-chat-button kr-reset-margin">
        <img src="https://res.cloudinary.com/dd9tagtiw/image/upload_v1749345784/qqchat_jn7bok.png" alt="chat" />
      </div> */}
    </div>
  );
};

export default CustomizerLayout;
