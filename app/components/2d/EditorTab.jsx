
'use client'

import React, { useEffect, useState } from "react";
import * as THREE from "three";
import "./EditorTab.css";
import { use3D } from "@/app/context/3DContext";

const EditorTab = ({ setShowEditorModal }) => {
    // Local-only preview for this modal (not applied to 3D until "Apply")
    const [prompt, setPrompt] = useState("");
    const [draftUrl, setDraftUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        // context state/actions
        threeDtextureMode,
        setthreeDTextureMode,

        threeDlogoScale,
        threeDlogoPosX,
        threeDlogoPosY,
        threeDzoom,
        threeDoffsetX,
        threeDoffsetY,
        threeDcolor,

        setthreeDTexture,         // expects THREE.Texture
        setCustomizationData,     // writes persisted state for part
        threeDselectedPart,

        // this is the "applied" image url used by the 3D pipeline
        previewUrl,
        setPreviewUrl,
    } = use3D();

    const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;

    // Generate AI image -> only set local draftUrl
    const generateImage = async () => {
        if (!prompt.trim() || !apiKey) return;
        setLoading(true);

        const payload = { prompt, output_format: "jpeg" };
        const formData = new FormData();
        for (const key in payload) formData.append(key, payload[key]);

        try {
            const response = await fetch(
                "https://api.stability.ai/v2beta/stable-image/generate/ultra",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        Accept: "image/*",
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setDraftUrl(imageUrl); // only local preview
            } else {
                console.error("Error:", await response.text());
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Remove local draft only (doesn't touch applied 3D texture)
    const removeDraft = () => {
        if (draftUrl?.startsWith("blob:")) URL.revokeObjectURL(draftUrl);
        setDraftUrl(null);
        setPrompt("");
    };

    // Apply local draft to 3D pipeline (moves draft -> context.previewUrl)
    const applyDraft = () => {
        if (!draftUrl) return;
        setPreviewUrl(draftUrl);     // triggers 3D texture update effect below
        setDraftUrl(null);           // hide modal preview; it's now applied
    };

    // Build the THREE texture only when the **applied** previewUrl changes
    useEffect(() => {
        if (!previewUrl) return;

        const image = new window.Image();
        image.crossOrigin = "anonymous";
        image.src = previewUrl;

        image.onload = () => {
            const size = 512;
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Base fill with product color
            ctx.fillStyle = threeDcolor || "#fff";
            ctx.fillRect(0, 0, size, size);

            if (threeDtextureMode === "full") {
                const scaledSize = size * threeDzoom;
                const offsetXPx = size * threeDoffsetX;
                const offsetYPx = size * threeDoffsetY;
                ctx.drawImage(image, offsetXPx, offsetYPx, scaledSize, scaledSize);
            } else {
                const logoSize = size * threeDlogoScale;
                const x = size * threeDlogoPosX - logoSize / 2;
                const y = size * threeDlogoPosY - logoSize / 2;
                ctx.drawImage(image, x, y, logoSize, logoSize);
            }

            // Create THREE texture & push to context
            const finalTexture = new THREE.CanvasTexture(canvas);
            finalTexture.needsUpdate = true;
            setthreeDTexture(finalTexture);

            // Safely persist customization (no crash if parts or selected part missing)
            setCustomizationData((prev) => {
                const safePrev = prev || {};
                const prevParts = safePrev.parts || {};
                const key = threeDselectedPart || "DefaultPart";
                const prevPart = prevParts[key] || {};

                return {
                    ...safePrev,
                    parts: {
                        ...prevParts,
                        [key]: {
                            ...prevPart,
                            image: {
                                mode: threeDtextureMode,
                                url: previewUrl,
                                position: { x: threeDlogoPosX, y: threeDlogoPosY },
                                scale: threeDlogoScale,
                                zoom: threeDzoom,
                                offsetX: threeDoffsetX,
                                offsetY: threeDoffsetY,
                            },
                        },
                    },
                };
            });
        };
    }, [
        draftUrl,
        previewUrl,
        threeDtextureMode,
        threeDlogoScale,
        threeDlogoPosX,
        threeDlogoPosY,
        threeDzoom,
        threeDoffsetX,
        threeDoffsetY,
        threeDcolor,
        setthreeDTexture,
        setCustomizationData,
        threeDselectedPart,
    ]);

    useEffect(() => {
        console.log("EditorTab mounted", apiKey);
    }, [])

    return (
        <div className="kr-editor-container kr-reset-margin-padding">
            {/* Header */}
            <div className="kr-editor-header kr-reset-margin">
                <div className="kr-editor-title-section kr-reset-margin">
                    <img
                        src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341726/Frame_12_mbe4a0.png"
                        alt="AI"
                        className="kr-reset-margin-padding"
                    />
                    <h3 className="kr-editor-title kr-reset-margin-padding">
                        Improve with AI
                    </h3>
                </div>
                <div
                    onClick={() => setShowEditorModal(false)}
                    className="kr-editor-close kr-reset-margin-padding"
                >
                    <img
                        src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png"
                        alt="Close"
                        className="kr-reset-margin-padding"
                    />
                </div>
            </div>

            <hr className="kr-editor-divider kr-reset-margin-padding" />

            <div className="kr-editor-content kr-reset-margin">
                <div className="kr-editor-form kr-reset-margin-padding">
                    {/* If no local draft → show prompt UI */}
                    {!draftUrl ? (
                        <>
                            <label htmlFor="description" className="kr-editor-label kr-reset-margin-padding">
                                Description*
                            </label>

                            <div className="kr-editor-textarea-container kr-reset-margin-padding">
                                <textarea
                                    name="description"
                                    className="kr-editor-textarea kr-reset-margin"
                                    placeholder="Describe the design in a sentence"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <div className="kr-editor-prompt-badge kr-reset-margin">
                                    <span className="kr-editor-prompt-text kr-reset-margin-padding">Prompt</span>
                                    <img
                                        src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749343021/Frame_12_1_jktiv7.png"
                                        alt="AI"
                                    />
                                </div>
                            </div>

                            {/* Mode tabs (Full / Logo) */}
                            <div className="kr-editor-tags kr-reset-padding">
                                <span
                                    className={`kr-editor-tag kr-reset-margin ${threeDtextureMode !== "full" ? "kr-active" : "kr-inactive"
                                        }`}
                                    onClick={() => setthreeDTextureMode("full")}
                                >
                                    Full Texture
                                </span>
                                <span
                                    className={`kr-editor-tag kr-reset-margin ${threeDtextureMode !== "logo" ? "kr-active" : "kr-inactive"
                                        }`}
                                    onClick={() => setthreeDTextureMode("logo")}
                                >
                                    Logo
                                </span>
                            </div>

                            <button
                                className="kr-editor-generate-btn kr-reset-margin"
                                onClick={generateImage}
                                disabled={loading || !prompt.trim()}
                            >
                                {loading ? "Generating..." : "Generate"}
                            </button>
                        </>
                    ) : (
                        // If local draft exists → show preview + tabs + Apply/Remove
                        <div className="kr-editor-preview-container">
                            <div className="kr-editor-remove-btn" onClick={removeDraft} title="Remove">
                                ❌
                            </div>

                            <img src={draftUrl} alt="AI Generated" className="kr-editor-preview-img" />

                            {/* Mode tabs */}
                            <div className="kr-editor-tags kr-reset-padding">
                                <span
                                    className={`kr-editor-tag kr-reset-margin ${threeDtextureMode !== "full" ? "kr-active" : "kr-inactive"
                                        }`}
                                    onClick={() => setthreeDTextureMode("full")}
                                >
                                    Full Texture
                                </span>
                                <span
                                    className={`kr-editor-tag kr-reset-margin ${threeDtextureMode !== "logo" ? "kr-active" : "kr-inactive"
                                        }`}
                                    onClick={() => setthreeDTextureMode("logo")}
                                >
                                    Logo
                                </span>
                            </div>

                            <button
                                className="kr-editor-generate-btn kr-editor-preview-btn kr-reset-margin"
                                onClick={applyDraft}
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorTab;
