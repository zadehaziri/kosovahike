import nodemailer from 'nodemailer';

// Email service configuration
// For production, use environment variables for email credentials
const createTransporter = () => {
  // Using Gmail as example - in production, use your own SMTP server
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured');
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass.replace(/\s/g, '') // Remove spaces from app password
    }
  });
};

export const sendOrderConfirmationEmail = async (orderData: any, email: string) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    // If email is not configured, just log the email content
    if (!emailUser || !emailPass || 
        emailUser === 'your-email@gmail.com' || 
        emailPass === 'your-app-password') {
      console.log('⚠️  Email service not configured!');
      console.log('📧 Order confirmation email would be sent to:', email);
      console.log('📦 Order Details:', {
        orderId: orderData.orderId,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress
      });
      console.log('💡 To enable email, add EMAIL_USER and EMAIL_PASS to your .env file');
      console.log('📖 See EMAIL_SETUP.md for instructions');
      return;
    }

    console.log('📧 Attempting to send email to:', email);
    console.log('📤 From:', emailUser);
    
    const transporter = createTransporter();

    const itemsList = (orderData.items || []).map((item: any) => 
      `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

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
              ${orderData.shippingAddress?.street || ''}<br>
              ${orderData.shippingAddress?.city || ''}, ${orderData.shippingAddress?.state || ''} ${orderData.shippingAddress?.zipCode || ''}<br>
              ${orderData.shippingAddress?.country || ''}
            </p>
          </div>

          <p style="color: #666; font-size: 14px;">
            Your order is being processed and you will receive another email when it ships.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully to:', email);
  } catch (error: any) {
    console.error('❌ Error sending order confirmation email:', error.message);
    console.error('📋 Full error:', error);
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check your EMAIL_USER and EMAIL_PASS in .env');
      console.error('💡 Make sure you are using Gmail App Password, not your regular password');
      console.error('💡 App Password should be 16 characters without spaces');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error('🌐 Connection error. Check your internet connection and Gmail SMTP settings');
    } else if (error.message?.includes('credentials not configured')) {
      console.error('⚙️  Email credentials not found in .env file');
    }
    // Don't throw error - we don't want to fail checkout if email fails
    console.error('⚠️  Checkout will continue even though email failed');
  }
};

export const sendOrderStatusUpdateEmail = async (orderId: string, status: string, email: string) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === 'your-email@gmail.com' || 
        process.env.EMAIL_PASS === 'your-app-password') {
      console.log('⚠️  Email service not configured. Status update email would be sent to:', email);
      console.log('📦 Order Status Update:', { orderId, status });
      return;
    }

    const transporter = createTransporter();

    const statusMessages: any = {
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

    await transporter.sendMail(mailOptions);
    console.log('✅ Order status update email sent successfully to:', email);
  } catch (error: any) {
    console.error('❌ Error sending status update email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Check your EMAIL_USER and EMAIL_PASS in .env');
    }
    // Don't throw error - we don't want to fail the operation if email fails
  }
};

