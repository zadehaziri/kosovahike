"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Order = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const OrderModel = mongoose_1.default.model('Order', Order);
exports.default = OrderModel;
//# sourceMappingURL=Order.js.map