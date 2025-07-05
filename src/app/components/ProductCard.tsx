// Description: A component to display product details in a draggable card format.

import { Product } from "@/app/lib/types";
import { Draggable } from "@hello-pangea/dnd";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <Draggable draggableId={product.barcode} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded shadow"
        >
          <h3 className="font-bold">{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Barcode: {product.barcode}</p>
        </div>
      )}
    </Draggable>
  );
}
