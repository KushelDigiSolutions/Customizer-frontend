const ControlsPanel = ({
  color, setColor,
  selectedPart, setSelectedPart,
  text, setText,
  textColor, setTextColor,
  outlineColor, setOutlineColor, onScreenshot
}) => {
  // const parts = ['Front', 'Back', 'LeftSleeve', 'RightSleeve','Slides'];

  const parts = [
  'Back',
  'BackBottomSlide',
  'Front',
  'FrontBottomSlide',
  'FrontStrip',
  'LeftSleeve',
  'RightSleeve',
  'Slides'
];

  return (
    <div className="bg-white p-3 rounded shadow-md space-y-2">
      <label className="font-semibold block">Select Part:</label>
      <div className="grid grid-cols-4 gap-2">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => setSelectedPart(part)}
            className={`px-2 py-1 rounded border ${selectedPart === part ? 'bg-blue-600 text-white' : 'bg-gray-200'
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

      <hr className="my-2" />
      <label className="block font-semibold">Add Text:</label>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-2 py-1 w-full"
      />

      <label className="block mt-2">Text Color:</label>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
      />

      <label className="block mt-2">Outline Color:</label>
      <input
        type="color"
        value={outlineColor}
        onChange={(e) => setOutlineColor(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
        onClick={onScreenshot}
      >
        Save All Views
      </button>
    </div>
  );
};

export default ControlsPanel;