// This component represents the Kanban board for managing products.
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import axios from 'axios';
import BarcodeScanner from './BarcodeScanner';
import ProductCard from './ProductCard';
import { Product, Category } from '@/app/lib/types';

export default function KanbanBoard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ name: 'Uncategorized' }]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories([{ name: 'Uncategorized' }, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        await axios.post('/api/categories', { name: newCategory });
        setCategories([...categories, { name: newCategory }]);
        setNewCategory('');
      } catch (error) {
        console.error('Failed to add category:', error);
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
          console.error('Failed to update product category:', error);
        }
      }
    }
  };

  const handleScan = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <div>
      <BarcodeScanner onScan={handleScan} />
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white p-2 rounded">
          Add Category
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {categories.map((category) => (
            <Droppable droppableId={category.name} key={category.name}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 w-64 rounded"
                >
                  <h2 className="font-bold mb-2">{category.name}</h2>
                  {products
                    .filter((product) => product.category === category.name)
                    .map((product, index) => (
                      <ProductCard key={product.barcode} product={product} index={index} />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}