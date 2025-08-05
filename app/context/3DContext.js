'use client'

import React, { createContext, useContext, useState } from "react";

const threeDcontext = createContext();

export const ThreeDProvider = ({ children }) => {
  const [threeDcolor, setthreeDColor] = useState('#ffffff');
  const [threeDtexture, setthreeDTexture] = useState(null);
  const [threeDselectedPart, setthreeDSelectedPart] = useState('Front');

  const [threeDzoom, setthreeDZoom] = useState(1);
  const [threeDoffsetX, setthreeDOffsetX] = useState(0);
  const [threeDoffsetY, setthreeDOffsetY] = useState(0);

  const [threeDtext, setthreeDText] = useState('');
  const [threeDtextTexture, setthreeDTextTexture] = useState(null);
  const [threeDtextColor, setthreeDTextColor] = useState('#000000');
  const [threeDoutlineColor, setthreeDOutlineColor] = useState('#ffffff');

  const [threeDtextScale, setthreeDTextScale] = useState(1);
  const [threeDtextPosX, setthreeDTextPosX] = useState(0.5);
  const [threeDtextPosY, setthreeDTextPosY] = useState(0.5);

  const [threeDscreenshots, setthreeDScreenshots] = useState([]);
  const [threeDloading, setthreeDLoading] = useState(false);

  const [threeDtextureMode, setthreeDTextureMode] = useState('full');
  const [threeDlogoScale, setthreeDLogoScale] = useState(0.5);
  const [threeDlogoPosX, setthreeDLogoPosX] = useState(0.5);
  const [threeDlogoPosY, setthreeDLogoPosY] = useState(0.5);

  const [customizationData, setCustomizationData] = useState(0.5);

  return (
    <threeDcontext.Provider value={{
      threeDcolor, setthreeDColor,
      threeDtexture, setthreeDTexture,
      threeDselectedPart, setthreeDSelectedPart,
      threeDzoom, setthreeDZoom,
      threeDoffsetX, setthreeDOffsetX,
      threeDoffsetY, setthreeDOffsetY,
      threeDtext, setthreeDText,
      threeDtextTexture, setthreeDTextTexture,
      threeDtextColor, setthreeDTextColor,
      threeDoutlineColor, setthreeDOutlineColor,
      threeDtextScale, setthreeDTextScale,
      threeDtextPosX, setthreeDTextPosX,
      threeDtextPosY, setthreeDTextPosY,
      threeDscreenshots, setthreeDScreenshots,
      threeDloading, setthreeDLoading,
      threeDtextureMode, setthreeDTextureMode,
      threeDlogoScale, setthreeDLogoScale,
      threeDlogoPosX, setthreeDLogoPosX,
      threeDlogoPosY, setthreeDLogoPosY,
      customizationData, setCustomizationData
    }}>
      {children}
    </threeDcontext.Provider>
  );
};

export const use3D = () => useContext(threeDcontext);
