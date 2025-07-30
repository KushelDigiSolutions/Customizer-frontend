'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/ModelViewer';
import TextureUploader from './components/TextureUploader';
import ControlsPanel from './components/ControlsPanel';
import { useEffect, useState } from 'react';
import TextureControlsPanel from './components/TextureControlsPanel';
import { createTextTexture } from './utility/createTextTexture';

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


  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className='h-[100vh] w-[60%]'>
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0.5, 2.5], fov: 80 }}>
          <ambientLight intensity={1} />
          <Environment preset="city" />
          <OrbitControls />
          {/* <ModelViewer color={color} texture={texture} selectedPart={selectedPart} /> */}
          <ModelViewer
            texture={texture || textTexture}
            color={color}
            // texture={texture}
            selectedPart={selectedPart}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
          />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4">
        <ControlsPanel
          color={color}
          setColor={setColor}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
        />
        <TextureUploader setTexture={setTexture} />
        <TextureControlsPanel
          zoom={zoom} setZoom={setZoom}
          offsetX={offsetX} setOffsetX={setOffsetX}
          offsetY={offsetY} setOffsetY={setOffsetY}
        />

        <div className="bg-white p-3 rounded shadow-md space-y-2">
          <label className="block font-semibold">Add Text:</label>
          <input
            type="text"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border px-2 py-1 w-full"
          />

          <label className="block mt-2">Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />

          <label className="block mt-2">Outline Color:</label>
          <input
            type="color"
            value={outlineColor}
            onChange={(e) => setOutlineColor(e.target.value)}
          />
        </div>
      </div>
    </main >
  );
}
