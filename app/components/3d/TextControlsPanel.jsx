import { use3D } from '../../context/3DContext';

const TextControlsPanel = () => {
  const {
    threeDtextScale, setthreeDTextScale,
    threeDtextPosX, setthreeDTextPosX,
    threeDtextPosY, setthreeDTextPosY
  } = use3D();

  return (
    <div className="bg-white p-3 rounded shadow-md mt-2 space-y-2">
      <div>
        <label>Text Scale: {threeDtextScale.toFixed(2)}</label>
        <input type="range" min="0.2" max="2" step="0.05" value={threeDtextScale} onChange={(e) => setthreeDTextScale(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Text Position X: {threeDtextPosX.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={threeDtextPosX} onChange={(e) => setthreeDTextPosX(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Text Position Y: {threeDtextPosY.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={threeDtextPosY} onChange={(e) => setthreeDTextPosY(parseFloat(e.target.value))} />
      </div>
    </div>
  );
};

export default TextControlsPanel;
