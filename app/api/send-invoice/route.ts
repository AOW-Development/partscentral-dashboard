import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";
import path from "path";
import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Utility function to load background image
async function loadBackgroundImage(pdfDoc: PDFDocument) {
  try {
    const backgroundPath = path.join(process.cwd(), "public", "smtpHeader.jpg");
    const backgroundBytes = fs.readFileSync(backgroundPath);
    return await pdfDoc.embedJpg(backgroundBytes);
  } catch (error) {
    console.error("Error loading background image:", error);
    return null;
  }
}

// Utility function to load logo
async function loadLogo(pdfDoc: PDFDocument) {
  try {
    const logoPath = path.resolve("./public/header-3.png");
    const logoImageBytes = fs.readFileSync(logoPath);
    return await pdfDoc.embedPng(logoImageBytes);
  } catch (error) {
    console.error("Error loading logo:", error);
    return null;
  }
}

interface InvoiceData {
  customerInfo: {
    name: string;
    email: string;
    mobile: string;
    alternateMobile: string;
    shippingAddress: string;
    billingAddress: string;
    shippingAddressType: string;
    company: string;
    partPrice: number;
    taxesPrice: number;
    handlingPrice: number;
    processingPrice: number;
    corePrice: number;
    totalSellingPrice: number;
    milesPromised: number;
    vinNumber: string;
    notes: string;
  };
  productInfo: [
    {
      make: string;
      model: string;
      year: string;
      parts: string;
      specification: string;
      warranty: string;
      saleMadeBy: string;
    }
  ];
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
    console.log("invoiceData is:", invoiceData);

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
      <h3 >Hello ${data.customerInfo.name},</h3>
      <h4 >Please find the attached invoice for the order you have placed with us.</h4>
      <h4>Kindly reply "YES" to this email as an acknowledgement, and also sign the invoice copy and send it back to us.  Please send us a Valid ID proof as well.</h4>
      <h4 >As per our tele-conversation, we will charge your card ending with (${data.paymentInfo.cardNumber.slice(
        -4
      )}) for the amount of $${
    data.customerInfo.totalSellingPrice
  }. This authorization is for a single transaction only and does not provide authorization for any additional unrelated debits or credits to your account.</h3>
      <h4 style="margin-top:36px;">Regards,</h4>
      <h4 >Parts Central LLC</h4>
      <h4 >Contact: (888) 338-2540</h4>
      <h4 >Fax#: (312) 845-9711</h4>
      </div>
    </body>
    </html>
  `;
}

async function generateInvoicePDF(data: InvoiceData) {
  const pdfDoc = await PDFDocument.create();
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // --- PAGE 1: Invoice Summary ---
  const page = pdfDoc.addPage([600, 800]);
  const { height, width } = page.getSize();
  let y = height - 40;

  // ---------------- HEADER BAR (PAGE 1) ----------------
  // Draw background image or fallback to solid color
  const backgroundImage = await loadBackgroundImage(pdfDoc);

  if (backgroundImage) {
    page.drawImage(backgroundImage, {
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
    });
  } else {
    // Fallback to solid color if image loading fails
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width,
      height: 100,
      color: rgb(0.07, 0.15, 0.3), // dark blue header
    });
  }

  // ---------------- LOGO (PAGE 1) ----------------
  try {
    const logoImage = await loadLogo(pdfDoc);
    if (logoImage) {
      const logoDims = logoImage.scale(0.5);
      page.drawImage(logoImage, {
        x: 30,
        y: height - 40,
        width: logoDims.width,
        height: logoDims.height,
      });
    } else {
      page.drawText("PARTS CENTRAL", {
        x: 40,
        y: height - 40,
        size: 18,
        font: bold,
        color: rgb(1, 1, 1),
      });
    }
  } catch (error) {
    console.error("Error loading logo:", error);
    page.drawText("PARTS CENTRAL", {
      x: 40,
      y: height - 40,
      size: 18,
      font: bold,
      color: rgb(1, 1, 1),
    });
  }

  // ---------------- CONTACT INFO (PAGE 1) ----------------
  page.drawText("Location:", {
    x: 30,
    y: height - 60,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("76 Imperial Dr Suite E Evanston, WY 82930, USA", {
    x: 80,
    y: height - 60,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Website:", {
    x: 30,
    y: height - 75,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("https://partscentral.us", {
    x: 80,
    y: height - 75,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Phone:", {
    x: 30,
    y: height - 90,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("(888) 338-2540", {
    x: 80,
    y: height - 90,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  y = height - 120;
  // ---------------- INVOICE INFO (PAGE 1) ----------------
  page.drawText(`Invoice : PC#${data.orderId}`, {
    x: width - 150,
    y: y - 10,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  y = height - 130;
  page.drawText(`Date : ${currentDate}`, {
    x: width - 150,
    y: y - 15,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  // ---------------- ORDER BY ----------------
  y = height - 130;
  page.drawText("Order By:", {
    x: 40,
    y: y - 20,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });
  y -= 15;

  page.drawText(data.customerInfo.name || "", {
    x: 40,
    y: y - 20,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  y -= 15;

  if (data.customerInfo.email) {
    page.drawText(`Email: ${data.customerInfo.email}`, {
      x: 40,
      y: y - 20,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    y -= 15;
  }

  if (data.customerInfo.mobile) {
    page.drawText(`Mobile: ${data.customerInfo.mobile}`, {
      x: 40,
      y: y - 20,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    y -= 15;
  }
  if (data.customerInfo.alternateMobile) {
    page.drawText(`Alternate Mobile: ${data.customerInfo.alternateMobile}`, {
      x: 40,
      y: y - 20,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    y -= 15;
  }

  // ---------------- BILL TO ----------------
  y = height - 130;
  page.drawText("Bill To:", {
    x: 300,
    y: y - 20,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });
  y -= 15;

  page.drawText(data.customerInfo.name || "", {
    x: 300,
    y: y - 20,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  y -= 15;

  if (data.customerInfo.billingAddress) {
    page.drawText(data.customerInfo.billingAddress, {
      x: 300,
      y: y - 20,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    y -= 15;
  }

  // ---------------- TABLE HEADER ----------------
  y -= 50;
  page.drawRectangle({
    x: 40,
    y: y - 20,
    width: width - 80,
    height: 20,
    color: rgb(0.9, 0.9, 0.95),
  });

  page.drawText("ITEM DESCRIPTION", { x: 50, y: y - 15, size: 10, font: bold });
  page.drawText("PRICE", { x: 250, y: y - 15, size: 10, font: bold });
  page.drawText("QTY", { x: 400, y: y - 15, size: 10, font: bold });
  // page.drawText("WARRANTY", { x: 400, y: y - 15, size: 10, font: bold });
  page.drawText("TOTAL", { x: 500, y: y - 15, size: 10, font: bold });

  // ---------------- TABLE ROWS ----------------
  y -= 40;
  // Add product row
  if (data.productInfo) {
    for (const product of data.productInfo) {
      const productDescription = `${product.year || ""} ${product.make || ""} ${product.model || ""} ${product.parts || ""}
      ${product.specification || ""}`;
      page.drawText(productDescription, {
        x: 50,
        y: y + 5,
        size: 10,
        font: times,
      });

      // y -= 15;
    }
  }
  if (data.customerInfo.vinNumber) {
    let yAxis = y - 15;
    page.drawText(`VIN#: ${data.customerInfo.vinNumber || ""}`, {
      x: 50,
      y: yAxis,
      size: 10,
      font: times,
    });
  }

  page.drawText(
    `$${data.customerInfo.partPrice || "0.00"}
(TP:$${data.customerInfo.taxesPrice || "0.00"},HP:$${
      data.customerInfo.handlingPrice || "0.00"
    },
CP:$${data.customerInfo.corePrice || "0.00"},PP:$${
      data.customerInfo.processingPrice || "0.00"
    })
    `,
    {
      x: 250,
      y: y + 5,
      size: 10,
      font: times,
    }
  );

  page.drawText("1", {
    x: 400,
    y: y + 5,
    size: 10,
    font: times,
  });

  page.drawText(`$${data.customerInfo.totalSellingPrice || "0.00"}`, {
    x: 500,
    y: y + 5,
    size: 10,
    font: times,
  });

  y -= 40;

  // ---------------- TOTAL ----------------
  y -= 25;
  page.drawRectangle({
    x: 420,
    y,
    width: 150,
    height: 30,
    color: rgb(0.9, 0.9, 0.95),
  });
  page.drawText(`TOTAL: $${data.customerInfo.totalSellingPrice || "0.00"}`, {
    x: 450,
    y: y + 10,
    size: 14,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`Notes:`, {
    x: 40,
    y: y - 10,
    size: 14,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`${data.customerInfo.notes || ""}`, {
    x: 100,
    y: y - 10,
    size: 14,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  y -= 25;
  page.drawText(
    `${
      data.paymentInfo.warranty || ""
    } Warranty. NO LABOUR. Will be Delivered in 8-9 Business Days`,
    {
      x: 40,
      y,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    }
  );

  // ---------------- FOOTER & NOTE (PAGE 1) ----------------
  y -= 80;
  page.drawText("Shipping Disclaimer:", {
    x: 40,
    y,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  y -= 20;
  page.drawText(
    'Shipment without Lift gate (forklift) at the shipping address will be charged extra as per the transporting carriers for freight parts. I authorize Parts Central LLC to charge my Debit/Credit card listed above & agree for terms & conditions upon purchases including merchandise & shipping charges by signing the invoice or replying to the email. Signatures: This contract may be signed electronically or in hard copy. If signed in hard copy, it must be printed out, signed, scanned and returned to the Email - support@partscentral.us or a valid record. Electronic signatures count as original for all purposes. By typing their names as signatures and replying to this same email typing - "Approved/ authorized", both parties agree to the terms and provisions of this agreement.',
    {
      x: 40,
      y,
      size: 9,
      font: times,
      maxWidth: 520,
      color: rgb(0, 0, 0.8),
    }
  );

  // Payment details section
  y -= 150;
  page.drawText("PAYMENT DETAILS :", {
    x: 40,
    y,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  y -= 15;
  if (data.paymentInfo.cardHolderName) {
    page.drawText(`Name: ${data.paymentInfo.cardHolderName}`, {
      x: 40,
      y,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }

  if (data.paymentInfo.cardNumber) {
    page.drawText(
      `Method: **** **** **** ${data.paymentInfo.cardNumber.slice(-4)}`,
      {
        x: 40,
        y: y - 15,
        size: 10,
        font: times,
        color: rgb(0, 0, 0.8),
      }
    );
  }
  // shipping details section
  page.drawText("Shipping DETAILS :", {
    x: 300,
    y: y + 15,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`(${data.customerInfo.shippingAddressType})`, {
    x: 410,
    y: y + 15,
    size: 10,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  y -= 15;
  if (data.customerInfo.company) {
    page.drawText(`company name: ${data.customerInfo.company}`, {
      x: 410,
      y: y + 10,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }
  if (data.customerInfo.shippingAddress) {
    page.drawText(` ${data.customerInfo.shippingAddress}`, {
      x: 410,
      y: y - 5,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }

  if (data.customerInfo.shippingAddressType == "Terminal") {
    page.drawText("Shipping to nearest terminal", {
      x: 410,
      y: y - 15,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }

  page.drawText("Authorize Signature", {
    x: 450,
    y: y - 150,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  // --- PAGE 2: Full Disclaimer & Policies ---
  const page2 = pdfDoc.addPage([600, 800]);
  const { height: page2Height } = page2.getSize();
  let y2 = page2Height - 40;

  // ---------------- HEADER BAR (PAGE 2) ----------------
  const backgroundImage2 = await loadBackgroundImage(pdfDoc);

  if (backgroundImage2) {
    page2.drawImage(backgroundImage2, {
      x: 0,
      y: page2Height - 100,
      width: width,
      height: 100,
    });
  } else {
    // Fallback to solid color if image loading fails
    page2.drawRectangle({
      x: 0,
      y: page2Height - 100,
      width,
      height: 100,
      color: rgb(0.07, 0.15, 0.3), // dark blue header
    });
  }

  // ---------------- LOGO (PAGE 2) ----------------
  try {
    const logoImage = await loadLogo(pdfDoc);
    if (logoImage) {
      const logoDims = logoImage.scale(0.5);
      page2.drawImage(logoImage, {
        x: 30,
        y: page2Height - 40,
        width: logoDims.width,
        height: logoDims.height,
      });
    } else {
      page2.drawText("PARTS CENTRAL", {
        x: 40,
        y: page2Height - 40,
        size: 18,
        font: bold,
        color: rgb(1, 1, 1),
      });
    }
  } catch (error) {
    console.error("Error loading logo:", error);
    page2.drawText("PARTS CENTRAL", {
      x: 40,
      y: page2Height - 40,
      size: 18,
      font: bold,
      color: rgb(1, 1, 1),
    });
  }

  // ---------------- CONTACT INFO (PAGE 2) ----------------

  page2.drawText("Location:", {
    x: 30,
    y: page2Height - 60,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page2.drawText("76 Imperial Dr Suite E Evanston, WY 82930, USA", {
    x: 80,
    y: page2Height - 60,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });

  page2.drawText("Website:", {
    x: 30,
    y: page2Height - 75,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page2.drawText("https://partscentral.us", {
    x: 80,
    y: page2Height - 75,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });

  page2.drawText("Phone:", {
    x: 30,
    y: page2Height - 90,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page2.drawText("(888) 338-2540", {
    x: 80,
    y: page2Height - 90,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });

  // ---------------- DISCLAIMER SECTIONS (PAGE 2) ----------------
  y2 -= 100;

  // Disclaimer Engine
  page2.drawText("Disclaimer Engine:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "Engines are sold as an assemblies with manifolds, timing cover, belts, oil pan, fuel injectors or carburetors, pulleys and other accessories. Due to warranty only on the long block, all accessories like manifolds, timing cover, belts, oil pan, fuel injectors or carburetors, pulleys, and other accessories are sold as is (NO WARRANTY APPLICABLE).",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

  y2 -= 80;

  // Disclaimer Transmission
  page2.drawText("Disclaimer Transmission:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "The transmission is guaranteed to shift gears and bearings to be good. The oil pan and oil filter needs to be replaced before installation. Flush out all the liquid and from test cooler lines. The torque convertor needs to be fully engaged to the front pump. For manual transmission a new clutch needs to be installed along with the pressure plate and slave cylinder. The flywheel must be turned once before installation.",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

  y2 -= 80;

  // Installation
  page2.drawText("Installation:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "Part needs to be installed within 10 days from the date of delivery.",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

  y2 -= 50;

  // Cancellation
  page2.drawText("Cancellation:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "After placing an order, if the customer wants-to cancel the order, he/she should do so within 24 hours and a charge of 30% restocking fee and one-way shipping cost will be deducted from the paid amount. Any Cancellations of orders should be validated via E-mail and Call to customer service is mandatory.",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

  y2 -= 80;

  // Return Policy
  page2.drawText("Return Policy:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "If in case of damaged or defective returns will be accepted within 10 calendar days from the date of delivery for mechanical parts and 7 calendar days for body parts. Parts ordered for testing or trial purposes will not be available for return. If the customer received the part and if it is damaged, defective or if the shipping is delayed, the customer has to contact Parts Central LLC before disputing the charges.",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

  y2 -= 80;

  // Refund Policy
  page2.drawText("Refund Policy:", {
    x: 40,
    y: y2,
    size: 12,
    font: bold,
    color: rgb(1, 0, 0),
  });

  y2 -= 15;
  page2.drawText(
    "Parts must be returned within 7 business days from the date of delivery for a full refund. However, shipping & handling is non-refundable. Return shipping charges must be covered at the customer's expense. Customers have to provide a registered/certified mechanic's detailed report to prove the same for mechanical parts, which shall be investigated further before processing a refund. Once the part is returned, we will be happy to send a replacement or issue a refund within 5-7 business days.",
    {
      x: 40,
      y: y2,
      size: 9,
      font: times,
      maxWidth: 520,
    }
  );

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

    // const transporter = nodeMailer.createTransport({
    //   service: "gmail", // or your email service
    //   auth: {
    //     user: "leadspartscentral.us@gmail.com",
    //     // user: "support@partscentral.us",
    //     // pass: "Autoparts@2025!$",
    //     pass: "ftzc nrta ufnx sudz",
    //   },
    // });
    const transporter = nodeMailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: "support@partscentral.us", // full email
        pass: "hbcwjmyhqblyddvf",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      // from: "leadspartscentral.us@gmail.com",
      from: "support@partscentral.us",
      to: toEmail,
      subject: `Invoice for Order - PC#${orderId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `invoice-PC#${orderId}.pdf`,
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
