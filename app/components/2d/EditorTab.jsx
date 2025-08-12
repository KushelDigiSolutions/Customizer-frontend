import React from 'react'
import './EditorTab.css'

const EditorTab = ({setShowEditorModal}) => {
    return (
        <div className='kr-editor-container kr-reset-margin-padding'>
            <div className='kr-editor-header kr-reset-margin'>
                <div className='kr-editor-title-section kr-reset-margin'>
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341726/Frame_12_mbe4a0.png" alt="AI" className='kr-reset-margin-padding'/>
                    <h3 className='kr-editor-title kr-reset-margin-padding'>Improve with AI</h3>
                </div>
                <div onClick={()=> setShowEditorModal(false)} className="kr-editor-close kr-reset-margin-padding">
                    <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" className='kr-reset-margin-padding'/>
                </div>
            </div>
            <hr className="kr-editor-divider kr-reset-margin-padding" />
            <div className='kr-editor-content kr-reset-margin'>
                <div className='kr-editor-form kr-reset-margin-padding'>
                    <label htmlFor="description" className="kr-editor-label kr-reset-margin-padding">Description*</label>
                    <div className='kr-editor-textarea-container kr-reset-margin-padding'>
                        <textarea 
                            name='description' 
                            className='kr-editor-textarea kr-reset-margin' 
                            placeholder='Describe the design in a sentence' 
                        />
                        <div className='kr-editor-prompt-badge kr-reset-margin'>
                            <span className='kr-editor-prompt-text kr-reset-margin-padding'>Prompt</span>
                            <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749343021/Frame_12_1_jktiv7.png" alt="AI" />
                        </div>
                    </div>
                    <div className='kr-editor-tags kr-reset-padding'>
                        <span className='kr-editor-tag kr-active kr-reset-margin'>Color</span>
                        <span className='kr-editor-tag kr-inactive kr-reset-margin'>Arts</span>
                    </div>
                    <button className='kr-editor-generate-btn kr-reset-margin'>Generate</button>
                </div>
            </div>
        </div>
    )
}

export default EditorTab