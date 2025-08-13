// "use client";

// import { useParams } from "next/navigation";
// import { useEffect } from "react";
// import CustomizerLayout from "../../CustomizerLayout";
// import { backendProducts } from "../../data/productsData";
// import { use3D } from "@/app/context/3DContext";

// export default function CustomizerPage() {
//   const { id } = useParams();
//   const { selectedProduct, setSelectedProduct } = use3D();

//   const product = backendProducts.find(p => String(p.id) === String(id));

//   useEffect(() => {
//     if (product) {
//       setSelectedProduct(product);
//     }
//   }, [product, setSelectedProduct]);

//   console.log("Selected Product:", selectedProduct);

//   if (!product) return <div>Product not found</div>;

//   return <CustomizerLayout />;
// }


"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomizerLayout from "../../CustomizerLayout";
import { use3D } from "@/app/context/3DContext";

export default function CustomizerPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { setSelectedProduct } = use3D();

  const productId = searchParams.get("productId") || id;
  const storeHash = searchParams.get("storeHash");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId || !storeHash) return;

    setLoading(true);
    fetch(
      `https://customise.shikharjobs.com/api/developer/product?productId=${productId}&storeHash=${storeHash}`
    )
      .then(res => res.json())
      .then(data => {
        setProduct(data?.data || null);
        setSelectedProduct(data?.data || null);
        console.log("Selected Product:", data?.data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [productId, storeHash, setSelectedProduct]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return <CustomizerLayout />;
}
