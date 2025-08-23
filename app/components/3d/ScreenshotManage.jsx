// import { useThree } from '@react-three/fiber';
// import { useImperativeHandle, forwardRef } from 'react';
// import * as THREE from 'three';

// const ScreenshotManager = forwardRef((props, ref) => {
//   const { gl, camera, scene } = useThree();

//   useImperativeHandle(ref, () => ({
//     captureAll: async () => {
//       try {
//         const views = [
//           { name: 'front', position: [0, 0, 5] },
//           { name: 'back', position: [0, 0, -5] },
//           { name: 'left', position: [-5, 0, 0] },
//           { name: 'right', position: [5, 0, 0] }
//         ];

//         const originalPosition = camera.position.clone();
//         const originalRotation = camera.rotation.clone();

//         const capturedImages = [];

//         for (const view of views) {
//           // Move camera to position
//           camera.position.set(...view.position);

//           // Look at scene center (0,0,0) or model center if you have bounding box
//           camera.lookAt(new THREE.Vector3(0, 0, 0));
//           camera.updateProjectionMatrix();

//           // Render
//           gl.render(scene, camera);

//           // Wait a frame
//           await new Promise(resolve => setTimeout(resolve, 100));

//           // Capture
//           const dataUrl = gl.domElement.toDataURL('image/png');
//           capturedImages.push({ angle: view.name, image: dataUrl });
//         }

//         // Reset camera back
//         camera.position.copy(originalPosition);
//         camera.rotation.copy(originalRotation);
//         camera.updateProjectionMatrix();

//         console.log("Captured Screenshots:", capturedImages);
//         return capturedImages;
//       } catch (error) {
//         console.error("Error capturing screenshots:", error);
//       }
//     }
//   }), [gl, camera, scene]);

//   return null;
// });

// ScreenshotManager.displayName = 'ScreenshotManager';

// export default ScreenshotManager;


import { useThree } from '@react-three/fiber';
import { useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

function cropImage(base64Image, cropX, cropY, cropWidth, cropHeight) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // source rect
        0, 0, cropWidth, cropHeight          // dest rect
      );

      resolve(canvas.toDataURL("image/png"));
    };
  });
}


const ScreenshotManager = forwardRef((props, ref) => {
  const { gl, camera, scene } = useThree();

  useImperativeHandle(ref, () => ({
    captureAll: async () => {
      try {
        // Compute bounding box of the model
        const box = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Pick the largest dimension for framing
        const maxDim = Math.max(size.x, size.y, size.z);

        // Distance formula for perspective camera (so model fits nicely)
        const fov = camera.fov * (Math.PI / 180); // vertical fov in radians
        let distance = maxDim / (2 * Math.tan(fov / 2));

        // Add a little padding
        distance *= 1.2;

        const views = [
          { name: 'front', position: [0, 0, distance] },
          { name: 'back', position: [0, 0, -distance] },
          { name: 'left', position: [-distance, 0, 0] },
          { name: 'right', position: [distance, 0, 0] }
        ];

        const originalPosition = camera.position.clone();
        const originalRotation = camera.rotation.clone();

        const capturedImages = [];

        for (const view of views) {
          camera.position.set(...view.position).add(center); // move relative to center
          camera.lookAt(center);
          camera.updateProjectionMatrix();

          gl.render(scene, camera);
          await new Promise(resolve => setTimeout(resolve, 100));

          const dataUrl = gl.domElement.toDataURL('image/png');

          const cropX = 250;  // left margin
          const cropY = 100;  // top margin
          const cropWidth = gl.domElement.width - 500;   // remove left+right
          const cropHeight = gl.domElement.height - 200; // remove top+bottom

          const croppedUrl = await cropImage(dataUrl, cropX, cropY, cropWidth, cropHeight);
          capturedImages.push({ angle: view.name, image: croppedUrl });
        }

        // Reset camera back
        camera.position.copy(originalPosition);
        camera.rotation.copy(originalRotation);
        camera.updateProjectionMatrix();

        // console.log("Captured Screenshots:", capturedImages);
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
