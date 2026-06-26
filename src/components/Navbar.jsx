import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { ShoppingCart, LogIn, LogOut, User, Search, Menu, X } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenCart,
  onOpenAuth,
  onGoToStore,
  onShowToast
}) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { totalQuantity } = useSelector(state => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    onShowToast('Successfully logged out.');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div 
            onClick={onGoToStore}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600 to-violet-750 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              A
            </div>
            <span className="text-lg font-black tracking-tight bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              ApexStore
            </span>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search premium products..."
              className="w-full py-2 pl-10 pr-4 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search toggled for mobile - ignored on desktop */}
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-gray-50 border border-gray-200 hover:border-indigo-500/30 hover:bg-white rounded-xl text-gray-600 hover:text-gray-900 transition-all active:scale-95 group shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white font-black text-[9px] min-w-5 h-5 flex items-center justify-center px-1 rounded-full border-2 border-white animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold font-sans uppercase">
                    {user?.name?.substring(0, 2) || <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] text-gray-500 font-semibold leading-none">Welcome,</p>
                    <p className="text-xs text-gray-800 font-bold max-w-20 truncate mt-0.5">{user?.name}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-gray-50 border border-gray-200 hover:border-rose-500/20 hover:text-rose-600 hover:bg-white rounded-xl text-gray-500 transition-all active:scale-95"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>

          {/* Hamburger Mobile Menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-gray-50 border border-gray-205 rounded-xl text-gray-600 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-black text-[9px] min-w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white">
                  {totalQuantity}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-gray-50 border border-gray-205 rounded-xl text-gray-500 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-4 animate-slide-down shadow-lg">
          {/* Mobile Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mobile Auth and details */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold uppercase">
                    {user?.name?.substring(0, 2)}
                  </div>
                  <span className="text-xs text-gray-800 font-bold">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-205 text-xs text-rose-600 hover:text-rose-500 font-bold rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
