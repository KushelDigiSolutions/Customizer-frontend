
import React from 'react'
import ReactDOM from 'react-dom/client'
import ProductsShowCase from './app/components/2d/ProductsShowCase';
import { backendProducts } from './app/data/productsData';
import "./app/globals.css"

if (typeof ReactDOM === 'undefined') { console.error('ReactDOM not found'); }

window.mountProductCustomizer = function (selector = '#customizer-root', props = {}) {
  const container = document.querySelector(selector)
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(
      <>
        <ProductsShowCase products={backendProducts} />
      </>
    )
  } else {
    console.warn('No mount target found for ProductCustomizer')
  }
}