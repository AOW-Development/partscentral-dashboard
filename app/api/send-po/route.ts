import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";
import path from "path";
import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Utility function to load background image
async function loadBackgroundImage(pdfDoc: PDFDocument) {
  try {
    const backgroundPath = path.join(process.cwd(), "public", "smtpHead.jpg");
    const backgroundBytes = fs.readFileSync(backgroundPath);
    console.log("Background image loaded successfully, size:", backgroundPath);
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
    shippingAddress: string;
    billingAddress: string;
    shippingAddressType: string;
    company: string;
    totalSellingPrice: number;
    vinNumber: string;
    warranty: string;
    milesPromised: number;
  };
  productInfo: [
    {
      make: string;
      model: string;
      year: string;
      parts: string;
      specification: string;
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
    attnName: string;
    mobile: string;
    address: string;
    email: string;
    price: number;
    warranty: string;
    miles: number;
    shipping: string;
    yardCost: string;
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
    console.log("PO Data is:", invoiceData);

    if (!invoiceData.yardInfo?.email) {
      return NextResponse.json(
        { error: "Yard email is required" },
        { status: 400 }
      );
    }

    const invoiceHTML = generateInvoiceHTML(invoiceData);
    const pdfContent = await generatePOPDF(invoiceData);

    const emailResult = await sendPOEmail(
      invoiceData.yardInfo.email,
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

function generateInvoiceHTML(data: InvoiceData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Purchase Order - ${data.orderId}</title>
    </head>
    <body>
      <div>
      <h3 >Hello ${data.yardInfo.attnName},</h3>
      <p style= "font-weight: bold;" >Please Find the attached PO.</p>
        <p style= "font-weight: bold;"> Requesting pictures before you wrap up the part for shipping.</p>
        <p style= "font-weight: bold;">${data.productInfo
          .map(
          (item) => `
            ${item.year} ${item.make} ${item.model}<br> 
            ${item.parts}<br>
            ${item.specification}<br>
            VIN # ${data.customerInfo.vinNumber}<br>
          `
        )
        .join("")}
      <p style="font-weight: bold;">
    ***Please Note this is a Blind Shipment, No Tags/Labels/Price Miles Not to be disclosed, except for the Shipping label to be attached.
    </p>
      <h4 style="margin-top:36px; font-weight: bold;">Regards,</h4>
      <p style="margin-bottom:-5px; font-weight: bold;">Parts Central LLC</p>
      <p style="margin-bottom:-5px; font-weight: bold;">Contact: (888) 338-2540</p>
      <p style="margin-bottom:-5px; font-weight: bold;">Fax#: (312) 845-9711</p>

      </div>
    </body>
    </html>
  `;
}

async function generatePOPDF(data: InvoiceData) {
  const pdfDoc = await PDFDocument.create();
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 820]);
  const { width, height } = page.getSize();
  const margin = 36;
  let y = height - margin;

  const backgroundImage = await loadBackgroundImage(pdfDoc);

  if (backgroundImage) {
    page.drawImage(backgroundImage, {
      x: 0,
      y: height - 100,
      width: width,
      height: 180,
    });
  } else {
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width,
      height: 180,
      color: rgb(0.07, 0.15, 0.3),
    });
  }

  try {
    const logoImage = await loadLogo(pdfDoc);
    if (logoImage) {
      const logoDims = logoImage.scale(0.5);
      page.drawImage(logoImage, {
        x: margin,
        y: height - 40,
        width: logoDims.width,
        height: logoDims.height,
      });
    } else {
      page.drawText("PARTS CENTRAL", {
        x: margin,
        y: height - 20,
        size: 18,
        font: bold,
        color: rgb(1, 1, 1),
      });
    }
  } catch (error) {
    console.error("Error loading logo:", error);
    page.drawText("PARTS CENTRAL", {
      x: margin,
      y: height - 20,
      size: 18,
      font: bold,
      color: rgb(1, 1, 1),
    });
  }

  // Resolve path to public folder
  const locationBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "loc.png")
  );
  const websiteBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "web.png")
  );
  const phoneBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "pbone1.png")
  );
  const emailBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "mail.png")
  );
  const taxBytes = fs.readFileSync(
    path.join(process.cwd(), "public", "tax.png")
  );

  const locationIcon = await pdfDoc.embedPng(locationBytes);
  const websiteIcon = await pdfDoc.embedPng(websiteBytes);
  const phoneIcon = await pdfDoc.embedPng(phoneBytes);
  const emailIcon = await pdfDoc.embedPng(emailBytes);
  const taxIcon = await pdfDoc.embedPng(taxBytes);

  // --- Now draw them with labels + values ---
 const iconSize = 10;
 y = height - 50;
const rowSpacing = 16;
const labelFontSize = 10;
const valueFontSize = 10;

// Define left and right margin for two columns
const leftX = margin;
const rightX = width / 2 + 20; // adjust 20px for spacing from middle

const infoRows = [
  { icon: locationIcon, label: "Location:", value: "76 Imperial Dr Suite E Evanston, WY 82930, USA", alignRight: false },
  { icon: websiteIcon, label: "Website:", value: "https://partscentral.us", alignRight: false },
  { icon: phoneIcon, label: "Phone:", value: "(888) 338-2540", alignRight: false },
  { icon: emailIcon, label: "Email:", value: "purchase@partscentral.us", alignRight: true },
  { icon: taxIcon, label: "Sales Tax ID:", value: "271-4444-3598", alignRight: true },
];

for (const row of infoRows) {
  if (row.alignRight) {
    // Right column
    page.drawImage(row.icon, {
      x: rightX,
      y: y - 2,
      width: iconSize,
      height: iconSize,
    });

    page.drawText(row.label, {
      x: rightX + iconSize + 6,
      y,
      size: labelFontSize,
      font: bold,
      color: rgb(1, 1, 1),
    });

    page.drawText(row.value, {
      x: rightX + 50, // similar spacing as left column
      y,
      size: valueFontSize,
      font: times,
      color: rgb(1, 1, 1),
    });
  } else {
    // Left column
    page.drawImage(row.icon, {
      x: leftX,
      y: y - 2,
      width: iconSize,
      height: iconSize,
    });

    page.drawText(row.label, {
      x: leftX + iconSize + 6,
      y,
      size: labelFontSize,
      font: bold,
      color: rgb(1, 1, 1),
    });

    page.drawText(row.value, {
      x: leftX + 80,
      y,
      size: valueFontSize,
      font: times,
      color: rgb(1, 1, 1),
    });
  }

  y -= rowSpacing; // same spacing for both columns
}


  page.drawText("Purchase Order", {
    x: margin,
    y: y - 30,
    size: 18,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`Order: PC#${data.orderId}`, {
    x: width - 200,
    y: y - 30,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`VIN #: ${data.customerInfo.vinNumber}`, {
    x: width - 200,
    y: y - 50,
    size: 12,
    font: bold,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`We would like to place an order with you`, {
    x: margin,
    y: y - 45,
    size: 12,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  page.drawText(`Attn: ${data.yardInfo.attnName}`, {
    x: margin,
    y: y - 60,
    size: 12,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  // --- The corrected drawing logic starts here ---
  let currentX = y - 80;

  const leftPadding = margin;
  const labelWidth = 120;
  const defaultLineHeight = 12;
  const verticalPadding = 30;
  const boxSpacing = 10;

  // Dynamically handle shipping address based on type
  let shippingText = "";
  if (data.customerInfo.shippingAddressType === "Commercial") {
    shippingText = `${data.customerInfo.company}\n${
      data.customerInfo.shippingAddress
    }\nAttn: ${data.customerInfo.name || ""}\nPH#${
      data.customerInfo.mobile || ""
    }`;
  } else if (data.customerInfo.shippingAddressType === "Terminal") {
    shippingText = `Terminal\n${
      data.customerInfo.shippingAddress
    }\n To the nearest Terminal\nAttn: ${data.customerInfo.name || ""}\nPH#${
      data.customerInfo.mobile || ""
    }`;
  } else {
    // Residential / Own Shipping
    shippingText = `Residential\n${data.customerInfo.shippingAddress}\nAttn: ${
      data.customerInfo.name || ""
    }\nPH#${data.customerInfo.mobile || ""}`;
  }

  let someData = "";
  if (data.yardInfo.shipping == "Yard Shipping") {
    someData = `$${data.yardInfo.price}(part) + $${data.yardInfo.yardCost}(yard cost)`;
  } else {
    someData = `$${data.yardInfo.price}(part) + Own Shipping`;
  }

  const boxData = [
    {
      label: "Part",
      text:
        data.productInfo[0].year +
        " " +
        data.productInfo[0].make +
        " " +
        data.productInfo[0].model +
        "\n" +
        data.productInfo[0].parts +
        "\n" +
        data.productInfo[0].specification,
    },
    {
      label: "Price",
      text: `${someData}`,
    },
    {
      label: "Card Details",
      text: `Parts Central LLC\n4987 5543 7896 9945\n05/29\n908`,
    },
    { label: "Billing Address", text: data.customerInfo.billingAddress },
    { label: `Shipping Address`, text: shippingText },
    { 
    label: "Warranty", 
    text: `${data.yardInfo.warranty}\nPlease send Pictures Before Shipping Out the Part to the\nEmail: purchase@partscentral.us or Ph: 307-200-2571` 
  },
  ];

  // ---
  // First pass: Calculate the dynamic height for each block and the total height of the left block
  // ---
  let totalLeftBlockHeight = 0;
  const blockHeights = [];

  for (let i = 0; i < boxData.length; i++) {
    const { text } = boxData[i];
    const lines = text.split("\n");
    const requiredHeight = lines.length * defaultLineHeight + verticalPadding;
    blockHeights.push(requiredHeight);
    totalLeftBlockHeight += requiredHeight;
    if (i < boxData.length - 1) {
      totalLeftBlockHeight += boxSpacing;
    }
  }

  const totalLeftBlockY = currentX - totalLeftBlockHeight;

  // ---
  // Draw the single, continuous dark blue rectangle on the left
  // ---
  page.drawRectangle({
    x: leftPadding,
    y: totalLeftBlockY,
    width: labelWidth,
    height: totalLeftBlockHeight,
    color: rgb(0.07, 0.15, 0.3),
  });

  // ---
  // Second pass: Loop through each item to draw the labels and the horizontal content blocks
  // ---
  for (let i = 0; i < boxData.length; i++) {
    const { label, text } = boxData[i];
    const actualBoxHeight = blockHeights[i];

    // ---
    // Draw the horizontal light gray rectangle for the content
    // ---
    page.drawRectangle({
      x: leftPadding + labelWidth,
      y: currentX - actualBoxHeight,
      width: width - 2 * leftPadding - labelWidth,
      height: actualBoxHeight,
      color: rgb(0.9, 0.9, 0.9),
    });

    // ---
    // Draw the label text inside the left blue block
    // ---
    // Measure label width
    const labelWidthAtSize = bold.widthOfTextAtSize(label, 10);

    // Compute X so the text is centered inside the blue block
    const labelX = leftPadding + (labelWidth - labelWidthAtSize) / 2;

    // Compute Y so it's vertically centered in this block
    const labelY = currentX - actualBoxHeight / 2 - defaultLineHeight / 2;

    page.drawText(label, {
      x: labelX,
      y: labelY,
      size: 11,
      font: bold,
      color: rgb(1, 1, 1),
    });

    // ---
    // Draw the multi-line content text
    // ---
    const lines = text.split("\n");
    const textX = leftPadding + labelWidth + 15;
    let textYStart = currentX - verticalPadding / 2 - defaultLineHeight;

    for (let j = 0; j < lines.length; j++) {
      page.drawText(lines[j], {
        x: textX,
        y: textYStart - j * defaultLineHeight,
        size: 11,
        font: times,
        color: rgb(0, 0, 0),
      });
    }

    // ---
    // Update currentY for the next block
    // ---
    currentX -= actualBoxHeight + boxSpacing;
  }

  const tableBottomY = 60; // This is the lowest point of your table.
  // A value like 120 means the table ends 120 points from the bottom of the page.
  // --- End of table/content simulation ---

  // --- Footer Section (your note) ---

  const textContent = [
    `I hereby approve ${data.yardInfo.name} to charge the order as described above on the Card.`,
    "PLEASE SHIP THE PART BLIND-NO PAPERWORK, NO MILES FOR ENGINES AND TRANSMISSIONS.",
    "SEND THE PICTURE OF THE PART BEFORE YOU SHIP IT.",
    "YOU CAN EMAIL OR FAX THE INVOICE BACK TO US",
    "", // This empty string creates a line break
    "Thank you for your business!",
  ];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;

  const { width: pageWidth } = page.getSize();
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = textContent.length * lineHeight;

  // We want the text to appear below the table, so we calculate the starting Y
  // from the table's bottom edge, with some padding.
  const startY = tableBottomY - totalTextHeight - 20;

  let currentY = startY + 200;

  for (let i = 0; i < textContent.length; i++) {
    const line = textContent[i];
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    const centerX = (pageWidth - lineWidth) / 2;
    let color = rgb(0, 0, 0.5); // Default dark blue color
    let currentFont = font;

    // Check for the line to be red as in the image
    if (line.includes("SEND THE PICTURE")) {
      color = rgb(1, 0, 0); // Red color
    }
    // Check for the line to be a darker blue and bold
    if (line.includes("Thank you for your business!")) {
      color = rgb(0, 0, 0.5);
      currentFont = boldFont;
      // Dark blue color
    }

    page.drawText(line, {
      x: centerX,
      y: currentY,
      font: font,
      size: fontSize,
      color: color,
    });

    currentY -= lineHeight;
  }

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
  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Send email function
async function sendPOEmail(
  toEmail: string,
  htmlContent: string,
  orderId: string,
  pdfContent: Uint8Array
) {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "purchase@partscentral.us",
        pass: "mzgccnzjtvbdgdpl",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: "purchase@partscentral.us",
      to: toEmail,
      subject: `Purchase Order For PC#${orderId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `PO-PC#${orderId}.pdf`,
          content: Buffer.from(pdfContent.buffer),
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    console.log(`Sending PO email to: ${toEmail}`);
    console.log(`Order ID: ${orderId}`);
    console.log(`PDF size: ${pdfContent.length} bytes`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("PO sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "PO sending failed",
    };
  }
}