"use client";

import BarcodeScanner from "@/app/components/BarcodeScanner";
import Navbar from "@/app/components/Navbar";
import { Product } from "@/app/lib/types";
import { useState } from "react";

export default function Home() {
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);

  const handleScan = (product: Product) => {
    setScannedProducts((prev) => {
      if (!prev.some((p) => p.barcode === product.barcode)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          Barcode-Driven Inventory System
        </h1>
        <BarcodeScanner onScan={handleScan} />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Scanned Products</h2>
          {scannedProducts.length === 0 ? (
            <p>No products scanned yet</p>
          ) : (
            <ul className="space-y-2">
              {scannedProducts.map((product) => (
                <li
                  key={product.barcode}
                  className="p-2 bg-white rounded shadow"
                >
                  <p>
                    <strong>Name:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Barcode:</strong> {product.barcode}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
