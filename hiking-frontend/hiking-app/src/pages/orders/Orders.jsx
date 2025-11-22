import React, { useState, useEffect, useCallback } from "react";
import { App } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import "./Orders.scss";
import ChatHelper from "../../components/ChatHelper/chathelper";

function Orders() {
  const { message } = App.useApp();
  const userId = useSelector((state) => state.loggedUser.user?._id);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    if (!userId) {
      message.warning('Please login to view your orders');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userId, fetchOrders, message, navigate]);

  // Reset to page 1 when orders change
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${config.BASE_URL}/users/${userId}/orders`);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [userId, message]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#52c41a';
      case 'processing':
        return '#1890ff';
      case 'pending':
        return '#faad14';
      case 'cancelled':
        return '#ff4d4f';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="main-container">
          <h1 className="orders-page-title">My Orders</h1>
          <p className="orders-page-subtitle">Track and manage your orders</p>
        </div>
      </div>

      <div className="main-container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <button 
              className="browse-products-btn"
              onClick={() => navigate('/gear')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="orders-list">
              {currentOrders.map((order) => (
                <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.toString().slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items?.length || 0})</h4>
                  <div className="items-list">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                          <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="orders-pagination">
                <button
                  className="pagination-btn prev-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="pagination-btn next-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
              ×
            </button>
            <h2>Order Details</h2>
            
            <div className="order-details">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <span>{selectedOrder._id.toString()}</span>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{formatDate(selectedOrder.orderDate)}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">${selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Shipping Address</h3>
                <div className="address-info">
                  <p>{selectedOrder.shippingAddress?.street || ''}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city || ''}, 
                    {selectedOrder.shippingAddress?.state || ''} {selectedOrder.shippingAddress?.zipCode || ''}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country || ''}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-row">
                  <span>Email:</span>
                  <span>{selectedOrder.contactInfo?.email || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedOrder.contactInfo?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Payment Method</h3>
                <div className="detail-row">
                  <span>Type:</span>
                  <span>{selectedOrder.paymentMethod?.type?.replace('_', ' ').toUpperCase() || 'N/A'}</span>
                </div>
                {selectedOrder.paymentMethod?.cardNumber && (
                  <div className="detail-row">
                    <span>Card:</span>
                    <span>{selectedOrder.paymentMethod.cardNumber}</span>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                <div className="items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.imageUrl} alt={item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                        <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatHelper />
    </div>
  );
}

export default Orders;

