"use client";
import { useParams } from "next/navigation";
import CustomizerLayout from "../../CustomizerLayout";

import { backendProducts } from "../../data/productsData";
import ThreeDCustomize from "@/app/3DCustomize";

export default function CustomizerPage() {
  const { id } = useParams();
  const product = backendProducts.find(p => String(p.id) === String(id));

  if (!product) return <div>Product not found</div>;

  if(product.productType !== "3D") {
    return <CustomizerLayout selectedProduct={product} />;
  } else {
    return <ThreeDCustomize/>
  }

}