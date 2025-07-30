import { Center, useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

const ModelViewer = ({ color, texture, selectedPart, zoom, offsetX, offsetY }) => {
    const { scene } = useGLTF('/models/brand1.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === selectedPart) {
                child.material.color.set(color);

                if (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(zoom, zoom);
                    texture.offset.set(offsetX, offsetY);
                    texture.center.set(0.5, 0.5);
                    texture.needsUpdate = true;

                    child.material.map = texture;
                    child.material.transparent = false;
                    child.material.needsUpdate = true;
                } else {
                    child.material.map = null;
                }

                child.material.needsUpdate = true;
            }
        });
    }, [color, texture, selectedPart, zoom, offsetX, offsetY]);


    return (
        <Center>
            <primitive object={scene} scale={0.04} />
        </Center>
    );
};


export default ModelViewer;
