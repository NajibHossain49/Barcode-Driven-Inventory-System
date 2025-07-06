// This component represents the Kanban board for managing products.
"use client";

import { Category, Product } from "@/app/lib/types";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import ProductCard from "./ProductCard";

export default function KanbanBoard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { name: "Uncategorized" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [reload, setReload] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [reload]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories([{ name: "Uncategorized" }, ...response.data]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        await axios.post("/api/categories", { name: newCategory });
        setCategories([...categories, { name: newCategory }]);
        setNewCategory("");
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const product = products.find((p) => p.barcode === draggableId);
      if (product) {
        try {
          await axios.patch(`/api/products/${product.barcode}`, {
            category: destination.droppableId,
          });
          fetchProducts();
        } catch (error) {
          console.error("Failed to update product category:", error);
        }
      }
    }
  };

  const handleScan = (product: Product) => {
    setProducts([...products, product]);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-7xl w-full">
        {/* Centered Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 mr-4">
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
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                Product Kanban Board
              </h1>
              <p className="text-gray-600">
                Organize and manage your products by category
              </p>
            </div>
          </div>
        </div>

        {/* Barcode Scanner Section */}
        <div className="mb-8">
          <BarcodeScanner
            onScan={handleScan}
            reload={setReload}
            isReload={reload}
          />
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Add Category */}
            <form>
              <div className="lg:w-80">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add New Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Product Categories
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              Drag & drop to organize
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {categories.map((category) => (
                <Droppable droppableId={category.name} key={category.name}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-gradient-to-b from-gray-50 to-gray-100 border-2 border-dashed rounded-lg p-4 w-80 min-h-96 transition-all duration-200 ${
                        snapshot.isDraggingOver
                          ? "border-blue-400 bg-blue-50 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg capitalize">
                          {category.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {
                              filteredProducts.filter(
                                (product) => product.category === category.name
                              ).length
                            }
                          </span>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="space-y-3">
                        {filteredProducts
                          .filter(
                            (product) => product.category === category.name
                          )
                          .map((product, index) => (
                            <ProductCard
                              key={product.barcode}
                              product={product}
                              index={index}
                            />
                          ))}
                      </div>

                      {/* Empty State */}
                      {filteredProducts.filter(
                        (product) => product.category === category.name
                      ).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                          <svg
                            className="h-12 w-12 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="text-sm font-medium">No products</p>
                          <p className="text-xs">Drag items here</p>
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                How to use the Kanban Board
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Drag and drop products between categories to organize them
                  </li>
                  <li>Use the search bar to quickly find specific products</li>
                  <li>
                    Add new categories to create custom organization systems
                  </li>
                  <li>Scan barcodes to add new products to your inventory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
