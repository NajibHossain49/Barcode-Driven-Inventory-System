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
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md 
            transition-all duration-200 ease-in-out mb-3 p-5 cursor-grab
            ${
              snapshot.isDragging
                ? "shadow-lg ring-2 ring-blue-200 rotate-2"
                : ""
            }
            hover:border-gray-300 active:cursor-grabbing
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">
                {product.name}
              </h3>
              {/* <p className="text-gray-600 text-sm mb-2">{product.description}</p> */}
              {/* <p className="text-green-600 font-medium text-lg">${product.price}</p> */}
              <div className="flex items-center mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {product.barcode}
                </span>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
