import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '../data/mockData';
import { useProducts } from './ProductContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { deductStockForOrder } = useProducts();
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  // Tạo đơn hàng mới
  const createOrder = (orderData) => {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newOrder = {
      id: orderId,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'COD',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'unpaid' : (orderData.paymentStatus || (orderData.paymentMethod === 'BANK_QR' ? 'unpaid' : 'paid')),
      items: orderData.items,
      itemsTotal: orderData.itemsTotal,
      shippingFee: orderData.shippingFee,
      discountAmount: orderData.discountAmount || 0,
      voucherCode: orderData.voucherCode || '',
      totalAmount: orderData.totalAmount,
      status: 'pending',
      timeline: [
        { status: 'pending', title: 'Đơn hàng đã được tạo thành công', time: nowTime }
      ],
      notes: orderData.notes || '',
      createdAt: nowTime,
      warrantyRequested: false
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Xác nhận đã thanh toán chuyển khoản qua mã QR
  const confirmPayment = (orderId) => {
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          paymentStatus: 'paid',
          timeline: [
            ...order.timeline,
            { status: 'paid', title: 'Khách hàng đã chuyển khoản thành công qua mã QR MBBank', time: nowTime }
          ]
        };
      }
      return order;
    }));
  };

  // Người bán/Admin cập nhật trạng thái đơn hàng:
  // pending -> confirmed -> preparing -> shipping -> delivered
  // hoặc cancelled
  const updateOrderStatus = (orderId, newStatus, note = '') => {
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const statusTitles = {
      pending: 'Đơn hàng đang chờ xác nhận',
      confirmed: 'Người bán đã xác nhận đơn hàng',
      preparing: 'Đang chuẩn bị & đóng gói hàng hóa',
      shipping: 'Đang vận chuyển giao đến bạn',
      delivered: 'Giao hàng thành công',
      cancelled: 'Đơn hàng đã bị hủy'
    };

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        // Nếu chuyển sang đã xác nhận lần đầu -> trừ tồn kho
        if (newStatus === 'confirmed' && order.status === 'pending') {
          deductStockForOrder(order.items);
        }

        const newTimeline = [
          ...order.timeline,
          {
            status: newStatus,
            title: note ? `${statusTitles[newStatus]} (${note})` : statusTitles[newStatus],
            time: nowTime
          }
        ];

        return {
          ...order,
          status: newStatus,
          paymentStatus: newStatus === 'delivered' ? 'paid' : order.paymentStatus,
          timeline: newTimeline
        };
      }
      return order;
    }));
  };

  // Khách hàng hủy đơn (chỉ được hủy khi còn ở trạng thái pending)
  const cancelOrder = (orderId, reason = 'Khách hàng yêu cầu hủy') => {
    updateOrderStatus(orderId, 'cancelled', reason);
  };

  // Khách hàng yêu cầu Đổi trả / Bảo hành sau khi đã nhận hàng (delivered)
  const requestWarranty = (orderId, reason, description) => {
    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          warrantyRequested: true,
          warrantyInfo: {
            reason,
            description,
            requestedAt: nowTime,
            status: 'processing' // processing | approved | rejected
          }
        };
      }
      return order;
    }));
  };

  // Người bán / Admin xử lý yêu cầu bảo hành
  const resolveWarranty = (orderId, status, sellerResponse) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && order.warrantyInfo) {
        return {
          ...order,
          warrantyInfo: {
            ...order.warrantyInfo,
            status,
            sellerResponse,
            resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        };
      }
      return order;
    }));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      confirmPayment,
      updateOrderStatus,
      cancelOrder,
      requestWarranty,
      resolveWarranty
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
