import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_PROMOTIONS, INITIAL_REVIEWS } from '../data/mockData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('app_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('app_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('app_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('app_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('app_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Người bán & Admin: Thêm sản phẩm
  const addProduct = (prodData) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: prodData.name,
      category: prodData.category || 'bep',
      brand: prodData.brand || 'Khác',
      price: Number(prodData.price),
      originalPrice: Number(prodData.originalPrice) || Number(prodData.price),
      rating: 5.0,
      ratingCount: 0,
      stock: Number(prodData.stock) || 0,
      soldCount: 0,
      featured: Boolean(prodData.featured),
      bestSeller: false,
      sellerId: prodData.sellerId || 'usr_seller',
      sellerName: prodData.sellerName || 'Gia Dụng SmartHome Chính Hãng',
      thumbnail: prodData.thumbnail || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      images: prodData.images?.length ? prodData.images : [prodData.thumbnail],
      description: prodData.description || '',
      specifications: prodData.specifications || {},
      warrantyMonths: Number(prodData.warrantyMonths) || 12,
      status: 'active'
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  // Cập nhật sản phẩm
  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));
  };

  // Cập nhật tồn kho (Stock)
  const updateStock = (id, newStock) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, Number(newStock)) };
      }
      return p;
    }));
  };

  // Xóa sản phẩm
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Giảm tồn kho và tăng số lượng bán khi có đơn hàng được xác nhận
  const deductStockForOrder = (items) => {
    setProducts(prev => prev.map(p => {
      const orderItem = items.find(it => it.productId === p.id);
      if (orderItem) {
        const remainingStock = Math.max(0, p.stock - orderItem.quantity);
        return {
          ...p,
          stock: remainingStock,
          soldCount: (p.soldCount || 0) + orderItem.quantity
        };
      }
      return p;
    }));
  };

  // Khuyến mãi: Tạo mới bởi Admin
  const addPromotion = (promo) => {
    const newPromo = {
      id: `promo_${Date.now()}`,
      code: promo.code.toUpperCase().trim(),
      title: promo.title,
      discountType: promo.discountType || 'fixed',
      discountValue: Number(promo.discountValue),
      minOrderValue: Number(promo.minOrderValue) || 0,
      maxDiscount: Number(promo.maxDiscount) || Number(promo.discountValue),
      expiryDate: promo.expiryDate || '2026-12-31',
      usageLimit: Number(promo.usageLimit) || 100,
      usedCount: 0,
      status: 'active'
    };
    setPromotions(prev => [newPromo, ...prev]);
    return newPromo;
  };

  const togglePromotionStatus = (id) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'active' ? 'inactive' : 'active' };
      }
      return p;
    }));
  };

  const deletePromotion = (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // Đánh giá sản phẩm
  const addReview = ({ productId, orderId, userId, userName, rating, comment }) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      productId,
      orderId,
      userId,
      userName,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'approved'
    };
    setReviews(prev => [newReview, ...prev]);

    // Tính lại rating trung bình cho sản phẩm
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prodReviews = [...reviews.filter(r => r.productId === productId), newReview];
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        return {
          ...p,
          rating: Number(avg.toFixed(1)),
          ratingCount: prodReviews.length
        };
      }
      return p;
    }));
  };

  return (
    <ProductContext.Provider value={{
      products,
      promotions,
      reviews,
      addProduct,
      updateProduct,
      updateStock,
      deleteProduct,
      deductStockForOrder,
      addPromotion,
      togglePromotionStatus,
      deletePromotion,
      addReview
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
