const TextControlsPanel = ({ textScale, setTextScale, textPosX, setTextPosX, textPosY, setTextPosY }) => (
  <div className="bg-white p-3 rounded shadow-md mt-2 space-y-2">
    <div>
      <label>Text Scale: {textScale.toFixed(2)}</label>
      <input type="range" min="0.2" max="2" step="0.05" value={textScale} onChange={(e) => setTextScale(parseFloat(e.target.value))} />
    </div>
    <div>
      <label>Text Position X: {textPosX.toFixed(2)}</label>
      <input type="range" min="0" max="1" step="0.01" value={textPosX} onChange={(e) => setTextPosX(parseFloat(e.target.value))} />
    </div>
    <div>
      <label>Text Position Y: {textPosY.toFixed(2)}</label>
      <input type="range" min="0" max="1" step="0.01" value={textPosY} onChange={(e) => setTextPosY(parseFloat(e.target.value))} />
    </div>
  </div>
);

export default TextControlsPanel;
