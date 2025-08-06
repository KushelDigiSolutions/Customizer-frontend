"use client";

import ProductsShowCase from "./components/2d/ProductsShowCase";
import { backendProducts } from "./data/productsData"; 

export default function Home() {

  return (
    <>
      <ProductsShowCase products={backendProducts} />
    </>
  );
}
