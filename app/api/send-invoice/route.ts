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
  const page = pdfDoc.addPage([600, 850]);
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
  const margin1 = 36;

  // ---------------- CONTACT INFO (PAGE 1) ----------------
  
  // Resolve path to public folder
  const locationBytes1 = fs.readFileSync(path.join(process.cwd(), "public", "location.png"));
  const websiteBytes1  = fs.readFileSync(path.join(process.cwd(), "public", "website.png"));
  const phoneBytes1    = fs.readFileSync(path.join(process.cwd(), "public", "phone.png"));
  // const emailBytes    = fs.readFileSync(path.join(process.cwd(), "public", "email.png"));
  // const taxBytes      = fs.readFileSync(path.join(process.cwd(), "public", "sales.png"));
  
  const locationIcon1 = await pdfDoc.embedPng(locationBytes1);
  const websiteIcon1  = await pdfDoc.embedPng(websiteBytes1);
  const phoneIcon1  = await pdfDoc.embedPng(phoneBytes1);
  // const emailIcon    = await pdfDoc.embedPng(emailBytes);
  // const taxIcon      = await pdfDoc.embedPng(taxBytes);
  
  // --- Now draw them with labels + values ---
  const iconSize1 = 10;   // icon width/height
  y = height - 50;   // starting Y for first row
  
  const infoRows1 = [
    { icon: locationIcon1, label: "Location:", value: "76 Imperial Dr Suite E Evanston, WY 82930, USA" },
    { icon: websiteIcon1,  label: "Website:",  value: "https://partscentral.us" },
    { icon: phoneIcon1,    label: "Phone:",    value: "(888) 338-2540" },
    // { icon: emailIcon,    label: "Email:",    value: "purchase@partscentral.us" },
    // { icon: taxIcon,      label: "Sales Tax ID:", value: "271-4444-3598" },
  ];
  
  
  for (const row of infoRows1) {
    // Draw icon
    page.drawImage(row.icon, {
      x: margin1,
      y: y - 2, // tweak for vertical alignment
      width: iconSize1,
      height: iconSize1,
    });
  
    // Draw label
    page.drawText(row.label, {
      x: margin1 + iconSize1 + 4,
      y,
      size: 10,
      font: bold,
      color: rgb(1, 1, 1),
    });
  
    // Draw value
    page.drawText(row.value, {
      x: margin1 + 70, // align values nicely
      y,
      size: 10,
      font: times,
      color: rgb(1, 1, 1),
    });
  
    y -= 20; // move down for next row
  }

  y = height - 110;
  // ---------------- INVOICE INFO (PAGE 1) ----------------
  page.drawText(`Invoice : PC#${data.orderId}`, {
    x: width - 180,
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
    x: width - 180,
    y: y - 10,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  // ---------------- ORDER BY ----------------
y = height - 100;
// Function to draw the content for the "Order By" and "Bill to" sections
function drawCustomerInfo(page: any, y: number, data: any, bold: any, times: any, rgb: any) {
  // ---------------- ORDER BY ----------------
  const orderX = 40;
  let orderY = y - 15;
  const startY = y;
  const lineHeight = 18; // more spacing between lines for clarity

  page.drawText(`Order By: ${data.customerInfo.name || ""}`, {
    x: orderX,
    y: orderY,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  orderY -= lineHeight;

  if (data.customerInfo.email) {
    page.drawText(`Email: ${data.customerInfo.email}`, {
      x: orderX,
      y: orderY,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    orderY -= lineHeight;
  }

  if (data.customerInfo.mobile) {
    page.drawText(`Mobile: ${data.customerInfo.mobile}`, {
      x: orderX,
      y: orderY,
      size: 11,
      font: times,
      color: rgb(0, 0, 0.8),
    });
    orderY -= lineHeight;
  }

  if (data.customerInfo.alternateMobile) {
    page.drawText(`Alternate Mobile: ${data.customerInfo.alternateMobile}`, {
      x: orderX,
      y: orderY,
      size: 11,
      font: times,
      color: rgb(0.07, 0.15, 0.3),
    });
    orderY -= lineHeight;
  }

  const endY = orderY;

  // ---------------- VERTICAL SEPARATOR ----------------
  const lineX = 270; // moved left (was 300) to better center
  const lineTopY = startY + 10; // extend slightly above "Order By"
  const lineBottomY = endY - 5; // extend slightly below last line

  page.drawLine({
    start: { x: lineX, y: lineTopY },
    end: { x: lineX, y: lineBottomY },
    color: rgb(0.07, 0.15, 0.3),
    thickness: 2,
  });

  // ---------------- BILL TO ----------------
  const billX = lineX + 40; // keeps some margin after the line
  let billY = y - 15;

  page.drawText("Bill to", {
    x: billX,
    y: billY,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });
  billY -= 20;

  page.drawText(`Name : ${data.customerInfo.name || ""}`, {
    x: billX,
    y: billY,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  billY -= lineHeight;

if (data.customerInfo.billingAddress) {
  const label = "Address :";
  const address = data.customerInfo.billingAddress;
  const fontSize = 11;
  const lineHeight = fontSize + 4;
  const maxWidth = 250; // Total width available for the entire address block

  // Draw the label
  page.drawText(label, {
    x: billX,
    y: billY,
    size: fontSize,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  // Calculate the width of the label to determine the start position of the address text
  const labelWidth = times.widthOfTextAtSize(label + " ", fontSize);
  const startX = billX + labelWidth;

  // Split the address into lines, starting from the first line after the label
  const addressWords = address.split(" ");
  let currentLine = "";
  let addressLines = [];

  // Handle the first line, which has a reduced width due to the label
  for (const word of addressWords) {
    const testLine = currentLine.length > 0 ? currentLine + " " + word : word;
    let testWidth;
    if (addressLines.length === 0) {
      // For the first line, check against the remaining width
      testWidth = times.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > (maxWidth - labelWidth)) {
        addressLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    } else {
      // For subsequent lines, use the full maxWidth
      testWidth = times.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth) {
        addressLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
  }
  if (currentLine) addressLines.push(currentLine);

  // Draw the first line of the address next to the label
  if (addressLines.length > 0) {
    page.drawText(addressLines[0], {
      x: startX,
      y: billY,
      size: fontSize,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }

  // Draw any subsequent wrapped lines below the first line
  addressLines.slice(1).forEach((line, i) => {
    page.drawText(line, {
      x: billX,
      y: billY - ((i + 1) * lineHeight),
      size: fontSize,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  });
}

}

// Example usage in your main code block
y = height - 150; // Set a starting Y position for this section
drawCustomerInfo(page, y, data, bold, times, rgb);

  // ---------------- TABLE HEADER ----------------




// Start of your main invoice content block
// A helper function to split a string into an array of lines based on a maximum width.
const getWrappedText = (text: string, maxWidth: number, font: any, size: number): string[] => {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

// Start of your main invoice content block
y = height - 180; 
y -= 70;

const headerY = y - 10;

page.drawRectangle({
  x: 40,
  y: headerY,
  width: width - 80,
  height: 20,
  color: rgb(0.07, 0.15, 0.3),
});

page.drawText("ITEM DESCRIPTION", { x: 50, y: headerY + 5, size: 10, font: bold, color: rgb(1, 1, 1) });
page.drawText("PRICE", { x: 250, y: headerY + 5, size: 10, font: bold, color: rgb(1, 1, 1) });
page.drawText("QTY.", { x: 400, y: headerY + 5, size: 10, font: bold, color: rgb(1, 1, 1) });
page.drawText("TOTAL", { x: 500, y: headerY + 5, size: 10, font: bold, color: rgb(1, 1, 1) });

y -= 25; // Initial space after header

if (data.productInfo && data.productInfo.length > 0) {
  for (const product of data.productInfo) {
    const startY = y;
    
    // Define the width for the Item Description column
    const itemDescriptionWidth = 180;
    const lineHeight = 15;
    const verticalPadding = 10;
    
    // Create the lines of text to be drawn
    const lines = [];
    const mainDescription = `${product.year || ""} ${product.make || ""} ${product.model || ""} ${product.parts || ""}`;
    lines.push(mainDescription);

    if (product.specification) {
      // Use the getWrappedText helper function to handle long specifications
      const wrappedSpecLines = getWrappedText(product.specification, itemDescriptionWidth, times, 10);
      lines.push(...wrappedSpecLines);
    }
    
    // The VIN number should also be handled carefully to avoid overflow
    if (data.customerInfo.vinNumber) {
        const vinText = `VIN Number: ${data.customerInfo.vinNumber || "17 Alpha Digits"}`;
        const wrappedVinLines = getWrappedText(vinText, itemDescriptionWidth, times, 10);
        lines.push(...wrappedVinLines);
    }
    
    const numLines = lines.length;

    // --- Dynamic Height with Padding ---
   // --- Dynamic Height with Padding ---
const productDescriptionHeight = (numLines * lineHeight) + (verticalPadding * 2);
const rowY = startY - productDescriptionHeight;

// Draw gray background for the product row
page.drawRectangle({
  x: 40,
  y: rowY,
  width: width - 80,
  height: productDescriptionHeight,
  color: rgb(0.9, 0.9, 0.9),
});

// ✅ Draw each line starting after equal top padding
let currentDescriptionY = startY - verticalPadding - lineHeight;

for (const line of lines) {
  page.drawText(line, {
    x: 50,
    y: currentDescriptionY,
    size: 10,
    font: times,
    color: rgb(0.07, 0.15, 0.3),
  });
  currentDescriptionY -= lineHeight;
}

    // --- Price, QTY, and Total Alignment ---
    const centerY = rowY + (productDescriptionHeight / 2);

    const numericPrice = +data.customerInfo.partPrice;
    const formattedPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : "0.00";
    
    const numericTotal = +data.customerInfo.totalSellingPrice;
    const formattedTotal = !isNaN(numericTotal) ? numericTotal.toFixed(2) : "0.00";

    const priceHeaderX = 250;
    const qtyHeaderX = 400;
    const totalHeaderX = 500;

    page.drawText(`$${formattedPrice}`, {
      x: priceHeaderX,
      y: centerY - 5,
      size: 10,
      font: times,
      color: rgb(0.07, 0.15, 0.3),
    });

    page.drawText("1", {
      x: qtyHeaderX,
      y: centerY - 5,
      size: 10,
      font: times,
      color: rgb(0.07, 0.15, 0.3),
    });

    page.drawText(`$${formattedTotal}`, {
      x: totalHeaderX,
      y: centerY - 5,
      size: 10,
      font: times,
      color: rgb(0.07, 0.15, 0.3),
    });
    
    y = rowY - 10;
  }
}

// // Notes section with VIN number
// y -= 15;
// const notesY = y;
// const notesHeight = 30;
// page.drawRectangle({
//   x: 40,
//   y: notesY - notesHeight,
//   width: width - 80,
//   height: notesHeight,
//   color: rgb(0.9, 0.9, 0.9), // Light gray color
// });

// const notesText = `Notes : ${data.customerInfo.vinNumber ? `VIN Number: ${data.customerInfo.vinNumber || "17 Alpha Digits"}` : "No Notes"}`;
// page.drawText(notesText, {
//   x: 50,
//   y: notesY - 15,
//   size: 10,
//   font: times,
//   color: rgb(0.07, 0.15, 0.3),
// });

// y = notesY - notesHeight - 15; // Spacing before the fee section

// ---------------- FEES ----------------
// A helper function to get the text width
const textWidth = (text: string, size: number, font: any): number => font.widthOfTextAtSize(text, size);

const numericTotal = +data.customerInfo.totalSellingPrice;
    const formattedTotal = !isNaN(numericTotal) ? numericTotal.toFixed(2) : "0.00";


y -= 20;
const feesY = y;
const feeColor = rgb(0.07, 0.15, 0.3);

// --- Dynamically calculate horizontal spacing for fees ---
const padding = 20; // Consistent padding between fee blocks
// Move the starting X position to the right
let currentX = 160; 

// Core
const coreText = `Core: $${data.customerInfo.corePrice || "0.00"}`;
page.drawText(coreText, {
  x: currentX,
  y: feesY,
  size: 10,
  font: bold,
  color: feeColor,
});
currentX += textWidth(coreText, 10, bold) + padding;

// Tax
const taxText = `Tax: $${data.customerInfo.taxesPrice || "0.00"}`;
page.drawText(`|`, { x: currentX, y: feesY, size: 10, font: bold, color: feeColor });
currentX += 10; // Space for the separator
page.drawText(taxText, {
  x: currentX,
  y: feesY,
  size: 10,
  font: bold,
  color: feeColor,
});
currentX += textWidth(taxText, 10, bold) + padding;

// Handling Fee
const handlingText = `Handling Fee: $${data.customerInfo.handlingPrice || "0.00"}`;
page.drawText(`|`, { x: currentX, y: feesY, size: 10, font: bold, color: feeColor });
currentX += 10;
page.drawText(handlingText, {
  x: currentX,
  y: feesY,
  size: 10,
  font: bold,
  color: feeColor,
});
currentX += textWidth(handlingText, 10, bold) + padding;

// Processing Fee
const processingText = `Processing Fee: $${data.customerInfo.processingPrice || "0.00"}`;
page.drawText(`|`, { x: currentX, y: feesY, size: 10, font: bold, color: feeColor });
currentX += 10;
page.drawText(processingText, {
  x: currentX,
  y: feesY,
  size: 10,
  font: bold,
  color: feeColor,
});

// --- Dynamically size the TOTAL box and place it below fees ---
const totalText = `TOTAL: $${formattedTotal || "0.00"}`;
const totalTextWidth = textWidth(totalText, 12, bold);
const totalBoxPadding = 20;
const totalBoxWidth = totalTextWidth + totalBoxPadding;

// Position the total box below the fees
const totalBoxY = feesY - 40; 
// Align the total box to the right side of the page
const totalBoxX = width - 40 - totalBoxWidth; 
const totalBoxHeight = 30;

// Draw the TOTAL box
page.drawRectangle({
  x: totalBoxX,
  y: totalBoxY,
  width: totalBoxWidth,
  height: totalBoxHeight,
  color: rgb(0.07, 0.15, 0.3),
});

// Draw TOTAL text centered vertically and horizontally within the box
const textY = totalBoxY + (totalBoxHeight / 2) - (12 / 2);
const textX = totalBoxX + (totalBoxWidth / 2) - (totalTextWidth / 2);
page.drawText(totalText, {
  x: textX,
  y: textY,
  size: 12,
  font: bold,
  color: rgb(1, 1, 1),
});

// Update y for next section
y = totalBoxY - 20;

// Notes section with rectangle
y -= 0;
const notesY = y;
const notesHeight = 40; // increased to fit Notes + Warranty
page.drawRectangle({
  x: 40,
  y: notesY - notesHeight,
  width: width - 80,
  height: notesHeight,
  color: rgb(0.9, 0.9, 0.9), // Light gray color
});

// Notes text
const notesText = `Notes: ${data.customerInfo.notes || "No Notes"}`;
page.drawText(notesText, {
  x: 50,
  y: notesY - 15,
  size: 10,
  font: times,
  color: rgb(0.07, 0.15, 0.3),
});

// Warranty text (inside same block, below notes)
const warrantyText = `${data.paymentInfo.warranty || ""} Warranty. NO LABOUR. Will be Delivered in 8-9 Business Days`;
page.drawText(warrantyText, {
  x: 50,
  y: notesY - 30, // slightly below Notes
  size: 10,
  font: times,
  color: rgb(0.07, 0.15, 0.3),
});

// Move Y down for next section after gray block
y = notesY - notesHeight - 15;

// ---------------- NOTE BLOCK ----------------
page.drawText("Shipping Disclaimer:", {
    x: 40,
    y: y - 10,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
});

y -= 30;
const noteText = 'Shipment without Lift gate (forklift) at the shipping address will be charged extra as per the transporting carriers for freight parts. I authorize Parts Central LLC to charge my Debit/Credit card listed above & agree for terms & conditions upon purchases including merchandise & shipping charges by signing the invoice or replying to the email. Signatures: This contract may be signed electronically or in hard copy. If signed in hard copy, it must be printed out, signed, scanned and returned to the Email - support@partscentral.us or a valid record. Electronic signatures count as original for all purposes. By typing their names as signatures and replying to this same email typing - "Approved/ authorized", both parties agree to the terms and provisions of this agreement. ' +
    ` ${data.paymentInfo.warranty || ""} Warranty. NO LABOUR. Will be Delivered in 8-9 Business Days.`;

y = drawWrappedText(page, noteText, 40, y, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
    color: rgb(0, 0, 0.8),
});

y -= 30;

// ---------------- PAYMENT AND SHIPPING DETAILS ----------------
// Payment details section
const paymentY = y;
page.drawText("PAYMENT DETAILS :", {
    x: 40,
    y: paymentY,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
});

let paymentContentY = paymentY - 15;
if (data.paymentInfo.cardHolderName) {
    page.drawText(`Name: ${data.paymentInfo.cardHolderName}`, {
        x: 40,
        y: paymentContentY,
        size: 10,
        font: times,
        color: rgb(0, 0, 0.8),
    });
}

if (data.paymentInfo.cardNumber) {
    page.drawText(`Payment Mode: Card: **** **** **** ${data.paymentInfo.cardNumber.slice(-4)}`, {
        x: 40,
        y: paymentContentY - 15,
        size: 10,
        font: times,
        color: rgb(0, 0, 0.8),
    });
}

// Shipping details section
const shippingX = 380; // shifted right from 300
const shippingY = y;
let shippingContentY = shippingY - 15;

page.drawText("Shipping Address:", {
  x: shippingX,
  y: shippingY,
  size: 11,
  font: bold,
  color: rgb(0, 0, 0.8),
});

if (data.customerInfo.shippingAddressType !== "Residential") {
  page.drawText(`(${data.customerInfo.shippingAddressType})`, {
    x: shippingX + 110, // keep same relative spacing as before
    y: shippingY,
    size: 10,
    font: times,
    color: rgb(0, 0, 0.8),
  });
}

if (
  data.customerInfo.shippingAddressType === "Commercial" &&
  data.customerInfo.company
) {
  page.drawText(`Company Name: ${data.customerInfo.company}`, {
    x: shippingX,
    y: shippingContentY,
    size: 10,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  shippingContentY -= 15;
}

if (data.customerInfo.shippingAddressType === "Terminal") {
  page.drawText("Shipping to nearest terminal", {
    x: shippingX,
    y: shippingContentY,
    size: 10,
    font: times,
    color: rgb(0, 0, 0.8),
  });
  shippingContentY -= 15;
}

if (data.customerInfo.shippingAddress) {
  const shippingAddress = data.customerInfo.shippingAddress;
  const maxWidth = 150; // adjust width for wrapping
  const fontSize = 10;

  function splitTextIntoLines(text: string, font: any, fontSize: number, maxWidth: number) {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  const addressLines = splitTextIntoLines(shippingAddress, times, fontSize, maxWidth);

  addressLines.forEach((line, i) => {
    page.drawText(line, {
      x: shippingX,
      y: shippingContentY - (i * (fontSize + 4)), // move down line by line
      size: fontSize,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  });

  // update Y if you need to continue drawing below the address
  shippingContentY -= addressLines.length * (fontSize + 4);
}


// Authorize Signature
page.drawText("Authorize Signature", {
    x: 450,
    y: y - 100,
    size: 11,
    font: bold,
    color: rgb(0, 0, 0.8),
});
      
  if (backgroundImage) {
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: width,
      height: 100,
    });
  } else {
    // Fallback to solid color if image loading fails
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 100,
      color: rgb(0.07, 0.15, 0.3), // dark blue header
    });
  }
  
  // --- PAGE 2: Full Disclaimer & Policies ---
  const page2 = pdfDoc.addPage([600, 800]);
  const { height: page2Height } = page2.getSize();
  let y2 = page2Height - 40;
  const margin = 36;

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

  // Resolve path to public folder
  const locationBytes = fs.readFileSync(path.join(process.cwd(), "public", "location.png"));
  const websiteBytes  = fs.readFileSync(path.join(process.cwd(), "public", "website.png"));
  const phoneBytes    = fs.readFileSync(path.join(process.cwd(), "public", "phone.png"));
  // const emailBytes    = fs.readFileSync(path.join(process.cwd(), "public", "email.png"));
  // const taxBytes      = fs.readFileSync(path.join(process.cwd(), "public", "sales.png"));
  
  const locationIcon = await pdfDoc.embedPng(locationBytes);
  const websiteIcon  = await pdfDoc.embedPng(websiteBytes);
  const phoneIcon    = await pdfDoc.embedPng(phoneBytes);
  // const emailIcon    = await pdfDoc.embedPng(emailBytes);
  // const taxIcon      = await pdfDoc.embedPng(taxBytes);
  
  // --- Now draw them with labels + values ---
  const iconSize = 10;   // icon width/height
  y = height - 100;   // starting Y for first row
  
  const infoRows = [
    { icon: locationIcon, label: "Location:", value: "76 Imperial Dr Suite E Evanston, WY 82930, USA" },
    { icon: websiteIcon,  label: "Website:",  value: "https://partscentral.us" },
    { icon: phoneIcon,    label: "Phone:",    value: "(888) 338-2540" },
    // { icon: emailIcon,    label: "Email:",    value: "purchase@partscentral.us" },
    // { icon: taxIcon,      label: "Sales Tax ID:", value: "271-4444-3598" },
  ];
  
  
  for (const row of infoRows) {
    // Draw icon
    page2.drawImage(row.icon, {
      x: margin,
      y: y - 2, // tweak for vertical alignment
      width: iconSize,
      height: iconSize,
    });
  
    // Draw label
    page2.drawText(row.label, {
      x: margin + iconSize + 4,
      y,
      size: 10,
      font: bold,
      color: rgb(1, 1, 1),
    });
  
    // Draw value
    page2.drawText(row.value, {
      x: margin + 70, // align values nicely
      y,
      size: 10,
      font: times,
      color: rgb(1, 1, 1),
    });
  
    y -= 20; // move down for next row
  }
  // ---------------- DISCLAIMER SECTIONS (PAGE 2) ----------------

 y2 = 100;
// Function to calculate the height of a text block
// A function to wrap and draw text with custom line spacing
  function drawWrappedText(page: any, text: string, x: number, y: number, options: {
    fontSize: number;
    font: any;
    maxWidth: number;
    lineHeight: number;
    color?: any;
  }) {
    const { fontSize, font, maxWidth, lineHeight } = options;

    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth && i > 0) {
            page.drawText(line.trim(), {
                x: x,
                y: currentY,
                size: fontSize,
                font: font,
                color: options.color,
            });
            currentY -= lineHeight;
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }

    if (line.trim().length > 0) {
        page.drawText(line.trim(), {
            x: x,
            y: currentY,
            size: fontSize,
            font: font,
            color: options.color,
        });
    }

    // Return the final Y position
    return currentY;
}

// Set the initial y2 value
 y2 = 650;

// Disclaimer Engine
page2.drawText("Disclaimer Engine:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const engineText = "Engines are sold as an assemblies with manifolds, timing cover, belts, oil pan, fuel injectors or carburetors, pulleys and other accessories. Due to warranty only on the long block, all accessories like manifolds, timing cover, belts, oil pan, fuel injectors or carburetors, pulleys, and other accessories are sold as is (NO WARRANTY APPLICABLE).";
y2 = drawWrappedText(page2, engineText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12, // This controls the space between lines. Adjust as needed.
});

// Calculate space for the next heading
y2 -= 40;

// Disclaimer Transmission
page2.drawText("Disclaimer Transmission:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const transmissionText = "The transmission is guaranteed to shift gears and bearings to be good. The oil pan and oil filter needs to be replaced before installation. Flush out all the liquid and from test cooler lines. The torque convertor needs to be fully engaged to the front pump. For manual transmission a new clutch needs to be installed along with the pressure plate and slave cylinder. The flywheel must be turned once before installation.";
y2 = drawWrappedText(page2, transmissionText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
});

y2 -= 40;

// Installation
page2.drawText("Installation:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const installationText = "Part needs to be installed within 10 days from the date of delivery.";
y2 = drawWrappedText(page2, installationText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
});

y2 -= 40;

// Cancellation
page2.drawText("Cancellation:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const cancellationText = "After placing an order, if the customer wants-to cancel the order, he/she should do so within 24 hours and a charge of 30% restocking fee and one-way shipping cost will be deducted from the paid amount. Any Cancellations of orders should be validated via E-mail and Call to customer service is mandatory.";
y2 = drawWrappedText(page2, cancellationText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
});

y2 -= 40;

// Return Policy
page2.drawText("Return Policy:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const returnText = "If in case of damaged or defective returns will be accepted within 10 calendar days from the date of delivery for mechanical parts and 7 calendar days for body parts. Parts ordered for testing or trial purposes will not be available for return. If the customer received the part and if it is damaged, defective or if the shipping is delayed, the customer has to contact Parts Central LLC before disputing the charges.";
y2 = drawWrappedText(page2, returnText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
});

y2 -= 40;

// Refund Policy
page2.drawText("Refund Policy:", {
    x: 40,
    y: y2,
    size: 14,
    font: bold,
    color: rgb(1, 0, 0),
});

y2 -= 23;
const refundText = "Parts must be returned within 7 business days from the date of delivery for a full refund. However, shipping & handling is non-refundable. Return shipping charges must be covered at the customer's expense. Customers have to provide a registered/certified mechanic's detailed report to prove the same for mechanical parts, which shall be investigated further before processing a refund. Once the part is returned, we will be happy to send a replacement or issue a refund within 5-7 business days.";
y2 = drawWrappedText(page2, refundText, 40, y2, {
    fontSize: 10,
    font: times,
    maxWidth: 520,
    lineHeight: 12,
});

// ... (your existing footer code)
  if (backgroundImage2) {
    page2.drawImage(backgroundImage2, {
      x: 0,
      y: 0,
      width: width,
      height: 100,
    });
  } else {
    // Fallback to solid color if image loading fails
    page2.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 100,
      color: rgb(0.07, 0.15, 0.3), // dark blue header
    });
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
