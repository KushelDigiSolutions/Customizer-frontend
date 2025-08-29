'use client'

import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { use3D } from '../../context/3DContext';

// Helper to hide/show meshes in a group
function setGroupVisibility(scene, group, meshNameToShow) {
  // Hide ALL meshes in this group
  const names = group.options.map(o => o.meshName).filter(name => name !== undefined);
  names.forEach(name => {
    // Hide all meshes, including those with empty meshName
    if (name !== "") {
      const obj = scene.getObjectByName(name);
      if (obj) obj.visible = false;
    }
  });

  // Show only the selected mesh (unless meshNameToShow is empty string)
  if (meshNameToShow && meshNameToShow !== "") {
    const obj = scene.getObjectByName(meshNameToShow);
    if (obj) obj.visible = true;
  }
}

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
    setSkeletonLoading
  } = use3D();

  const { scene } = useGLTF(modelUrl);

  // Hide loader when model is loaded
  useEffect(() => {
    if (scene && setPageLoading) {
      registerModel(scene);
      setPageLoading(false);
      setSkeletonLoading(false);
    }
  }, [scene, setPageLoading]);

  // 1) On load → apply default visibility per group
  useLayoutEffect(() => {
    if (!scene || !selectedProduct?.variants) return;

    selectedProduct.variants.forEach(group => {
      const def = group.options.find(o => o.isDefault) || group.options[0];
      const showName = def?.meshName ?? ""; // empty = hide whole group
      setGroupVisibility(scene, group, showName);
    });
  }, [scene, selectedProduct]);

  // 2) When user changes a variant → update only that group's visibility
  useLayoutEffect(() => {
    if (!scene || !selectedProduct?.variants || !activeVariants) return;

    selectedProduct.variants.forEach(group => {
      const selectedId = activeVariants[group.category];
      const selected =
        group.options.find(o => o.id === selectedId) ||
        group.options.find(o => o.isDefault) ||
        group.options[0];

      const showName = selected?.meshName ?? ""; // empty = "No X"
      setGroupVisibility(scene, group, showName);
    });
  }, [activeVariants, scene, selectedProduct]);

  // useEffect(() => {
  //   setCustomizationData(prev => ({
  //     ...prev,
  //     parts: {
  //       ...prev.parts,
  //       [selectedPart]: {
  //         ...prev.parts?.[selectedPart],
  //         color: threeDcolor
  //       }
  //     }
  //   }));
  // }, [threeDcolor, selectedPart, setCustomizationData]);

  // --- Your existing material / texture logic (kept intact) ---
  // useEffect(() => {
  //   scene.traverse((child) => {
  //     if (child.isMesh && child.name === threeDselectedPart) {
  //       child.material.color.set(threeDcolor || '#ffffff');
  //       child.material.needsUpdate = true;
  //     }
  //   });
  // }, [threeDcolor, threeDselectedPart, scene]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!threeDselectedPart || child.name === threeDselectedPart) {
          // If no part selected → apply to ALL meshes
          child.material.color.set(threeDcolor || '#ffffff');
          child.material.needsUpdate = true;
        }
      }
    });
  }, [threeDcolor, threeDselectedPart, scene]);

  // useEffect(() => {
  //   scene.traverse((child) => {
  //     if (child.isMesh && child.name === threeDselectedPart) {
  //       const originalColor = child.material.color;
  //       const currentColorHex = `#${originalColor.getHexString()}`;

  //       if (threeDcolor && threeDcolor !== '#ffffff') {
  //         child.material.color.set(threeDcolor);
  //       } else {
  //         child.material.color.set(currentColorHex);
  //       }

  //       if (threeDtexture || threeDtextTexture) {
  //         const canvas = document.createElement('canvas');
  //         canvas.width = canvas.height = 1024;
  //         const ctx = canvas.getContext('2d');

  //         ctx.fillStyle = threeDcolor && threeDcolor !== '#ffffff' ? threeDcolor : currentColorHex;
  //         ctx.fillRect(0, 0, canvas.width, canvas.height);

  //         if (threeDtexture?.image) {
  //           const repeat = threeDzoom || 1;
  //           const offsetXPx = (threeDoffsetX || 0) * canvas.width;
  //           const offsetYPx = (threeDoffsetY || 0) * canvas.height;
  //           const drawWidth = canvas.width / repeat;
  //           const drawHeight = canvas.height / repeat;

  //           ctx.save();
  //           ctx.translate(offsetXPx, offsetYPx);
  //           for (let x = 0; x < canvas.width; x += drawWidth) {
  //             for (let y = 0; y < canvas.height; y += drawHeight) {
  //               ctx.drawImage(threeDtexture.image, x, y, drawWidth, drawHeight);
  //             }
  //           }
  //           ctx.restore();
  //         }

  //         if (threeDtextTexture?.image) {
  //           ctx.drawImage(threeDtextTexture.image, 0, 0, canvas.width, canvas.height);
  //         }

  //         const combinedTexture = new THREE.CanvasTexture(canvas);
  //         combinedTexture.needsUpdate = true;
  //         combinedTexture.wrapS = combinedTexture.wrapT = THREE.RepeatWrapping;
  //         combinedTexture.repeat.set(1, 1);
  //         combinedTexture.offset.set(0, 0);
  //         combinedTexture.center.set(0.5, 0.5);

  //         child.material.map = combinedTexture;
  //         child.material.transparent = false;
  //         child.material.needsUpdate = true;
  //       } else {
  //         child.material.map = null;
  //         child.material.transparent = false;
  //         child.material.needsUpdate = true;
  //       }
  //     }
  //   });
  // }, [
  //   threeDcolor,
  //   threeDtexture,
  //   threeDtextTexture,
  //   threeDselectedPart,
  //   threeDzoom,
  //   threeDoffsetX,
  //   threeDoffsetY,
  //   threeDtextScale,
  //   threeDtextPosX,
  //   threeDtextPosY,
  //   scene
  // ]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!threeDselectedPart || child.name === threeDselectedPart) {
          // Build a canvas to merge color + texture + text
          const originalColor = child.material.color;
          const currentColorHex = `#${originalColor.getHexString()}`;

          if (threeDcolor && threeDcolor !== '#ffffff') {
            child.material.color.set(threeDcolor);
          } else {
            child.material.color.set(currentColorHex);
          }

          if (threeDtexture || threeDtextTexture) {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            // background fill
            ctx.fillStyle = threeDcolor && threeDcolor !== '#ffffff' ? threeDcolor : currentColorHex;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // texture
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

            // text overlay
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

  useEffect(() => {
    if (!threeDselectedPart || !threeDcolor) return;

    scene.traverse((child) => {
      if (child.isMesh && child.name === threeDselectedPart) {
        // Update customizationData only for changed part
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
