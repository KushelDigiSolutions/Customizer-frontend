
import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomizerLayout from './app/CustomizerLayout';
import { TwoDProvider } from './app/context/2DContext'
import { ThreeDProvider } from './app/context/3DContext'
import "./app/globals.css"

if (typeof ReactDOM === 'undefined') { console.error('ReactDOM not found'); }

window.mountProductCustomizer = function (selector = '#customizer-root', props = {}) {
  const container = document.querySelector(selector)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<>Test APP</>)
  } else {
    console.warn('No mount target found for ProductCustomizer')
  }
}