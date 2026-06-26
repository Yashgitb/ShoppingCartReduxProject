import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, Truck, Loader2 } from 'lucide-react';

export default function CheckoutPage({ onBackToShop, onShowToast }) {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zip: '',
    cardName: user?.name || '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    if (!formData.cardName) newErrors.cardName = 'Name on card is required';
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Use MM/YY format';
    }
    if (formData.cardCvv.length !== 3) {
      newErrors.cardCvv = 'Enter 3-digit CVV';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) {
      onShowToast('Please fix the errors in the form.');
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway processing latency
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      dispatch(clearCart());
      onShowToast('Order placed successfully!');
    }, 2000);
  };

  if (isSuccess) {
    const orderNo = Math.floor(100000 + Math.random() * 900000);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 animate-bounce">
            <CheckCircle className="w-16 h-16" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900">Order Confirmed!</h2>
          <p className="text-gray-600 text-sm">
            Thank you for your purchase, {formData.cardName}. Your payment was processed successfully.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 text-left max-w-md mx-auto border border-gray-200 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-extrabold text-gray-900">#APX-{orderNo}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Shipping To:</span>
            <span className="font-semibold text-gray-900">{formData.address}, {formData.city}</span>
          </div>
          <div className="flex justify-between text-xs border-t border-gray-200 pt-3">
            <span className="text-gray-500 font-bold">Estimated Delivery:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> 3-5 Business Days
            </span>
          </div>
        </div>

        <button
          onClick={onBackToShop}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* Back Header */}
      <button
        onClick={onBackToShop}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-950 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Store</span>
      </button>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-2xl border border-gray-200">
          <p className="text-gray-650 text-sm">Your cart is empty. Add some products before checking out!</p>
          <button 
            onClick={onBackToShop}
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all text-xs"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Billing / Payment Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
            
            {/* Shipping details */}
            <div className="glass-panel rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Truck className="w-4.5 h-4.5 text-indigo-600" />
                Shipping Information
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-850 focus:outline-none focus:border-indigo-500 transition-colors ${
                    errors.address ? 'border-rose-500' : 'border-gray-200'
                  }`}
                />
                {errors.address && <p className="text-[10px] font-semibold text-rose-600">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.city ? 'border-rose-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] font-semibold text-rose-600">{errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="10001"
                    className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.zip ? 'border-rose-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.zip && <p className="text-[10px] font-semibold text-rose-600">{errors.zip}</p>}
                </div>
              </div>
            </div>

            {/* Payment details */}
            <div className="glass-panel rounded-2xl p-6 border border-gray-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <CreditCard className="w-4.5 h-4.5 text-indigo-600" />
                Payment Method
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                    errors.cardName ? 'border-rose-500' : 'border-gray-200'
                  }`}
                />
                {errors.cardName && <p className="text-[10px] font-semibold text-rose-600">{errors.cardName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    // Simple formatting
                    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    setFormData({ ...formData, cardNumber: formatted });
                  }}
                  placeholder="4111 2222 3333 4444"
                  className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                    errors.cardNumber ? 'border-rose-500' : 'border-gray-200'
                  }`}
                />
                {errors.cardNumber && <p className="text-[10px] font-semibold text-rose-600">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">Expiry Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                      const formatted = value.length >= 2 ? `${value.substring(0, 2)}/${value.substring(2, 4)}` : value;
                      setFormData({ ...formData, cardExpiry: formatted });
                    }}
                    placeholder="MM/YY"
                    className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.cardExpiry ? 'border-rose-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.cardExpiry && <p className="text-[10px] font-semibold text-rose-600">{errors.cardExpiry}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">CVV</label>
                  <input
                    type="password"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                      setFormData({ ...formData, cardCvv: value });
                    }}
                    placeholder="123"
                    className={`w-full py-2.5 px-4 text-sm bg-gray-50 border rounded-xl text-gray-855 focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.cardCvv ? 'border-rose-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.cardCvv && <p className="text-[10px] font-semibold text-rose-600">{errors.cardCvv}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Pay ₹{totalPrice.toFixed(2)} Securely
                </>
              )}
            </button>
          </form>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-gray-200 space-y-4 lg:sticky lg:top-24">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-3">Order Summary</h3>
            
            <div className="divide-y divide-gray-200 overflow-y-auto max-h-80 pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 shrink-0" />
                  <div className="grow min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-955 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-550">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-555">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-950 font-extrabold pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
