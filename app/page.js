'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelViewer from './components/ModelViewer';
import TextureUploader from './components/TextureUploader';
import ControlsPanel from './components/ControlsPanel';
import { useState } from 'react';
import TextureControlsPanel from './components/TextureControlsPanel';

export default function Home() {
  const [color, setColor] = useState('#ffffff');
  const [texture, setTexture] = useState(null);
  const [selectedPart, setSelectedPart] = useState('Front');

  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);


  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className='h-[100vh] w-[60%]'>
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0.5, 2.5], fov: 80 }}>
          <ambientLight intensity={1} />
          <Environment preset="city" />
          <OrbitControls />
          {/* <ModelViewer color={color} texture={texture} selectedPart={selectedPart} /> */}
          <ModelViewer
            color={color}
            texture={texture}
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
      </div>
    </main>
  );
}
