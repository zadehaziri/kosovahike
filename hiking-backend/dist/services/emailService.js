"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderStatusUpdateEmail = exports.sendOrderConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email service configuration
// For production, use environment variables for email credentials
const createTransporter = () => {
    // Using Gmail as example - in production, use your own SMTP server
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
};
const sendOrderConfirmationEmail = (orderData, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        // If email is not configured, just log the email content
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email service not configured. Order confirmation email would be sent to:', email);
            console.log('Order Details:', {
                orderId: orderData.orderId,
                totalAmount: orderData.totalAmount,
                items: orderData.items,
                shippingAddress: orderData.shippingAddress
            });
            return;
        }
        const transporter = createTransporter();
        const itemsList = (orderData.items || []).map((item) => `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Confirmation - Order #${orderData.orderId}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #43815c;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${(orderData.totalAmount || 0).toFixed(2)}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Items Ordered</h3>
            <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">${itemsList}</pre>
          </div>

          <div style="margin: 20px 0;">
            <h3>Shipping Address</h3>
            <p>
              ${((_a = orderData.shippingAddress) === null || _a === void 0 ? void 0 : _a.street) || ''}<br>
              ${((_b = orderData.shippingAddress) === null || _b === void 0 ? void 0 : _b.city) || ''}, ${((_c = orderData.shippingAddress) === null || _c === void 0 ? void 0 : _c.state) || ''} ${((_d = orderData.shippingAddress) === null || _d === void 0 ? void 0 : _d.zipCode) || ''}<br>
              ${((_e = orderData.shippingAddress) === null || _e === void 0 ? void 0 : _e.country) || ''}
            </p>
          </div>

          <p style="color: #666; font-size: 14px;">
            Your order is being processed and you will receive another email when it ships.
          </p>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent to:', email);
    }
    catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
});
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
const sendOrderStatusUpdateEmail = (orderId, status, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email service not configured. Status update email would be sent to:', email);
            console.log('Order Status Update:', { orderId, status });
            return;
        }
        const transporter = createTransporter();
        const statusMessages = {
            'pending': 'Your order is pending and will be processed soon.',
            'processing': 'Your order is being processed.',
            'completed': 'Your order has been completed and shipped!',
            'cancelled': 'Your order has been cancelled.'
        };
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Order Status Update - Order #${orderId}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #43815c;">Order Status Update</h2>
          <p>Your order status has been updated.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>New Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
          </div>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log('Order status update email sent to:', email);
    }
    catch (error) {
        console.error('Error sending status update email:', error);
        throw error;
    }
});
exports.sendOrderStatusUpdateEmail = sendOrderStatusUpdateEmail;
//# sourceMappingURL=emailService.js.map