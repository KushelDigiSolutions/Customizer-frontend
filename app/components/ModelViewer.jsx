import { Center, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

const ModelViewer = ({
  setCustomizationData, 
  color, 
  texture, 
  textTexture, 
  selectedPart, 
  zoom, 
  offsetX, 
  offsetY,
  textScale,
  textPosX,
  textPosY
}) => {
    const { scene } = useGLTF('/models/brand1.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === selectedPart) {
                const originalColor = child.material.color;
                const currentColorHex = `#${originalColor.getHexString()}`;

                // Set base color
                if (color && color !== '#ffffff') {
                    child.material.color.set(color);
                } else {
                    child.material.color.set(currentColorHex);
                }

                if (texture || textTexture) {
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = 1024;
                    const ctx = canvas.getContext('2d');

                    // Fill base color
                    ctx.fillStyle = color && color !== '#ffffff' ? color : currentColorHex;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Apply main texture/image if available
                    if (texture?.image) {
                        ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
                    }

                    // Apply text texture if available (with independent positioning)
                    if (textTexture?.image) {
                        ctx.drawImage(textTexture.image, 0, 0, canvas.width, canvas.height);
                    }

                    const combinedTexture = new THREE.CanvasTexture(canvas);
                    combinedTexture.needsUpdate = true;
                    combinedTexture.wrapS = combinedTexture.wrapT = THREE.RepeatWrapping;
                    combinedTexture.repeat.set(zoom, zoom);
                    combinedTexture.offset.set(offsetX, offsetY);
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
    }, [color, texture, textTexture, selectedPart, zoom, offsetX, offsetY, textScale, textPosX, textPosY, scene]);

    useEffect(() => {
        setCustomizationData(prev => ({
            ...prev,
            parts: {
                ...prev.parts,
                [selectedPart]: {
                    ...prev.parts[selectedPart],
                    color
                }
            }
        }));
    }, [color, selectedPart, setCustomizationData]);

    return (
        <Center>
            <primitive object={scene} scale={0.04} position={[0, 0, 0]} />
        </Center>
    );
};

export default ModelViewer;