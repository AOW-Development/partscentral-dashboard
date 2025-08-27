import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";
// import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
// import { BufferStream } from "pdf-lib";

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

    // Generate invoice HTML and PDF
    const invoiceHTML = generateInvoiceHTML(invoiceData);
    const pdfContent = await generateInvoicePDF(invoiceData);

    // Send email with invoice and PDF attachment
    const emailResult = await sendInvoiceEmail(
      invoiceData.customerInfo.email,
      invoiceHTML,
      invoiceData.orderId,
      pdfContent
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
    </head>
    <body>
      <div>
      <h3 >Hello,${data.customerInfo.name}</h3>
      <p >Please find the attached invoice for the order you have placed with us.</p>
      <p>Kindly reply "YES" to this email as an acknowledgement, and also sign the invoice copy and send it back to us.  Please send us a Valid ID proof as well.</p>
      <p >As per our tele-conversation, we will charge your card ending with (${data.paymentInfo.cardNumber.slice(
        -4
      )}) for the amount of $${
    data.customerInfo.totalSellingPrice
  }. This authorization is for a single transaction only and does not provide authorization for any additional unrelated debits or credits to your account.</p>
      <p style="margin-top:36px;">Regards,</p>
      <p >Parts Central LLC</p>
      <p >Contact: (888) 338-2540</p>
      <p >Fax#: (312) 845-9711</p>
      </div>
    </body>
    </html>
  `;
}

async function generateInvoicePDF(data: InvoiceData) {
  const pdfDoc = await PDFDocument.create();

  // Embed the Times Roman font
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Add a blank page to the document
  const page = pdfDoc.addPage();

  // Get the width and height of the page
  const { height } = page.getSize();

  // Draw invoice content
  const fontSize = 12;
  let y = height - 50;

  // Add invoice header
  page.drawText(`INVOICE #${data.orderId}`, {
    x: 50,
    y: y,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });
  y -= 30;

  // Add customer info
  page.drawText(`Customer Name: ${data.customerInfo.name}`, {
    x: 50,
    y: y,
    size: fontSize,
    font: timesRomanFont,
  });
  y -= 20;

  // Add order details
  page.drawText(`Order Total: $${data.customerInfo.totalSellingPrice}`, {
    x: 50,
    y: y,
    size: fontSize,
    font: timesRomanFont,
  });
  y -= 20;

  // Add warranty info if available
  if (data.customerInfo.email) {
    page.drawText(`Email: ${data.customerInfo.email}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.customerInfo.mobile) {
    page.drawText(`Mobile: ${data.customerInfo.mobile}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.customerInfo.shippingAddress) {
    page.drawText(`Shipping Address: ${data.customerInfo.shippingAddress}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.customerInfo.billingAddress) {
    page.drawText(`Billing Address: ${data.customerInfo.billingAddress}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.customerInfo.shippingAddressType) {
    page.drawText(
      `Shipping Address Type: ${data.customerInfo.shippingAddressType}`,
      {
        x: 50,
        y: y,
        size: fontSize,
        font: timesRomanFont,
      }
    );
    y -= 20;
  }
  if (data.paymentInfo.cardHolderName) {
    page.drawText(`Card Holder Name: ${data.paymentInfo.cardHolderName}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.paymentInfo.cardNumber) {
    page.drawText(`Card Number: ${data.paymentInfo.cardNumber.slice(-4)}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.paymentInfo.cardDate) {
    page.drawText(`Card Date: ${data.paymentInfo.cardDate}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.paymentInfo.cardCvv) {
    page.drawText(`Card CVV: ${data.paymentInfo.cardCvv}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.make) {
    page.drawText(`Make: ${data.productInfo.make}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.model) {
    page.drawText(`Model: ${data.productInfo.model}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.year) {
    page.drawText(`Year: ${data.productInfo.year}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.parts) {
    page.drawText(`Parts: ${data.productInfo.parts}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.specification) {
    page.drawText(`Specification: ${data.productInfo.specification}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }
  if (data.productInfo.saleMadeBy) {
    page.drawText(`Sale Made By: ${data.productInfo.saleMadeBy}`, {
      x: 50,
      y: y,
      size: fontSize,
      font: timesRomanFont,
    });
    y -= 20;
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Send email function (you'll need to configure this with your email service)
async function sendInvoiceEmail(
  toEmail: string,
  htmlContent: string,
  orderId: string,
  pdfContent: Uint8Array
) {
  try {
    // Example using a hypothetical email service
    // You'll need to replace this with your actual email service configuration

    // Option 1: Using Nodemailer

    const transporter = nodeMailer.createTransport({
      service: "gmail", // or your email service
      auth: {
        user: "leadspartscentral.us@gmail.com",
        pass: "ftzc nrta ufnx sudz",
      },
    });

    const mailOptions = {
      from: "leadspartscentral.us@gmail.com",
      to: toEmail,
      subject: `Invoice - Order ${orderId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          content: Buffer.from(pdfContent.buffer),
          contentType: "application/pdf",
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
    console.log(`Sending invoice email to: ${toEmail}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`PDF size: ${pdfContent.length} bytes`);

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
