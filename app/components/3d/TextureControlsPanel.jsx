const TextureControlsPanel = ({ zoom, setZoom, offsetX, setOffsetX, offsetY, setOffsetY }) => {
  return (
    <div className="bg-white p-3 rounded shadow-md mt-2 space-y-2">
      <div>
        <label>Zoom (Repeat): {zoom.toFixed(2)}</label>
        <input type="range" min="0.2" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Offset X: {offsetX.toFixed(2)}</label>
        <input type="range" min="-1" max="1" step="0.01" value={offsetX} onChange={(e) => setOffsetX(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Offset Y: {offsetY.toFixed(2)}</label>
        <input type="range" min="-1" max="1" step="0.01" value={offsetY} onChange={(e) => setOffsetY(parseFloat(e.target.value))} />
      </div>
    </div>
  );
};

export default TextureControlsPanel;
