/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Project: Barcode Scanner Component
// Description: A React component for scanning barcodes using the Quagga library.
"use client";

import { Product } from "@/app/lib/types";
import Quagga from "@ericblade/quagga2";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function BarcodeScanner({
  onScan,
}: {
  onScan: (product: Product) => void;
}) {
  const videoRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        Quagga.decodeSingle(
          {
            src: img.src,
            numOfWorkers: 0, // Disable web workers for simplicity
            decoder: {
              readers: ["ean_reader", "upc_reader"],
            },
          },
          (result: any) => {
            if (result?.codeResult?.code) {
              const barcode = result.codeResult.code;
              axios
                .get(`/api/products/${barcode}`)
                .then((response) => {
                  onScan(response.data);
                })
                .catch(() => {
                  setError("Failed to fetch product details");
                });
            } else {
              setError("No barcode detected in the image");
            }
          }
        );
      };
    }
  };

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current!,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader", "upc_reader"],
        },
      },
      (err: any) => {
        if (err) {
          setError("Failed to initialize barcode scanner");
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(async (result: any) => {
      const barcode = result.codeResult.code;
      if (barcode) {
        try {
          const response = await axios.get(`/api/products/${barcode}`);
          onScan(response.data);
          Quagga.stop();
        } catch (err) {
          setError("Failed to fetch product details");
        }
      }
    });

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <div className="mb-4">
      <div ref={videoRef} className="w-full h-64 border-2 border-gray-300" />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mt-2"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
