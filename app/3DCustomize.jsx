'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/3d/ModelViewer';
import { Suspense, useEffect, useRef, useState } from 'react';
// import TextureControlsPanel from './components/3d/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import { use3D } from './context/3DContext';
import './3DCustomize.css';
import ScreenshotManager from './components/3d/ScreenshotManage';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ThreeDCustomize({ setPageLoading }) {
  const {
    threeDselectedPart,
    threeDtext,
    setthreeDText,
    setthreeDTextTexture,
    threeDtextColor,
    threeDoutlineColor,
    threeDtextScale,
    threeDtextPosX,
    setthreeDTextPosX,
    threeDtextPosY,
    setthreeDTextPosY,
    setCustomizationData,
    screenshotRef,
    selectedProduct,
    threeDtextFontFamily, // ADD THIS
    threeDtextFontStyle,
    threeDtextFontWeight,
    controlsRef,
    isRotating,
    activeVariants,
    setActiveVariants,
    threeDloading,
    setthreeDLoading,
    skeletonLoading, setSkeletonLoading
  } = use3D();

  // const screenshotRef = useRef();

  // Reset text position to center when text changes or part changes
  const handleTextChange = (newText) => {
    setthreeDText(newText);
    if (newText.trim() && !threeDtext.trim()) {
      setthreeDTextPosX(0.5);
      setthreeDTextPosY(0.5);
    }
  };

  useEffect(() => {
    if (threeDtext.trim()) {
      const texture = createTextTexture({
        text: threeDtext,
        fill: threeDtextColor,
        stroke: threeDoutlineColor,
        baseColor: 'transparent',
        textScale: threeDtextScale,
        textPosX: threeDtextPosX,
        textPosY: threeDtextPosY,
        fontWeight: threeDtextFontWeight,
        fontStyle: threeDtextFontStyle,
        fontFamily: threeDtextFontFamily || 'Arial', // PASS FONT FAMILY
      });
      setthreeDTextTexture(texture);

      setCustomizationData((prev) => ({
        ...prev,
        parts: {
          ...prev.parts,
          [threeDselectedPart]: {
            ...prev.parts[threeDselectedPart],
            text: {
              content: threeDtext,
              color: threeDtextColor,
              outline: threeDoutlineColor,
              scale: threeDtextScale,
              position: { x: threeDtextPosX, y: threeDtextPosY },
              fontFamily: threeDtextFontFamily || 'Arial', // SAVE FONT FAMILY
              fontWeight: threeDtextFontWeight,    // <-- Save fontWeight
              fontStyle: threeDtextFontStyle,
            },
          },
        },
      }));
    } else {
      setthreeDTextTexture(null);
    }
  }, [
    threeDtext,
    threeDtextColor,
    threeDoutlineColor,
    threeDtextScale,
    threeDtextPosX,
    threeDtextPosY,
    threeDselectedPart,
    threeDtextFontFamily,
    threeDtextFontWeight,
    threeDtextFontStyle
  ]);

  const modelUrl = selectedProduct?.modelFile || '/models/brand1.glb';

  useEffect(() => {
    if (setPageLoading) {
      setPageLoading(true);
      setSkeletonLoading(true);
    }
  }, [modelUrl, setPageLoading]);

  return (
    <main className="kds-main">
      <div className="kds-canvas-container" style={{ position: 'relative' }}>
        {skeletonLoading && (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Skeleton width="100%" height="100%" />
          </div>
        )}
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          shadows
          camera={{ position: [0, 0.5, 2.5], fov: 80 }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <ModelViewer modelUrl={modelUrl} selectedPart={threeDselectedPart} setPageLoading={setPageLoading} />

          <ScreenshotManager ref={screenshotRef} />
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            maxDistance={5}
            enablePan={true}
            autoRotate={isRotating}
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>
    </main>
  );
}