import { useState } from 'react';
import './ScreenshotGallery.css';

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
    <div className="kr-gallery-overlay">
      <div className="kr-gallery-modal">
        <div className="kr-gallery-header kr-reset-margin-padding">
          <h2 className="kr-gallery-title kr-reset-margin-padding">Model Screenshots</h2>
          <button
            onClick={onClose}
            className="kr-gallery-close-btn"
          >
            ×
          </button>
        </div>

        {/* Large Preview Image */}
        <div className="kr-gallery-preview-container">
          <div className="kr-gallery-preview-wrapper">
            <img
              src={selected?.image}
              alt={`${selected?.angle} view`}
              className="kr-gallery-preview-image"
            />
            <div className="kr-gallery-preview-label">
              {selected?.angle} view
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="kr-gallery-thumbnails">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              onClick={() => setSelected(screenshot)}
              className={`kr-gallery-thumbnail ${selected.view === screenshot.view ? 'kr-gallery-thumbnail-active' : ''
                }`}
            >
              <img
                src={screenshot?.image}
                alt={`${screenshot.angle} view`}
                className="kr-gallery-thumbnail-image"
              />
              <div className="kr-gallery-thumbnail-label">
                {screenshot.angle}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="kr-gallery-actions">
          <button className="kr-navbar-button kr-addtocart-handel kr-info-button kr-reset-margin kr-addtocart-custom" title="Add design to cart" data-kr-addtocart-handel>
            <span className="kr-reset">Add to Cart</span>
          </button>
          <button
            onClick={downloadAll}
            className="kr-navbar-button kr-gallery-btn-primary"
          >
            Download All
          </button>
          <button
            onClick={onClose}
            className="kr-navbar-button kr-gallery-btn-secondary"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default ScreenshotGallery;
