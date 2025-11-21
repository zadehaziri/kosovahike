import React, { useState, useEffect } from "react";
import { App } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import "./Cart.scss";
import ChatHelper from "../../components/ChatHelper/chathelper";

function Cart() {
  const { message } = App.useApp();
  const userId = useSelector((state) => state.loggedUser.user?._id);
  const user = useSelector((state) => state.loggedUser.user);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: {
      type: 'credit_card',
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: ''
    },
    contactInfo: {
      email: user?.email || '',
      phone: ''
    }
  });

  useEffect(() => {
    if (!userId) {
      message.warning('Please login to view your cart');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${config.BASE_URL}/users/${userId}/cart`);
      setCart(response.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      message.error('Failed to load cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!userId) return;

    try {
      const response = await axios.put(
        `${config.BASE_URL}/users/${userId}/cart/${productId}`,
        { quantity: newQuantity }
      );
      setCart(response.data);
      message.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    if (!userId) return;

    try {
      const response = await axios.delete(
        `${config.BASE_URL}/users/${userId}/cart/${productId}`
      );
      setCart(response.data);
      message.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      message.error(error.response?.data?.error || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      await axios.delete(`${config.BASE_URL}/users/${userId}/cart`);
      setCart([]);
      message.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error(error.response?.data?.error || 'Failed to clear cart');
    }
  };

  const handleCheckoutClick = () => {
    if (!userId) {
      message.warning('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      message.warning('Your cart is empty');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!checkoutForm.shippingAddress.street || !checkoutForm.shippingAddress.city || 
        !checkoutForm.shippingAddress.zipCode || !checkoutForm.shippingAddress.country) {
      message.error('Please fill in all required shipping address fields');
      return;
    }

    if ((checkoutForm.paymentMethod.type === 'credit_card' || checkoutForm.paymentMethod.type === 'debit_card')) {
      if (!checkoutForm.paymentMethod.cardNumber || !checkoutForm.paymentMethod.cardHolderName || 
          !checkoutForm.paymentMethod.expiryDate || !checkoutForm.paymentMethod.cvv) {
        message.error('Please fill in all card details');
        return;
      }
    }

    if (!checkoutForm.contactInfo.email) {
      message.error('Email is required');
      return;
    }

    try {
      const response = await axios.post(
        `${config.BASE_URL}/users/${userId}/checkout`,
        checkoutForm
      );
      
      if (response.status === 200) {
        const orderId = response.data?.orderId || 'N/A';
        message.success(`Order placed successfully! Order ID: ${orderId}`);
        setCart([]);
        setShowCheckoutModal(false);
        // Reset form
        setCheckoutForm({
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          paymentMethod: {
            type: 'credit_card',
            cardNumber: '',
            cardHolderName: '',
            expiryDate: '',
            cvv: ''
          },
          contactInfo: {
            email: user?.email || '',
            phone: ''
          }
        });
        // Refresh cart to show empty state
        await fetchCart();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      message.error(error.response?.data?.error || 'Failed to process checkout');
    }
  };

  const handleInputChange = (section, field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: String(value || '')
      }
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="main-container">
          <h1 className="cart-page-title">Shopping Cart</h1>
          <p className="cart-page-subtitle">Review your items before checkout</p>
        </div>
      </div>

      <div className="main-container">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button 
              className="browse-products-btn"
              onClick={() => navigate('/gear')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-header">
                <h2>Order Summary</h2>
              </div>
              <div className="summary-content">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="summary-actions">
                <button className="checkout-btn" onClick={handleCheckoutClick}>
                  Proceed to Checkout
                </button>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCheckoutModal(false)}>
              ×
            </button>
            <h2>Checkout</h2>
            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              {/* Shipping Address */}
              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={String(checkoutForm.shippingAddress?.street || '')}
                    onChange={(e) => handleNestedInputChange('shippingAddress', 'street', e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City *"
                    value={String(checkoutForm.shippingAddress?.city || '')}
                    onChange={(e) => handleNestedInputChange('shippingAddress', 'city', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={String(checkoutForm.shippingAddress?.state || '')}
                    onChange={(e) => handleNestedInputChange('shippingAddress', 'state', e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="ZIP Code *"
                    value={String(checkoutForm.shippingAddress?.zipCode || '')}
                    onChange={(e) => handleNestedInputChange('shippingAddress', 'zipCode', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country *"
                    value={String(checkoutForm.shippingAddress?.country || '')}
                    onChange={(e) => handleNestedInputChange('shippingAddress', 'country', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={String(checkoutForm.contactInfo?.email || '')}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={String(checkoutForm.contactInfo?.phone || '')}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="form-row">
                  <select
                    value={checkoutForm.paymentMethod.type}
                    onChange={(e) => handleInputChange('paymentMethod', 'type', e.target.value)}
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                </div>

                {(checkoutForm.paymentMethod.type === 'credit_card' || checkoutForm.paymentMethod.type === 'debit_card') && (
                  <>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Card Number *"
                        value={String(checkoutForm.paymentMethod?.cardNumber || '')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          handleNestedInputChange('paymentMethod', 'cardNumber', value);
                        }}
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Card Holder Name *"
                        value={String(checkoutForm.paymentMethod?.cardHolderName || '')}
                        onChange={(e) => handleNestedInputChange('paymentMethod', 'cardHolderName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="MM/YY *"
                        value={String(checkoutForm.paymentMethod?.expiryDate || '')}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          handleNestedInputChange('paymentMethod', 'expiryDate', value);
                        }}
                        maxLength="5"
                        required
                      />
                      <input
                        type="text"
                        placeholder="CVV *"
                        value={String(checkoutForm.paymentMethod?.cvv || '')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          handleNestedInputChange('paymentMethod', 'cvv', value);
                        }}
                        maxLength="3"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCheckoutModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-checkout-btn">
                  Place Order - ${calculateTotal().toFixed(2)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChatHelper />
    </div>
  );
}

export default Cart;

