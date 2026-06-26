import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, deleteItem } from '../store/cartSlice';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, onOpenAuth, onGoToCheckout }) {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleCheckoutClick = () => {
    onClose();
    if (isAuthenticated) {
      onGoToCheckout();
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Slider Panel */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Cart Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-650" />
            <h3 className="text-lg font-bold text-gray-900">Your Cart</h3>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 bg-gray-50 rounded-full text-gray-450 animate-pulse">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-sm font-semibold text-gray-650">Your shopping cart is empty</p>
              <button 
                onClick={onClose}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Start Browsing Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 bg-gray-50 border border-gray-150 rounded-xl hover:border-gray-250 transition-colors"
              >
                {/* Item Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Item Info & Actions */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">{item.name}</h4>
                    <button 
                      onClick={() => dispatch(deleteItem(item.id))}
                      className="text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-extrabold text-gray-955">₹{(item.price * item.quantity).toFixed(2)}</span>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center bg-gray-105 border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => dispatch(removeItem(item.id))}
                        className="p-1 px-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(addItem(item))}
                        disabled={item.quantity >= item.stock}
                        className="p-1 px-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-gray-50/80 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-900 font-extrabold pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 text-sm"
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
