
import React from 'react'
import ReactDOM from 'react-dom/client'
import CustomizerLayout from './app/CustomizerLayout';
import { TwoDProvider } from './app/context/2DContext'
import { ThreeDProvider } from './app/context/3DContext'
import "./app/globals.css"
import { backendProducts } from './app/data/productsData';

if (typeof ReactDOM === 'undefined') { console.error('ReactDOM not found'); }

window.mountProductCustomizer = function (selector = '#customizer-root', props = {}) {
  const container = document.querySelector(selector)
  if (container) {
    const root = ReactDOM.createRoot(container)

    // Get product ID from URL like /customizer/6
    const idFromPath = 6;
    const product = backendProducts.find(p => String(p.id) === String(idFromPath))

    console.log('product')
    console.log(product)

    if (!product) {
      container.innerHTML = '<div>Product not found</div>'
      return
    }

    root.render(
      <>
      <CustomizerLayout {...props} initialProduct={product} />
      <TwoDProvider>
        <ThreeDProvider></ThreeDProvider>
      </TwoDProvider>
      </>
    )
  } else {
    console.warn('No mount target found for ProductCustomizer')
  }
}