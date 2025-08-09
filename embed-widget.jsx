
import React from 'react'
import ReactDOM from 'react-dom/client'
import "./app/globals.css"
import CustomizerLayout from './app/CustomizerLayout';
import { TwoDProvider } from './app/context/2DContext'
import { ThreeDProvider } from './app/context/3DContext'
import ProductsShowCase from './app/components/2d/ProductsShowCase';
import { backendProducts } from './app/data/productsData';

if (typeof ReactDOM === 'undefined') { console.error('ReactDOM not found'); }

window.mountProductCustomizer = function (selector = '#customizer-root', props = {}) {
  const container = document.querySelector(selector)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(
      <>
        <ProductsShowCase products={backendProducts} />
        <TwoDProvider>
          <ThreeDProvider>
            <CustomizerLayout {...props} id="6" />
          </ThreeDProvider>
        </TwoDProvider>
      </>
    )
  } else {
    console.warn('No mount target found for ProductCustomizer')
  }
}