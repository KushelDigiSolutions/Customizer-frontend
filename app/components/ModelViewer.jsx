import { Center, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

const ModelViewer = ({ color, texture, textTexture, selectedPart, zoom, offsetX, offsetY }) => {
    const { scene } = useGLTF('/models/brand1.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === selectedPart) {
                const originalColor = child.material.color;
                const currentColorHex = `#${originalColor.getHexString()}`;

                if (color && color !== currentColorHex) {
                    child.material.color.set(color);
                }

                const fillColor = (color && color !== currentColorHex) ? color : currentColorHex;

                if (texture || textTexture) {
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = 1024;
                    const ctx = canvas.getContext('2d');

                    ctx.fillStyle = fillColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    if (texture?.image) {
                        ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
                    } else if (textTexture?.image) {
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
    }, [color, texture, textTexture, selectedPart, zoom, offsetX, offsetY, scene]);


    return (
        <Center>
            <primitive object={scene} scale={0.04} position={[0, 0, 0]}/>
        </Center>
    );
};


export default ModelViewer;
