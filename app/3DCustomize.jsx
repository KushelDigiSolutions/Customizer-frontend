'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/3d/ModelViewer';
import { Suspense, useEffect, useRef } from 'react';
// import TextureControlsPanel from './components/3d/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import { use3D } from './context/3DContext';
import './3DCustomize.css';
import ScreenshotManager from './components/3d/ScreenshotManage';

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
    activeVariants,
    setActiveVariants,
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
    if (setPageLoading) setPageLoading(true);
  }, [modelUrl, setPageLoading]);

  return (
    <main className="kds-main">
      <div className="kds-canvas-container">
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 0.5, 2.5], fov: 80 }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <ModelViewer modelUrl={modelUrl} selectedPart={threeDselectedPart} setPageLoading={setPageLoading} />

          <ScreenshotManager ref={screenshotRef} />
          <OrbitControls
            enableZoom={true}
            maxDistance={4}
            enablePan={true}
          />
        </Canvas>
      </div>

      {/* <div className="kds-controls-container">
        {selectedProduct?.variants?.map(group => (
          <div key={group.id} className="kds-variant-group">
            <h3 className="kds-variant-title">{group.name}</h3>
            <div className="kds-variant-options">
              {group.options.map(opt => (
                <button
                  key={opt.id}
                  className={
                    activeVariants?.[group.category] === opt.id
                      ? 'kds-variant-btn kds-active'
                      : 'kds-variant-btn'
                  }
                  onClick={() =>
                    setActiveVariants(prev => ({ ...prev, [group.category]: opt.id }))
                  }
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        ))}

      </div> */}
    </main>
  );
}