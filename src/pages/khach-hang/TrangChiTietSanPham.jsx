import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, ShoppingBag, Heart, Check, Plus, Minus, Star, MessageSquare } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import RatingStars from '../../components/dung-chung/SaoDanhGia';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, reviews, addReview } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy sản phẩm</h2>
        <p className="text-sm text-slate-500">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
        <Link to="/products" className="inline-block bg-orange-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setToast({ type: 'success', message: `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!` });
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setToast({ type: 'error', message: 'Vui lòng đăng nhập để gửi đánh giá sản phẩm' });
      return;
    }
    if (!reviewComment.trim()) {
      setToast({ type: 'error', message: 'Vui lòng nhập nội dung đánh giá' });
      return;
    }
    addReview({
      productId: product.id,
      orderId: 'ORD-DEMO',
      userId: currentUser.id,
      userName: currentUser.name,
      rating: reviewRating,
      comment: reviewComment.trim()
    });
    setReviewComment('');
    setToast({ type: 'success', message: 'Cảm ơn bạn đã gửi đánh giá sản phẩm!' });
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-orange-600">Trang chủ</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-orange-600 capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-md">{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 aspect-square overflow-hidden flex items-center justify-center p-6 shadow-sm">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails list */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl bg-white border-2 overflow-hidden shrink-0 transition-all p-1 ${
                    selectedImage === idx ? 'border-orange-600 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                {product.brand}
              </span>
              <span className="text-xs text-slate-500">Mã SP: {product.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-xs pt-1">
              <RatingStars rating={product.rating} size={16} />
              <span className="text-slate-500">({product.ratingCount} lượt đánh giá)</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-700 font-medium">Đã bán <b>{product.soldCount}</b></span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-5 flex items-baseline gap-4">
            <span className="text-3xl sm:text-4xl font-black text-orange-600">
              {product.price.toLocaleString('vi-VN')} <span className="text-xl underline">đ</span>
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                Tiết kiệm {(product.originalPrice - product.price).toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          {/* Stock & Quantity */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700">Tình trạng tồn kho:</span>
              {isOutOfStock ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                  Đã hết hàng
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Còn lại {product.stock} sản phẩm sẵn có
                </span>
              )}
            </div>

            {/* Quantity Counter */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Số lượng:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
              }`}
            >
              <ShoppingBag size={18} />
              Thêm Vào Giỏ Hàng
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-orange-500/20'
              }`}
            >
              Mua Ngay
            </button>
          </div>

          {/* Guarantees list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
              <span>Bảo hành {product.warrantyMonths} tháng</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Truck className="text-blue-500 shrink-0" size={18} />
              <span>Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <RotateCcw className="text-amber-500 shrink-0" size={18} />
              <span>Đổi mới trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-200">
            Mô tả chi tiết sản phẩm
          </h2>
          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-3">
            <p>{product.description}</p>
            <p>
              Thiết bị chính hãng thương hiệu <b>{product.brand}</b>, được sản xuất theo dây chuyền công nghệ cao, đạt tiêu chuẩn tiết kiệm năng lượng và an toàn thực phẩm. Thích hợp cho mọi không gian căn bếp hiện đại của gia đình Việt.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-200 uppercase tracking-wider">
            Thông số kỹ thuật
          </h3>
          <div className="space-y-2.5 text-xs">
            {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                <span className="text-slate-500">{key}</span>
                <span className="font-semibold text-slate-800 text-right">{val}</span>
              </div>
            ))}
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Chính sách bảo hành</span>
              <span className="font-semibold text-emerald-600">{product.warrantyMonths} Tháng Chính Hãng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={20} className="text-orange-600" />
              Đánh giá từ khách hàng ({productReviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Ý kiến và trải nghiệm thực tế từ người đã mua hàng</p>
          </div>
        </div>

        {/* Review form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Viết đánh giá của bạn
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">Đánh giá sao:</span>
              <RatingStars
                rating={reviewRating}
                size={22}
                showScore={false}
                onRate={(val) => setReviewRating(val)}
              />
              <span className="text-xs font-bold text-amber-600">({reviewRating} sao)</span>
            </div>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm, thời gian giao hàng, cách đóng gói..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors"
              >
                Gửi Đánh Giá
              </button>
            </div>
          </form>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                    <RatingStars rating={rev.rating} size={13} showScore={false} />
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
