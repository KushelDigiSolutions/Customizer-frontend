'use client'
import React, { useEffect } from "react";
import './FontSelector.css';

const families = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Source Sans Pro",
  "Raleway", "Noto Sans", "Ubuntu", "Merriweather", "Nunito", "Playfair Display",
  "Rubik", "Work Sans", "PT Sans", "Oswald", "Inter", "Quicksand", "DM Sans",
  "Roboto Condensed", "Bebas Neue", "Anton", "Dancing Script", "Cabin", "Fira Sans",
  "Mukta", "Josefin Sans", "Abel", "Teko", "Titillium Web",
  "Arimo", "Asap", "Barlow", "Cairo", "Chivo", "Cinzel", "Cormorant Garamond",
  "Domine", "EB Garamond", "Exo 2", "Francois One", "Heebo", "Hind", "IBM Plex Sans",
  "Inconsolata", "Kanit", "Karla", "Libre Baskerville", "Libre Franklin", "Lora",
  "Manrope", "Maven Pro", "Muli", "Noto Serif", "Overpass", "PT Serif",
  "Public Sans", "Questrial", "Righteous", "Signika", "Slabo 27px", "Spartan",
  "Sora", "Syne", "Tajawal", "Zilla Slab"
]

const FontSelector = ({ setSelectedFont, selectedFont, setShowTextSelectTab, editor }) => {
  useEffect(() => {
    const loadFont = async () => {
      if (typeof window !== "undefined") {
        const WebFont = (await import('webfontloader')).default;
        WebFont.load({
          google: {
            families,
          },
        });
      }
    };

    loadFont();
  }, []);

  // Helper to update canvas text font for 2D
  const applyFontToCanvas = (font) => {
    if (editor?.canvas) {
      const textObj = editor.canvas.getObjects().find(obj => obj.type === "i-text");
      if (textObj) {
        textObj.set("fontFamily", font);
        editor.canvas.renderAll();
      }
    }
  };

  const handleFontClick = (font) => {
    setSelectedFont(font);
    applyFontToCanvas(font); // <-- update canvas text object
  };

  return (
    <div className="kr-fontselector-container kr-reset-margin-padding">
      <div className='kr-fontselector-header kr-reset-margin'>
        <h3 className='kr-fontselector-title kr-reset-margin-padding'>Typeface</h3>
        <div className="kr-fontselector-close kr-reset-margin-padding" onClick={() => setShowTextSelectTab(false)}>
          <img src="https://res.cloudinary.com/dd9tagtiw/image/upload/v1749341803/Vector_hm0yzo.png" alt="Close" />
        </div>
      </div>
      <hr className="kr-fontselector-divider kr-reset-margin-padding" />

      <div className="kr-fontselector-content kr-reset-margin">
        {families.map((font) => (
          <div key={font} className="kr-fontselector-item kr-reset-margin" onClick={() => handleFontClick(font)}>
            <p className="kr-fontselector-font kr-reset-margin-padding" style={{ fontFamily: font }}>
              {font}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;