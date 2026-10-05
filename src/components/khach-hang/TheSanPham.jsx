import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Check } from 'lucide-react';
import RatingStars from '../dung-chung/SaoDanhGia';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onAddToCartSuccess }) {
  const { addToCart } = useCart();
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      if (onAddToCartSuccess) onAddToCartSuccess(product);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm uppercase">
            Bán chạy
          </span>
        )}
        {isOutOfStock ? (
          <span className="bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            Hết hàng
          </span>
        ) : isLowStock ? (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse">
            Chỉ còn {product.stock}
          </span>
        ) : null}
      </div>

      {/* Thumbnail */}
      <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-3">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1">
            <span className="text-orange-600">{product.brand}</span>
            <span className="flex items-center gap-0.5">
              <Shield size={11} className="text-emerald-500" />
              BH {product.warrantyMonths}T
            </span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-orange-600 transition-colors leading-snug mb-2" title={product.name}>
              {product.name}
            </h3>
          </Link>

          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-xs mb-3">
            <RatingStars rating={product.rating} size={13} showScore={true} />
            <span className="text-slate-600 text-[11px]">Đã bán {product.soldCount}</span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-50 flex items-end justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-orange-600">
              {product.price.toLocaleString('vi-VN')} <span className="text-xs font-normal underline">đ</span>
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-600 line-through">
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white hover:shadow-md'
            }`}
            title={isOutOfStock ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ'}
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
