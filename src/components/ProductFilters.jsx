import React from 'react';
import { SlidersHorizontal, RotateCcw, Star } from 'lucide-react';
import { categories } from '../data/products';

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  onReset,
  maxPrice = 300
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-6 sticky top-24 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-700 block">Categories</label>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl text-left border transition-all active:scale-98 ${
                selectedCategory === category
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-gray-50 border-gray-250 text-gray-650 hover:border-gray-350 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700 block">Max Price</label>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            ₹{priceRange}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max={maxPrice}
          step="5"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-bold">
          <span>₹10</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-700 block">Minimum Rating</label>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(selectedRating === star ? 0 : star)}
              className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                selectedRating >= star
                  ? 'bg-indigo-50 border-indigo-200 text-amber-650 font-black'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${selectedRating >= star ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{star}+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-200">
        <label className="text-sm font-bold text-gray-700 block">Sort Products</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
        >
          <option value="featured">Featured / Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
