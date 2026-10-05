import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { promotions } = useProducts();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('app_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedVoucher, setAppliedVoucher] = useState(() => {
    const saved = localStorage.getItem('app_voucher');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedVoucher) {
      localStorage.setItem('app_voucher', JSON.stringify(appliedVoucher));
    } else {
      localStorage.removeItem('app_voucher');
    }
  }, [appliedVoucher]);

  // Thêm vào giỏ
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock)
        }
      ];
    });
  };

  // Cập nhật số lượng
  const updateQuantity = (productId, quantity, maxStock) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const finalQty = maxStock ? Math.min(quantity, maxStock) : quantity;
    setCartItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity: finalQty } : item
    ));
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  // Xóa toàn bộ giỏ
  const clearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
  };

  // Tính tổng tiền sản phẩm
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Phí vận chuyển (Mặc định 30.000đ, miễn phí nếu đơn > 1 triệu)
  const baseShippingFee = subtotal > 1000000 || subtotal === 0 ? 0 : 30000;

  // Tính giảm giá theo voucher
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.code === 'FREESHIP') {
      discountAmount = Math.min(baseShippingFee, appliedVoucher.discountValue || 30000);
    } else if (appliedVoucher.discountType === 'percentage') {
      const percentValue = Math.round((subtotal * appliedVoucher.discountValue) / 100);
      discountAmount = Math.min(percentValue, appliedVoucher.maxDiscount || percentValue);
    } else {
      discountAmount = Math.min(appliedVoucher.discountValue, appliedVoucher.maxDiscount || appliedVoucher.discountValue);
    }
  }

  const finalShippingFee = appliedVoucher?.code === 'FREESHIP' ? 0 : baseShippingFee;
  const totalAmount = Math.max(0, subtotal + finalShippingFee - (appliedVoucher?.code === 'FREESHIP' ? 0 : discountAmount));

  // Áp dụng voucher
  const applyVoucher = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promotions.find(p => p.code === cleanCode && p.status === 'active');
    if (!found) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Đơn hàng cần đạt tối thiểu ${found.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này`
      };
    }
    setAppliedVoucher(found);
    return { success: true, voucher: found, message: 'Áp dụng mã ưu đãi thành công!' };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalCount: cartItems.reduce((c, it) => c + it.quantity, 0),
      subtotal,
      shippingFee: finalShippingFee,
      discountAmount,
      totalAmount,
      appliedVoucher,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyVoucher,
      removeVoucher
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
