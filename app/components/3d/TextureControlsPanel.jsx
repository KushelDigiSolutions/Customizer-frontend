import { use3D } from '../../context/3DContext';

const TextureControlsPanel = () => {
  const {
    threeDzoom, setthreeDZoom,
    threeDoffsetX, setthreeDOffsetX,
    threeDoffsetY, setthreeDOffsetY
  } = use3D();

  return (
    <div className="bg-white p-3 rounded shadow-md mt-2 space-y-2">
      <div>
        <label>Zoom (Repeat): {threeDzoom.toFixed(2)}</label>
        <input type="range" min="0.2" max="3" step="0.1" value={threeDzoom} onChange={(e) => setthreeDZoom(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Offset X: {threeDoffsetX.toFixed(2)}</label>
        <input type="range" min="-1" max="1" step="0.01" value={threeDoffsetX} onChange={(e) => setthreeDOffsetX(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Offset Y: {threeDoffsetY.toFixed(2)}</label>
        <input type="range" min="-1" max="1" step="0.01" value={threeDoffsetY} onChange={(e) => setthreeDOffsetY(parseFloat(e.target.value))} />
      </div>
    </div>
  );
};

export default TextureControlsPanel;
