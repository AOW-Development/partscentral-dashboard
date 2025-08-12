import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";
import path from "path";

interface InvoiceData {
  customerInfo: {
    name: string;
    email: string;
    mobile: string;
    shippingAddress: string;
    billingAddress: string;
    shippingAddressType: string;
    company: string;
    totalSellingPrice: number;
    warranty: string;
    milesPromised: number;
  };
  productInfo: {
    make: string;
    model: string;
    year: string;
    parts: string;
    specification: string;
    saleMadeBy: string;
  };
  paymentInfo: {
    cardHolderName: string;
    cardNumber: string;
    cardDate: string;
    cardCvv: string;
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

    // Generate invoice HTML (CID image will be attached via email)
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
        body { font-family: Arial, sans-serif; margin: 0; }
        .invoice-header {font-size: 30px; text-align: center; margin-bottom: 30px; }
        .invoice-details {font-size: 40px; margin-bottom: 20px; }
        .customer-info, .payment-info {font-size: 40px; margin-bottom: 20px; }
        .product-info {font-size: 40px; margin-bottom: 20px; }
        .total { font-size: 40px; font-weight: bold; margin-top: 20px; }
        table {font-size: 25px; width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { font-size: 25px;padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { font-size: 25px;background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div style="width:100vh;padding:60px 15px;background:#091627;border-bottom:2px solid #e5e5e5;text-align:left;margin-bottom:24px;margin-left:0px">
        <img src="cid:invoice-logo" alt="Parts Central" style="height:60px;display:inline-block;" />
      </div>
      <div class="invoice-header">
        <h1>INVOICE</h1>
        <p>Order ID: ${data.orderId}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div>
        <h3 style="font-size: 40px;">Customer Information</h3>
        <p style="font-size: 30px;"><strong>Name:</strong> ${
          data.customerInfo.name
        }</p>
        <p style="font-size: 30px;"><strong>Email:</strong> ${
          data.customerInfo.email
        }</p>
        <p style="font-size: 30px;"><strong>Mobile:</strong> ${
          data.customerInfo.mobile
        }</p>
         <p style="font-size: 30px;"><strong>shipping Address Type:</strong> ${
           data.customerInfo.shippingAddressType
         }</p>
        <p style="font-size: 30px;"><strong>Company:</strong> ${
          data.customerInfo.company
        }</p>
        <p style="font-size: 30px;"><strong>Shipping Address:</strong> ${
          data.customerInfo.shippingAddress
        }</p>
        <p style="font-size: 30px;"><strong>Billing Address:</strong> ${
          data.customerInfo.billingAddress
        }</p>
      </div>

      <div class="product-info">
        <h3 style="font-size: 40px;">Product Information</h3>
        <table>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Parts</th>
            <th>Specification</th>
            <th>Sale Made By</th>
          </tr>
          <tr>
            <td>${data.productInfo.make}</td>
            <td>${data.productInfo.model}</td>
            <td>${data.productInfo.year}</td>
            <td>${data.productInfo.parts}</td>
            <td>${data.productInfo.specification}</td>
            <td>${data.productInfo.saleMadeBy}</td>
          </tr>
        </table>
      </div>

      <div>
        <h3 style="font-size: 40px;">Payment Information</h3>
        <p style="font-size: 30px;"><strong>Selling Price:</strong> $${
          data.customerInfo.totalSellingPrice
        }</p>
        <p style="font-size: 30px;"><strong>Card Holder Name:</strong> ${
          data.paymentInfo.cardHolderName
        }</p>
        <p style="font-size: 30px;"><strong>Card Number:</strong> **** **** **** ${data.paymentInfo.cardNumber.slice(
          15,
          19
        )}</p>
        <p style="font-size: 30px;"><strong>Expire Date:</strong> ${
          data.paymentInfo.cardDate
        }</p>
        <p style="font-size: 30px;"><strong>CVV:</strong> ${
          data.paymentInfo.cardCvv
        }</p>
        <p style="font-size: 30px;"><strong>Warranty:</strong> ${
          data.paymentInfo.warranty
        }</p>
        
      </div>
      <div class="total">
        <p><strong>Total Amount:</strong> $${
          data.customerInfo.totalSellingPrice
        }</p>
      </div>
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;color:#222;font-size: 30px;line-height:1.6;">
        <h2 style="font-size:40px;margin:0 0 12px 0;">Why choose Parts Central?</h2>
        <ul style="margin:0 0 16px 20px;padding:0;">
          <li>Friendly customer support available to assist you.</li>
          <li>Wide selection of quality used OEM parts available in all over USA.</li>
          <li>Fast shipping within 8-9 business days.</li>
          <li>Buy Now &amp; Pay Later options available.</li>
        </ul>

        <p style="text-align:center;font-weight:600;font-size:40px;margin:24px 0;">
          We look forward to hearing from you soon!
        </p>

        <div style="margin-top:16px;">
          <p style="margin:0 0 6px 0;font-weight:600;font-size: 40px;">Best regards,</p>
          <p style="margin:0;">Parts Central LLC</p>
          <p style="margin:0;">76 Imperial Dr Suite E Evanston, WY 82930, USA</p>
          <p style="margin:0;">Phone: +1 (888) 338-2540</p>
        </div>
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

    const transporter = nodeMailer.createTransport({
      service: "gmail", // or your email service
      auth: {
        user: "shankarreddyshiva83@gmail.com",
        pass: "njhr auka tqbd oxva",
      },
    });

    const mailOptions = {
      from: "shankarreddyshiva83@gmail.com",
      to: toEmail,
      subject: `Invoice - Order ${orderId}`,
      html: htmlContent,
      attachments: [
        {
          filename: "header-3.png",
          path: path.join(process.cwd(), "public", "header-3.png"),
          cid: "invoice-logo",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

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
