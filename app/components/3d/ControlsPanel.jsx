import { use3D } from '../../context/3DContext';

const ControlsPanel = ({ onScreenshot }) => {
  const {
    threeDcolor, setthreeDColor,
    threeDselectedPart, setthreeDSelectedPart,
    threeDtext, setthreeDText,
    threeDtextColor, setthreeDTextColor,
    threeDoutlineColor, setthreeDOutlineColor
  } = use3D();

  const parts = ['Front', 'Back', 'LeftSleeve', 'RightSleeve', 'Slides'];

  return (
    <div className="bg-white p-3 rounded shadow-md space-y-2">
      <label className="font-semibold block">Select Part:</label>
      <div className="grid grid-cols-4 gap-2">
        {parts.map((part) => (
          <button
            key={part}
            onClick={() => setthreeDSelectedPart(part)}
            className={`px-2 py-1 rounded border ${threeDselectedPart === part ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {part}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <label className="block mb-1">Pick Color:</label>
        <input
          type="color"
          value={threeDcolor}
          onChange={(e) => setthreeDColor(e.target.value)}
        />
      </div>

      <hr className="my-2" />
      <label className="block font-semibold">Add Text:</label>
      <input
        type="text"
        placeholder="Enter text"
        value={threeDtext}
        onChange={(e) => setthreeDText(e.target.value)}
        className="border px-2 py-1 w-full"
      />

      <label className="block mt-2">Text Color:</label>
      <input
        type="color"
        value={threeDtextColor}
        onChange={(e) => setthreeDTextColor(e.target.value)}
      />

      <label className="block mt-2">Outline Color:</label>
      <input
        type="color"
        value={threeDoutlineColor}
        onChange={(e) => setthreeDOutlineColor(e.target.value)}
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