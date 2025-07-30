'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/ModelViewer';
import TextureUploader from './components/TextureUploader';
import ControlsPanel from './components/ControlsPanel';
import { useEffect, useRef, useState } from 'react';
import TextureControlsPanel from './components/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';
import ScreenshotManager from './components/ScreenshotManage';
import ScreenshotGallery from './components/ScreenshotGallery';

export default function Home() {
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

  // -------- screenshots---------
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);

  const screenshotRef = useRef();

  useEffect(() => {
    if (text.trim()) {
      const texture = createTextTexture({
        text,
        fill: textColor,
        stroke: outlineColor,
        baseColor: color,
      });
      setTextTexture(texture);
    } else {
      setTextTexture(null);
    }
  }, [text, textColor, outlineColor, color]);

  const handleScreenshot = async () => {
    if (screenshotRef.current) {
      setLoading(true);

      try {
        const capturedImages = await screenshotRef.current.captureAll();
        setScreenshots(capturedImages);
      } catch (error) {
        console.error("Error capturing screenshots:", error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className='h-[100vh] w-[60%]'>
        <Canvas
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [0, 0.5, 2.5], fov: 80 }}
        >
          <ambientLight intensity={1} />
          <Environment preset="city" />

          <ModelViewer
            texture={texture || textTexture}
            color={color}
            selectedPart={selectedPart}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
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
          setText={setText}
          textColor={textColor}
          setTextColor={setTextColor}
          outlineColor={outlineColor}
          setOutlineColor={setOutlineColor}
          onScreenshot={handleScreenshot}
        />

        <TextureUploader
          setTexture={setTexture}
          text={text}
          textColor={textColor}
          outlineColor={outlineColor}
          baseColor={color}
        />

        <TextureControlsPanel
          zoom={zoom} setZoom={setZoom}
          offsetX={offsetX} setOffsetX={setOffsetX}
          offsetY={offsetY} setOffsetY={setOffsetY}
        />

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
      </div>


    </main>
  );
}