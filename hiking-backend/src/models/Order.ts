import mongoose from 'mongoose';

const Order = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  shippingAddress: {
    street: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zipCode: { type: String, default: null },
    country: { type: String, default: null }
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      default: null
    },
    cardNumber: { type: String, default: null },
    cardHolderName: { type: String, default: null },
    expiryDate: { type: String, default: null },
    cvv: { type: String, default: null }
  },
  contactInfo: {
    email: { type: String, default: null },
    phone: { type: String, default: null }
  }
});

const OrderModel = mongoose.model('Order', Order);

export default OrderModel;

