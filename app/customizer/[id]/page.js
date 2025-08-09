"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import CustomizerLayout from "../../CustomizerLayout";
import { backendProducts } from "../../data/productsData";
import { use3D } from "@/app/context/3DContext";

export default function CustomizerPage() {
  const { id } = useParams();
  const { selectedProduct, setSelectedProduct } = use3D();

  const product = backendProducts.find(p => String(p.id) === String(id));

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product, setSelectedProduct]);

  console.log("Selected Product:", selectedProduct);

  if (!product) return <div>Product not found</div>;

  return <CustomizerLayout />;
}
