import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onShowToast }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const cartItem = cartItems.find(item => item.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = currentQuantity >= product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    dispatch(addItem(product));
    onShowToast(`Added "${product.name}" to cart!`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:shadow-xl transition-all duration-300">
      
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/80 backdrop-blur-md text-indigo-600 border border-indigo-150">
          {product.category}
        </span>

        {/* Stock Badge */}
        {product.stock === 0 ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-600/90 text-white shadow-md">
            Out of Stock
          </span>
        ) : isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-600/95 text-white shadow-md">
            Max in Cart
          </span>
        ) : product.stock - currentQuantity <= 3 ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/90 text-gray-900 shadow-md">
            Only {product.stock - currentQuantity} left
          </span>
        ) : null}
      </div>

      {/* Product Details Panel */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Purchase Footer */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-150">
          <span className="text-lg font-extrabold text-gray-950">
            ₹{product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10 hover:shadow-indigo-600/25'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
