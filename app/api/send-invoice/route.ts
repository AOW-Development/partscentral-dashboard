import { NextRequest, NextResponse } from "next/server";

// You'll need to install and configure an email service
// For example: npm install nodemailer
// Or use a service like Resend, SendGrid, etc.

interface InvoiceData {
  customerInfo: {
    name: string;
    email: string;
    mobile: string;
    shippingAddress: string;
    billingAddress: string;
    sellingPrice: number;
    warranty: string;
    milesPromised: number;
  };
  productInfo: {
    make: string;
    model: string;
    year: string;
    parts: string;
  };
  paymentInfo: {
    warranty: string;
    milesPromised: number;
  };
  yardInfo: {
    name: string;
    mobile: string;
    address: string;
    email: string;
    price: number;
    warranty: string;
    miles: number;
    shipping: string;
  };
  orderId: string;
  merchantMethod: string;
  merchantName: string;
  merchantAddress: string;
  merchantEmail: string;
  merchantPhone: string;
  merchantCity: string;
  merchantState: string;
}
export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();

    // Validate required data
    if (!invoiceData.customerInfo?.email) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    // Generate invoice HTML (you can use a template engine like Handlebars)
    const invoiceHTML = generateInvoiceHTML(invoiceData);

    // Send email with invoice
    const emailResult = await sendInvoiceEmail(
      invoiceData.customerInfo.email,
      invoiceHTML,
      invoiceData.orderId
    );

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Invoice sent successfully",
        orderId: invoiceData.orderId,
      });
    } else {
      throw new Error(emailResult.error);
    }
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json(
      {
        error: "Failed to send invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Generate invoice HTML
function generateInvoiceHTML(data: InvoiceData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${data.orderId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .invoice-header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 20px; }
        .customer-info, .product-info, .payment-info { margin-bottom: 20px; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <h1>INVOICE</h1>
        <p>Order ID: ${data.orderId}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${data.customerInfo.name}</p>
        <p><strong>Email:</strong> ${data.customerInfo.email}</p>
        <p><strong>Mobile:</strong> ${data.customerInfo.mobile}</p>
        <p><strong>Shipping Address:</strong> ${
          data.customerInfo.shippingAddress
        }</p>
        <p><strong>Billing Address:</strong> ${
          data.customerInfo.billingAddress
        }</p>
      </div>

      <div class="product-info">
        <h3>Product Information</h3>
        <table>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Parts</th>
          </tr>
          <tr>
            <td>${data.productInfo.make}</td>
            <td>${data.productInfo.model}</td>
            <td>${data.productInfo.year}</td>
            <td>${data.productInfo.parts}</td>
          </tr>
        </table>
      </div>

      <div class="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Selling Price:</strong> $${
          data.customerInfo.sellingPrice
        }</p>
        <p><strong>Warranty:</strong> ${data.paymentInfo.warranty}</p>
        <p><strong>Miles Promised:</strong> ${
          data.paymentInfo.milesPromised
        }</p>
      </div>

      ${
        data.yardInfo.name
          ? `
      <div class="yard-info">
        <h3>Yard Information</h3>
        <p><strong>Name:</strong> ${data.yardInfo.name}</p>
        <p><strong>Mobile:</strong> ${data.yardInfo.mobile}</p>
        <p><strong>Address:</strong> ${data.yardInfo.address}</p>
        <p><strong>Email:</strong> ${data.yardInfo.email}</p>
        <p><strong>Price:</strong> $${data.yardInfo.price}</p>
        <p><strong>Warranty:</strong> ${data.yardInfo.warranty}</p>
        <p><strong>Miles:</strong> ${data.yardInfo.miles}</p>
        <p><strong>Shipping:</strong> ${data.yardInfo.shipping}</p>
      </div>
      `
          : ""
      }

      <div class="total">
        <p><strong>Total Amount:</strong> $${data.customerInfo.sellingPrice}</p>
      </div>

      <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>Thank you for your business!</p>
        <p>This is an automated invoice generated by Parts Central Dashboard</p>
      </div>
    </body>
    </html>
  `;
}

// Send email function (you'll need to configure this with your email service)
async function sendInvoiceEmail(
  toEmail: string,
  htmlContent: string,
  orderId: string
) {
  try {
    // Example using a hypothetical email service
    // You'll need to replace this with your actual email service configuration

    // Option 1: Using Nodemailer
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Invoice - Order ${orderId}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    */

    // Option 2: Using Resend (recommended for Next.js)
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: toEmail,
      subject: `Invoice - Order ${orderId}`,
      html: htmlContent
    });

    if (error) {
      throw new Error(error.message);
    }
    */

    // For now, we'll simulate success
    // In production, replace this with actual email sending
    console.log(`Invoice email would be sent to: ${toEmail}`);
    console.log(`Order ID: ${orderId}`);

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Email sending failed",
    };
  }
}
