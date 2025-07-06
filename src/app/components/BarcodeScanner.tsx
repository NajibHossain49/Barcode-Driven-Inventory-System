/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Tesseract from "tesseract.js";

interface Product {
  barcode: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface ApiResponse extends Product {
  isExisting?: boolean;
  existingCategory?: string;
  message?: string;
}

interface BarcodeScannerProps {
  reload: (value: boolean) => void;
  isReload: boolean;
  onScan: (product: Product) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  reload,
  isReload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [product, setProduct] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a valid image file (PNG, JPEG, JPG, or GIF).");
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
      // Perform OCR using Tesseract.js for all supported image types
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Optional: Log OCR progress
      });
      const barcode = text.trim().replace(/\s+/g, "");

      if (!barcode) {
        setError("No barcode found in the uploaded image.");
        setLoading(false);
        return;
      }
      console.log("Extracted barcode:", barcode);

      // Make API call with extracted barcode
      const response = await fetch(`/api/products/${barcode}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Product data is currently unavailable. Please refresh or try again later.");
      }

      const productData: ApiResponse = await response.json();
      setProduct(productData);
      setError(null);
      reload(!isReload); // Trigger reload to update the product list
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the image.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 mr-4">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m6 11a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v6zM8 9l4 4 4-4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Barcode Scanner</h2>
          <p className="text-gray-600 text-sm">
            Upload an image to scan barcodes
          </p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image File
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-gradient-to-r file:from-blue-50 file:to-blue-100
              file:text-blue-700 hover:file:from-blue-100 hover:file:to-blue-200
              file:cursor-pointer file:transition-all file:duration-200
              border border-gray-300 rounded-lg px-3 py-2
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {file && (
          <div className="mt-2 flex items-center text-sm text-green-600">
            <svg
              className="h-4 w-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            File selected: {file.name}
          </div>
        )}
      </div>

      {/* Scan Button */}
      <button
        onClick={handleFileUpload}
        disabled={!file || loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2
          ${
            !file || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Scan Barcode</span>
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Display */}
      {product && (
        <div
          className={`mt-6 p-4 border rounded-lg ${
            product.isExisting
              ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
              : "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
          }`}
        >
          <div className="flex items-center mb-3">
            {product.isExisting ? (
              <svg
                className="h-6 w-6 text-yellow-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <h3
              className={`text-lg font-semibold ${
                product.isExisting ? "text-yellow-800" : "text-green-800"
              }`}
            >
              {product.isExisting
                ? "Product Already Exists!"
                : "Product Found!"}
            </h3>
          </div>

          {/* Status Message */}
          {product.message && (
            <div
              className={`mb-3 p-2 rounded-md ${
                product.isExisting
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              <p className="text-sm font-medium">{product.message}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center">
              <span
                className={`text-sm font-medium w-24 ${
                  product.isExisting ? "text-yellow-700" : "text-green-700"
                }`}
              >
                Barcode:
              </span>
              <span
                className={`text-sm font-mono px-2 py-1 rounded ${
                  product.isExisting
                    ? "text-yellow-800 bg-yellow-200"
                    : "text-green-800 bg-green-200"
                }`}
              >
                {product.barcode}
              </span>
            </div>
            <div className="flex items-start">
              <span
                className={`text-sm font-medium w-24 mt-1 ${
                  product.isExisting ? "text-yellow-700" : "text-green-700"
                }`}
              >
                Product:
              </span>
              <span
                className={`text-sm ${
                  product.isExisting ? "text-yellow-800" : "text-green-800"
                }`}
              >
                {product.description}
              </span>
            </div>
            {product.isExisting && product.existingCategory && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-yellow-700 w-24">
                  Category:
                </span>
                <span className="text-sm text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                  {product.existingCategory}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-1">
          Tips for better results:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Ensure the barcode is clearly visible and well-lit</li>
          <li>• Use high-resolution images for better accuracy</li>
          <li>• Supported formats: PNG, JPEG, JPG, GIF</li>
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScanner;
