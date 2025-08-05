"use client";

import ProductsShowCase from "./components/ProductsShowCase";
import { backendProducts } from "./data/productsData"; 

export default function Home() {

  return (
    <>
      <ProductsShowCase products={backendProducts} />
    </>
  );
}
