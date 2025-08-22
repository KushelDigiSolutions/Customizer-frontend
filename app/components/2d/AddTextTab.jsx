import React from 'react';
import { use3D } from '@/app/context/3DContext';
import { use2D } from '@/app/context/2DContext';
import './AddTextTab.css';

const AddTextTab = ({ handleAddCustomText, update3DText }) => {
    const { customText, setCustomText, showAddModal, setShowAddModal } = use2D();
    const { threeDtext, setthreeDText, selectedProduct } = use3D();
    const [threeDInput, setThreeDInput] = React.useState("");

    return (
        <div className='kr-editor-container kr-reset-margin-padding'>
            <div className='kr-header kr-reset-margin'>
                <div className='kr-header-left kr-reset-margin-padding'>
                    <h3 className='kr-title kr-reset-margin-padding'>Add text</h3>
                </div>
                <div className="kr-close-button kr-reset-margin-padding" onClick={() => setShowAddModal(false)}>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
                </div>
            </div>
            {
                selectedProduct?.ProductType === "2d" && (
                    <>
                        <hr className="kr-divider kr-reset-margin-padding" />
                        <div className='kr-content kr-reset-margin'>
                            <div className='kr-input-container kr-reset-margin-padding'>
                                <textarea 
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)} 
                                    placeholder="Add Headline" 
                                    className="kr-text-input kr-reset-margin" 
                                />
                            </div>
                            <button 
                                onClick={handleAddCustomText} 
                                className={`kr-add-button ${customText.trim() !== "" ? "active" : "inactive"}`}
                            >
                                Add text
                            </button>
                        </div>
                    </>
                )
            }
            {
                selectedProduct?.ProductType === "3d" && (
                    <>
                        <hr className="kr-divider kr-reset-margin-padding" />
                        <div className='kr-content kr-reset-margin'>
                            <div className='kr-input-container kr-reset-margin-padding'>
                                <textarea
                                    placeholder="Enter text"
                                    value={threeDInput}
                                    onChange={(e) => setThreeDInput(e.target.value)}
                                    className="kr-text-input kr-reset-margin"
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    setthreeDText(threeDInput);
                                    update3DText();
                                }} 
                                className={`kr-add-button ${threeDInput.trim() !== "" ? "active" : "inactive"}`}
                            >
                                Add text
                            </button>
                        </div>
                    </>
                )
            }

        </div>
    )
}

export default AddTextTab;