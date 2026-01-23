import { useParams } from "react-router-dom";
import { getProductById } from "../utils/mockData";

export function ProductDetailTest() {
  const { id } = useParams();
  const product = getProductById(id);
  
  console.log("ProductDetailTest rendered");
  console.log("ID:", id);
  console.log("Product:", product);
  
  return (
    <div className="pt-32 min-h-screen bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">TEST PAGE - Product Detail</h1>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="mb-2"><strong>ID from URL:</strong> {id}</p>
          <p className="mb-2"><strong>Product found:</strong> {product ? "YES" : "NO"}</p>
          {product && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="mb-1">Designer: {product.designer}</p>
              <p className="mb-1">Price: {product.pricePerDay.toLocaleString()}đ</p>
              <p className="mb-1">Rating: {product.rating}</p>
              <div className="mt-4">
                <img src={product.images[0]} alt={product.name} className="w-64 h-auto rounded" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
