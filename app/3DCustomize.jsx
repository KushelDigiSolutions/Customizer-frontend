'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/3d/ModelViewer';
import TextureUploader from './components/3d/TextureUploader';
import ControlsPanel from './components/3d/ControlsPanel';
import { Suspense, useEffect, useRef, useState } from 'react';
import TextureControlsPanel from './components/3d/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import ScreenshotManager from './components/3d/ScreenshotManage';
import ScreenshotGallery from './components/3d/ScreenshotGallery';
import TextControlsPanel from './components/3d/TextControlsPanel';

export default function ThreeDCustomize() {
  const [color, setColor] = useState('#ffffff');
  const [texture, setTexture] = useState(null);
  const [selectedPart, setSelectedPart] = useState('Front');

  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // -------- text-----------------
  const [text, setText] = useState('');
  const [textTexture, setTextTexture] = useState(null);
  const [textColor, setTextColor] = useState('#000000');
  const [outlineColor, setOutlineColor] = useState('#ffffff');

  // Independent text position and scale - START CENTERED
  const [textScale, setTextScale] = useState(1);
  const [textPosX, setTextPosX] = useState(0.5); // Center X
  const [textPosY, setTextPosY] = useState(0.5); // Center Y (changed from 0.85)

  // -------- screenshots---------
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [textureMode, setTextureMode] = useState('full');
  const [logoScale, setLogoScale] = useState(0.5); // 0.1 to 1
  const [logoPosX, setLogoPosX] = useState(0.5);   // 0 to 1 (canvas %)
  const [logoPosY, setLogoPosY] = useState(0.5);   // 0 to 1

  const [customizationData, setCustomizationData] = useState({
    parts: {}, // each part will hold customization info
    screenshots: []
  });

  const screenshotRef = useRef();

  // Reset text position to center when text changes or part changes
  const handleTextChange = (newText) => {
    setText(newText);
    if (newText.trim() && !text.trim()) {
      // Reset to center when adding text for the first time
      setTextPosX(0.5);
      setTextPosY(0.5);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const texture = createTextTexture({
        text,
        fill: textColor,
        stroke: outlineColor,
        baseColor: 'transparent',
        textScale,
        textPosX,
        textPosY,
      });
      setTextTexture(texture);

      setCustomizationData(prev => ({
        ...prev,
        parts: {
          ...prev.parts,
          [selectedPart]: {
            ...prev.parts[selectedPart],
            text: {
              content: text,
              color: textColor,
              outline: outlineColor,
              scale: textScale,
              position: { x: textPosX, y: textPosY }
            }
          }
        }
      }));
    } else {
      setTextTexture(null);
    }
  }, [text, textColor, outlineColor, textScale, textPosX, textPosY, selectedPart]);

  const handleScreenshot = async () => {
    if (screenshotRef.current) {
      setLoading(true);

      try {
        const capturedImages = await screenshotRef.current.captureAll();
        setScreenshots(capturedImages);

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
        setLoading(false);
      }
    }
  };

  const handleClearSelectedPart = () => {
    setCustomizationData(prev => {
      const newParts = { ...prev.parts };
      delete newParts[selectedPart];
      return { ...prev, parts: newParts };
    });
    setColor('#ffffff');
    setTexture(null);
    setText('');
    setTextTexture(null);
    setTextColor('#000000');
    setOutlineColor('#ffffff');
    setTextScale(1);
    setTextPosX(0.5);
    setTextPosY(0.5);
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
            color={color}
            texture={texture}
            textTexture={textTexture}
            selectedPart={selectedPart}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            textScale={textScale}
            textPosX={textPosX}
            textPosY={textPosY}
            setCustomizationData={setCustomizationData}
          />

          <ScreenshotManager ref={screenshotRef} />
          <OrbitControls />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4">
        <ControlsPanel
          color={color}
          setColor={setColor}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          text={text}
          setText={handleTextChange}
          textColor={textColor}
          setTextColor={setTextColor}
          outlineColor={outlineColor}
          setOutlineColor={setOutlineColor}
          onScreenshot={handleScreenshot}
        />

        <TextControlsPanel
          textScale={textScale} setTextScale={setTextScale}
          textPosX={textPosX} setTextPosX={setTextPosX}
          textPosY={textPosY} setTextPosY={setTextPosY}
        />

        <TextureUploader
          setTexture={setTexture}
          text={text}
          texture={texture}
          textColor={textColor}
          outlineColor={outlineColor}
          baseColor={color}
          textureMode={textureMode}
          setTextureMode={setTextureMode}
          logoScale={logoScale}
          setLogoScale={setLogoScale}
          logoPosX={logoPosX}
          setLogoPosX={setLogoPosX}
          logoPosY={logoPosY}
          setLogoPosY={setLogoPosY}
          setCustomizationData={setCustomizationData}
          selectedPart={selectedPart}
        />

        <TextureControlsPanel
          zoom={zoom} setZoom={setZoom}
          offsetX={offsetX} setOffsetX={setOffsetX}
          offsetY={offsetY} setOffsetY={setOffsetY}
        />

        {Object.keys(customizationData.parts).length > 0 && (
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => console.log('Customization Data:', customizationData)}
          >
            Save Customization
          </button>
        )}

        {loading && (
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.9)] bg-opacity-60 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-white text-lg font-medium">Capturing screenshots...</div>
            </div>
          </div>
        )}

        {screenshots.length > 0 && (
          <ScreenshotGallery
            screenshots={screenshots}
            onClose={() => setScreenshots([])}
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