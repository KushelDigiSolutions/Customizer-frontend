import { useThree } from '@react-three/fiber';
import { useImperativeHandle, forwardRef } from 'react';

const ScreenshotManager = forwardRef((props, ref) => {
  const { gl, camera, scene } = useThree();

  useImperativeHandle(ref, () => ({
    captureAll: async () => {
      try {
        const views = [
          { name: 'front', rotation: [0, 0, 0] },
          { name: 'back', rotation: [0, Math.PI, 0] },
          { name: 'left', rotation: [0, -Math.PI / 2, 0] },
          { name: 'right', rotation: [0, Math.PI / 2, 0] }
        ];

        const originalRotation = scene.rotation.clone();
        const capturedImages = [];

        for (const view of views) {
          // Set the scene rotation
          scene.rotation.set(...view.rotation);
          
          // Force a render
          gl.render(scene, camera);
          
          // Wait a frame to ensure render is complete
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Capture the screenshot
          const dataUrl = gl.domElement.toDataURL('image/png');
          capturedImages.push({ angle: view.name, image: dataUrl });
          
          // Store the screenshot data
          // We'll handle downloading in the UI component
        }

        // Reset to original rotation
        scene.rotation.copy(originalRotation);
        
        console.log("Captured Screenshots:", capturedImages);
        return capturedImages;
      } catch (error) {
        console.error("Error capturing screenshots:", error);
      }
    }
  }), [gl, camera, scene]);

  return null;
});

ScreenshotManager.displayName = 'ScreenshotManager';

export default ScreenshotManager;