import { Center, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';
import { use3D } from '../../context/3DContext';

const ModelViewer = ({ modelUrl, selectedPart }) => {
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
        setCustomizationData
    } = use3D();

    const { scene } = useGLTF(modelUrl);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === selectedPart) {
                // Always set the color from state
                child.material.color.set(threeDcolor || '#ffffff');
                child.material.needsUpdate = true;
            }
        });
    }, [threeDcolor, selectedPart, scene]);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === selectedPart) {
                const originalColor = child.material.color;
                const currentColorHex = `#${originalColor.getHexString()}`;

                // Set base color
                if (threeDcolor && threeDcolor !== '#ffffff') {
                    child.material.color.set(threeDcolor);
                } else {
                    child.material.color.set(currentColorHex);
                }

                if (threeDtexture || threeDtextTexture) {
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = 1024;
                    const ctx = canvas?.getContext('2d');
                    this.clearContext(ctx);

                    // Fill base color
                    ctx.fillStyle = threeDcolor && threeDcolor !== '#ffffff' ? threeDcolor : currentColorHex;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // --- Draw main texture (with zoom/offset/repeat) ---
                    if (threeDtexture?.image) {
                        const repeat = threeDzoom || 1;
                        const offsetXPx = (threeDoffsetX || 0) * canvas.width;
                        const offsetYPx = (threeDoffsetY || 0) * canvas.height;
                        const drawWidth = canvas.width / repeat;
                        const drawHeight = canvas.height / repeat;

                        ctx.save();
                        ctx.translate(offsetXPx, offsetYPx);

                        // Tile the texture to fill the canvas
                        for (let x = 0; x < canvas.width; x += drawWidth) {
                            for (let y = 0; y < canvas.height; y += drawHeight) {
                                ctx.drawImage(threeDtexture.image, x, y, drawWidth, drawHeight);
                            }
                        }

                        ctx.restore();
                    }

                    // --- Draw text texture (ALWAYS centered/independent) ---
                    if (threeDtextTexture?.image) {
                        ctx.drawImage(threeDtextTexture.image, 0, 0, canvas.width, canvas.height);
                    }

                    const combinedTexture = new THREE.CanvasTexture(canvas);
                    combinedTexture.needsUpdate = true;
                    combinedTexture.wrapS = combinedTexture.wrapT = THREE.RepeatWrapping;
                    combinedTexture.repeat.set(1, 1); // No repeat here, handled in drawImage
                    combinedTexture.offset.set(0, 0); // No offset here, handled in drawImage
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
    }, [
        threeDcolor,
        threeDtexture,
        threeDtextTexture,
        selectedPart,
        threeDzoom,
        threeDoffsetX,
        threeDoffsetY,
        threeDtextScale,
        threeDtextPosX,
        threeDtextPosY,
        scene
    ]);

    useEffect(() => {
        setCustomizationData(prev => ({
            ...prev,
            parts: {
                ...prev.parts,
                [selectedPart]: {
                    ...prev.parts?.[selectedPart],
                    color: threeDcolor
                }
            }
        }));
    }, [threeDcolor, selectedPart, setCustomizationData]);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                const baseColor = `#${child.material.color.getHexString()}`;
                setCustomizationData(prev => ({
                    ...prev,
                    baseColors: {
                        ...prev?.baseColors,
                        [child.name]: baseColor
                    }
                }));
            }
        });
    }, [scene, setCustomizationData]);

    return (
        <Center>
            <primitive object={scene} scale={0.03} position={[0, 0, 0]} />
        </Center>
    );
};

export default ModelViewer;