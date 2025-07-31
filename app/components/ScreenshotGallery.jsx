import { useState } from 'react';

const ScreenshotGallery = ({ screenshots, onClose, onDownloadAll }) => {
  if (!screenshots || screenshots.length === 0) return null;

  const [selected, setSelected] = useState(screenshots[0]);

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const downloadAll = () => {
    screenshots.forEach((screenshot, index) => {
      setTimeout(() => {
        downloadImage(screenshot.image, `${screenshot.angle}-view.png`);
      }, index * 100);
    });
    if (onDownloadAll) onDownloadAll();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Model Screenshots</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Large Preview Image */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img
              src={selected?.image}
              alt={`${selected?.angle} view`}
              className="w-96 h-96 object-contain border rounded-lg shadow-lg bg-gray-50"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm capitalize">
              {selected?.angle} view
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-4 mb-6">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              onClick={() => setSelected(screenshot)}
              className={`relative cursor-pointer border-2 rounded-lg p-1 ${
                selected.view === screenshot.view ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <img
                src={screenshot?.image}
                alt={`${screenshot.angle} view`}
                className="w-24 h-24 object-contain bg-gray-50 rounded-md"
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded capitalize">
                {screenshot.angle}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={downloadAll}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Download All
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenshotGallery;
