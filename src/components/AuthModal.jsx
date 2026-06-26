import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearAuthMessages } from '../store/authSlice';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [validationError, setValidationError] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error, successMsg, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isOpen) {
      dispatch(clearAuthMessages());
      setValidationError('');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  }, [isOpen, isLogin, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setValidationError('Name is required.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      dispatch(registerUser({ name, email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl glass-panel shadow-2xl border border-gray-200 transition-all duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-center text-sm font-semibold transition-all ${
              isLogin 
                ? 'text-indigo-650 border-b-2 border-indigo-500 bg-indigo-50/50' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-center text-sm font-semibold transition-all ${
              !isLogin 
                ? 'text-indigo-650 border-b-2 border-indigo-500 bg-indigo-50/50' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isLogin ? 'Enter your credentials to access your account' : 'Register a free account to start shopping'}
            </p>
          </div>

          {/* Feedback messages */}
          {validationError && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg font-semibold">
              {validationError}
            </div>
          )}
          {error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg font-semibold">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg font-semibold">
              {successMsg}
            </div>
          )}

          {/* Input fields */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-655">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-655">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-655">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isAuthenticated}
            className="w-full py-3 mt-4 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-650/30 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
          
          <div className="text-center text-xs text-gray-500 mt-2">
            Demo account details: Any email & password works after registering, or click Sign In directly with credentials you register!
          </div>
        </form>
      </div>
    </div>
  );
}
