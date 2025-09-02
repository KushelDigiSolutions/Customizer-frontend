'use client'

import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { use3D } from '../../context/3DContext';

// Sets visibility for a group of meshes in the scene based on the selected mesh name.
function setGroupVisibility(scene, group, meshNameToShow) {
  const names = group.options.map(o => o.meshName).filter(name => name !== undefined);
  names.forEach(name => {
    if (name !== "") {
      const obj = scene.getObjectByName(name);
      if (obj) obj.visible = false;
    }
  });

  if (meshNameToShow && meshNameToShow !== "") {
    const obj = scene.getObjectByName(meshNameToShow);
    if (obj) obj.visible = true;
  }
}

// Renders and manages the 3D product model, applying color, texture, and text customizations.
const ModelViewer = ({ modelUrl, setPageLoading }) => {
  const {
    threeDcolor,
    threeDtexture,
    threeDtextTexture,
    threeDselectedPart,
    threeDzoom,
    threeDoffsetX,
    threeDoffsetY,
    threeDtextScale,
    threeDtextPosX,
    threeDtextPosY,
    setCustomizationData,
    selectedProduct,
    activeVariants,
    registerModel,
    setthreeDloading,
    setSkeletonLoading,
    originalColors
  } = use3D();

  const { scene } = useGLTF(modelUrl);

  // Registers the loaded model and disables loading states.
  useEffect(() => {
    if (scene && setPageLoading) {
      registerModel(scene);
      setPageLoading(false);
      setSkeletonLoading(false);
    }
  }, [scene, setPageLoading]);

  // Sets default mesh visibility for each variant group on initial load.
  useLayoutEffect(() => {
    if (!scene || !selectedProduct?.variants) return;

    selectedProduct.variants.forEach(group => {
      const def = group.options.find(o => o.isDefault) || group.options[0];
      const showName = def?.meshName ?? "";
      setGroupVisibility(scene, group, showName);
    });
  }, [scene, selectedProduct]);

  // Updates mesh visibility based on activeVariants selection.
  useLayoutEffect(() => {
    if (!scene || !selectedProduct?.variants || !activeVariants) return;

    selectedProduct.variants.forEach(group => {
      const selectedId = activeVariants[group.category];
      const selected =
        group.options.find(o => o.id === selectedId) ||
        group.options.find(o => o.isDefault) ||
        group.options[0];

      const showName = selected?.meshName ?? "";
      setGroupVisibility(scene, group, showName);
    });
  }, [activeVariants, scene, selectedProduct]);

  // Applies color or restores original color/map to the selected mesh part.
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh && child.name === threeDselectedPart) {
        if (threeDcolor) {
          child.material.color.set(threeDcolor);
          child.material.map = null; 
        } else {
          const original = originalColors.current[child.name];
          if (original) {
            child.material.color.copy(original.color);
            child.material.map = original.map || null;
          }
        }
        child.material.needsUpdate = true;
      }
    });
  }, [threeDcolor, threeDselectedPart, scene, originalColors]);

  // Applies color, texture, and text texture to the selected mesh part.
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name === threeDselectedPart) {
        const originalColor = child.material.color;
        const currentColorHex = `#${originalColor.getHexString()}`;

        if (threeDcolor) {
          child.material.color.set(threeDcolor);
        } else {
          const original = originalColors.current[child.name];
          if (original) {
            child.material.color.copy(original.color);
            child.material.map = original.map;
          }
        }

        if (threeDtexture || threeDtextTexture) {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1024;
          const ctx = canvas.getContext('2d');

          const baseColor = threeDcolor
            ? threeDcolor
            : (originalColors.current[child.name]
              ? `#${originalColors.current[child.name].color.getHexString()}`
              : currentColorHex);

          ctx.fillStyle = baseColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          if (threeDtexture?.image) {
            const repeat = threeDzoom || 1;
            const offsetXPx = (threeDoffsetX || 0) * canvas.width;
            const offsetYPx = (threeDoffsetY || 0) * canvas.height;
            const drawWidth = canvas.width / repeat;
            const drawHeight = canvas.height / repeat;

            ctx.save();
            ctx.translate(offsetXPx, offsetYPx);
            for (let x = 0; x < canvas.width; x += drawWidth) {
              for (let y = 0; y < canvas.height; y += drawHeight) {
                ctx.drawImage(threeDtexture.image, x, y, drawWidth, drawHeight);
              }
            }
            ctx.restore();
          }

          if (threeDtextTexture?.image) {
            ctx.drawImage(threeDtextTexture.image, 0, 0, canvas.width, canvas.height);
          }

          const combinedTexture = new THREE.CanvasTexture(canvas);
          combinedTexture.needsUpdate = true;
          combinedTexture.wrapS = combinedTexture.wrapT = THREE.RepeatWrapping;
          combinedTexture.repeat.set(1, 1);
          combinedTexture.offset.set(0, 0);
          combinedTexture.center.set(0.5, 0.5);

          child.material.map = combinedTexture;
          child.material.transparent = false;
          child.material.needsUpdate = true;
        } else {
          child.material.map = null;
          child.material.transparent = false;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [
    threeDcolor,
    threeDtexture,
    threeDtextTexture,
    threeDselectedPart,
    threeDzoom,
    threeDoffsetX,
    threeDoffsetY,
    threeDtextScale,
    threeDtextPosX,
    threeDtextPosY,
    scene
  ]);

  // Updates customizationData state when the selected part's color changes.
  useEffect(() => {
    if (!threeDselectedPart || !threeDcolor) return;

    scene.traverse((child) => {
      if (child.isMesh && child.name === threeDselectedPart) {
        setCustomizationData(prev => ({
          ...prev,
          parts: {
            ...prev.parts,
            [threeDselectedPart]: {
              ...(prev.parts?.[threeDselectedPart] || {}),
              color: threeDcolor
            }
          }
        }));
      }
    });
  }, [threeDcolor, threeDselectedPart, scene, setCustomizationData]);

  return (
    <Center>
      <primitive object={scene} scale={Number(selectedProduct?.modelSize) || 0.5} position={[0, 0, 0]} />
    </Center>
  );
};

export default ModelViewer;
