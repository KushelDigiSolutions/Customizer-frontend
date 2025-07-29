const ControlsPanel = ({ color, setColor, selectedPart, setSelectedPart }) => {
  const parts = ['Front','Back', 'LeftSleeve', 'RightSleeve'];

  return (
    <div className="bg-white p-3 rounded shadow-md space-y-2">
      <label className="font-semibold block">Select Part:</label>
      <div className="grid grid-cols-4  gap-2">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => setSelectedPart(part)}
            className={`px-2 py-1 rounded border ${
              selectedPart === part ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <label className="block mb-1">Pick Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </div>
  );
};


export default ControlsPanel;
