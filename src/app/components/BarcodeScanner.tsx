import React, { useState } from "react";
import Tesseract from "tesseract.js";

interface Product {
  barcode: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const BarcodeScanner: React.FC = ({ reload, isReload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (
        !["image/png", "image/jpeg", "image/jpg"].includes(selectedFile.type)
      ) {
        setError("Please upload a valid image file (PNG, JPEG, or JPG).");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select an image file to upload.");
      return;
    }

    setLoading(true);
    try {
      // Perform OCR using Tesseract.js
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Optional: Log OCR progress
      });

      const barcode = text.trim().replace(/\s+/g, ""); // Remove extra spaces and newlines

      if (!barcode) {
        setError("No barcode found in the uploaded image.");
        setLoading(false);
        return;
      }
      console.log(barcode);

      // Make API call with extracted barcode
      const response = await fetch(`/api/products/${barcode}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch product");
      }

      const productData: Product = await response.json();
      setProduct(productData);
      setError(null);
      reload(!isReload); // Trigger reload to update the product list in the parent component
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the image.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };
  console.log(product);
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Barcode Scanner</h2>
      <div className="mb-4">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <button
        onClick={handleFileUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold
          ${
            !file || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
      >
        {loading ? "Processing..." : "Scan Barcode"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {product && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <p>
            <strong>Barcode:</strong> {product.barcode}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          {/* <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Category:</strong> {product.category}</p> */}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
