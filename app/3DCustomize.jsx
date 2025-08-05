'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/3d/ModelViewer';
import TextureUploader from './components/3d/TextureUploader';
import ControlsPanel from './components/3d/ControlsPanel';
import { Suspense, useEffect, useRef } from 'react';
import TextureControlsPanel from './components/3d/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import ScreenshotManager from './components/3d/ScreenshotManage';
import ScreenshotGallery from './components/3d/ScreenshotGallery';
import TextControlsPanel from './components/3d/TextControlsPanel';
import { use3D } from './context/3DContext';

export default function ThreeDCustomize() {

  const { threeDcolor, setthreeDColor,
      threeDtexture, setthreeDTexture,
      threeDselectedPart, setthreeDSelectedPart,
      threeDzoom, setthreeDZoom,
      threeDoffsetX, setthreeDOffsetX,
      threeDoffsetY, setthreeDOffsetY,
      threeDtext, setthreeDText,
      threeDtextTexture, setthreeDTextTexture,
      threeDtextColor, setthreeDTextColor,
      threeDoutlineColor, setthreeDOutlineColor,
      threeDtextScale, setthreeDTextScale,
      threeDtextPosX, setthreeDTextPosX,
      threeDtextPosY, setthreeDTextPosY,
      threeDscreenshots, setthreeDScreenshots,
      threeDloading, setthreeDLoading,
      threeDtextureMode, setthreeDTextureMode,
      threeDlogoScale, setthreeDLogoScale,
      threeDlogoPosX, setthreeDLogoPosX,
      threeDlogoPosY, setthreeDLogoPosY,
      customizationData, setCustomizationData
  } = use3D();

  const screenshotRef = useRef();

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
      });
      setthreeDTextTexture(texture);

      setCustomizationData(prev => ({
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
              position: { x: threeDtextPosX, y: threeDtextPosY }
            }
          }
        }
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
    threeDselectedPart
  ]);

  const handleScreenshot = async () => {
    if (screenshotRef.current) {
      setthreeDLoading(true);

      try {
        const capturedImages = await screenshotRef.current.captureAll();
        setthreeDScreenshots(capturedImages);

        setCustomizationData(prev => ({
          ...prev,
          screenshots: capturedImages.map(img => ({
            angle: img.angle,
            image: img.image
          }))
        }));
      } catch (error) {
        console.error("Error capturing screenshots:", error);
      } finally {
        setthreeDLoading(false);
      }
    }
  };

  const handleClearSelectedPart = () => {
    setCustomizationData(prev => {
      const newParts = { ...prev.parts };
      delete newParts[threeDselectedPart];
      return { ...prev, parts: newParts };
    });
    setthreeDColor('#ffffff');
    setthreeDTexture(null);
    setthreeDText('');
    setthreeDTextTexture(null);
    setthreeDTextColor('#000000');
    setthreeDOutlineColor('#ffffff');
    setthreeDTextScale(1);
    setthreeDTextPosX(0.5);
    setthreeDTextPosY(0.5);
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className='h-[100vh] w-[60%]'>
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 0.5, 2.5], fov: 80 }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <ModelViewer
            color={threeDcolor}
            texture={threeDtexture}
            textTexture={threeDtextTexture}
            selectedPart={threeDselectedPart}
            zoom={threeDzoom}
            offsetX={threeDoffsetX}
            offsetY={threeDoffsetY}
            textScale={threeDtextScale}
            textPosX={threeDtextPosX}
            textPosY={threeDtextPosY}
            setCustomizationData={setCustomizationData}
          />

          <ScreenshotManager ref={screenshotRef} />
          <OrbitControls />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4">
        <ControlsPanel
          onScreenshot={handleScreenshot}
        />

        <TextControlsPanel
        />

        <TextureUploader
        />

        <TextureControlsPanel
        />

        {customizationData?.parts && Object.keys(customizationData.parts).length > 0 && (
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => console.log('Customization Data:', customizationData)}
          >
            Save Customization
          </button>
        )}

        {threeDloading && (
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] bg-opacity-60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-white text-lg font-medium">Capturing screenshots...</div>
            </div>
          </div>
        )}

        {threeDscreenshots.length > 0 && (
          <ScreenshotGallery
            screenshots={threeDscreenshots}
            onClose={() => setthreeDScreenshots([])}
            onDownloadAll={() => console.log('All downloaded')}
          />
        )}

        <button
          className="bg-red-600 text-white px-4 py-2 rounded mt-2 w-full"
          onClick={handleClearSelectedPart}
        >
          Clear Selected Part
        </button>
      </div>
    </main>
  );
}