import React, { useState } from "react";
import TextureUploader from "../3d/TextureUploader";
import { use3D } from "@/app/context/3DContext";
import "./EditTab.css";

const EditTab = ({
  handleAddDesignToCanvas,
  editor,
  setShowImageEditModal,
  setHasUploadedImage,
  setActiveTab,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { selectedProduct } = use3D();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file (JPG, PNG, SVG)");
    }
  };

  const handleUploadDesign = async () => {
    if (!selectedFile || !editor?.canvas) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;

        if (handleAddDesignToCanvas) {
          handleAddDesignToCanvas(imageUrl, "center", 0, 0);

          setTimeout(() => {
            if (setHasUploadedImage) {
              setHasUploadedImage(true);
            }
            if (setShowImageEditModal) {
              setShowImageEditModal(true);
            }
          }, 500);
        }

        setSelectedFile(null);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Design upload failed:", error);
      alert("Failed to upload design. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="kr-edit-container kr-reset-margin-padding">
      <div className="kr-edit-header kr-reset-margin">
        <div className="kr-edit-title-section kr-reset-margin-padding">
          <h3 className="kr-edit-title kr-reset-margin-padding">Edit</h3>
        </div>
        <div
          className="kr-edit-close kr-reset-margin-padding"
          onClick={() => {
            setShowImageEditModal(false);
            setHasUploadedImage(false);
            if (typeof setActiveTab === "function") {
              setActiveTab(""); 
            }
          }}
        >
          <img
            src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png"
            alt="Close"
          />
        </div>
      </div>
      <hr className="kr-edit-divider kr-reset-margin-padding" />

      {selectedProduct?.ProductType === "2d" && (
        <div className="kr-edit-body kr-reset-margin">
          <div className="kr-edit-form kr-reset-margin-padding">
            <h3 className="kr-edit-subtitle kr-reset-margin-padding">
              Original vector artwork best, if you have?
            </h3>

            <label className="kr-upload-label kr-reset-margin">
              <input
                type="file"
                accept="image/*"
                className="kr-hidden kr-reset-margin-padding"
                onChange={handleFileSelect}
              />
              <div className="kr-upload-helper kr-reset-margin-padding">
                <div className="kr-upload-cta">
                  {selectedFile ? "Image Uploaded" : "Choose a file"}
                </div>
                <p className="kr-upload-note kr-reset-margin-padding">
                  We support JPG, PNG, EAPS
                  <br />
                  An max 5 MB
                </p>
              </div>
            </label>

            <button
              onClick={handleUploadDesign}
              disabled={!selectedFile || isUploading || !editor?.canvas}
              className="kr-upload-button kr-reset-margin"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      {selectedProduct?.ProductType === "3d" && (
        <>
          <TextureUploader />
        </>
      )}
    </div>
  );
};

export default EditTab;
