/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

interface CategoryCount {
  category: string;
  count: number;
}

interface Product {
  _id: string;
  barcode: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface AnalyticsData {
  categoryCounts: CategoryCount[];
  recentProducts: Product[];
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    categoryCounts: [],
    recentProducts: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const data: AnalyticsData = await response.json();
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics data");
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Products per Category */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Products per Category</h3>
        {analytics.categoryCounts.length === 0 ? (
          <p>No categories found</p>
        ) : (
          <ul className="list-disc pl-5">
            {analytics.categoryCounts.map((item) => (
              <li key={item.category}>
                {item.category}: {item.count} product
                {item.count !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recently Added Products */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Recently Added Products</h3>
        {analytics.recentProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul className="space-y-2">
            {analytics.recentProducts.map((product) => (
              <li key={product._id} className="p-2 bg-white rounded shadow">
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
  );
}
