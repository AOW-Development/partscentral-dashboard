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
      <h3 >Hello,${data.yardInfo.name}</h3>
      <p >Please Find the attached PO.
        Requesting pictures before you wrap up the part for shipping.</p>
        <p style="font-weight: bold;">${data.productInfo
          .map(
            (item) =>
              item.make +
              " " +
              item.model +
              " " +
              item.year +
              " " +
              item.parts +
              " " +
              item.specification +
              " "
          )
          .join(", ")}</p>
      <p >
***Please Note this is a Blind Shipment, No Tags/Labels/Price Miles Not to be disclosed, except for the Shipping label to be attached.
Regards,</p>
      </div>
    </body>
    </html>
  `;
}

async function generatePOPDF(data: InvoiceData) {
  const pdfDoc = await PDFDocument.create();
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([612, 792]);
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

  page.drawText("Location:", {
    x: margin,
    y: height - 50,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("76 Imperial Dr Suite E Evanston, WY 82930, USA", {
    x: margin + 70,
    y: height - 50,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Website:", {
    x: margin,
    y: height - 60,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("https://partscentral.us", {
    x: margin + 70,
    y: height - 60,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Phone:", {
    x: margin,
    y: height - 70,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("(888) 338-2540", {
    x: margin + 70,
    y: height - 70,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Email:", {
    x: margin,
    y: height - 80,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("purchase@partscentral.us", {
    x: margin + 70,
    y: height - 80,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });
  page.drawText("Sales Tax ID:", {
    x: margin,
    y: height - 90,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText("271-4444-3598", {
    x: margin + 70,
    y: height - 90,
    size: 9,
    font: times,
    color: rgb(1, 1, 1),
  });

  y = height - 130;

  page.drawText('Purchase Order', {
    x: margin,
    y: y,
    size: 18,
    font: bold,
    color: rgb(0.07, 0.15, 0.3),
  });

  page.drawText(`Order#: ${data.orderId}`, {
    x: width - 200,
    y: y,
    size: 11,
    font: bold,
    color: rgb(0.07, 0.15, 0.3),
  });

  page.drawText(`VIN #: ${data.customerInfo.vinNumber}`, {
    x: width - 200,
    y: y - 15,
    size: 11,
    font: bold,
    color: rgb(0.07, 0.15, 0.3),
  });

  page.drawText(`We would like to place an order with you:\nAttn: ${data.yardInfo.name}`, {
    x: margin,
    y: y - 25,
    size: 11,
    font: times,
    color: rgb(0, 0, 0.8),
  });

  y -= 70;
  const boxWidth = width - (2 * margin);
  const boxHeight = 45;

  const boxData = [
    { label: 'Part', text: data.productInfo[0].parts },
    { label: 'Price', text: `$${data.yardInfo.price}` },
    { label: 'Card Details', text: data.paymentInfo.cardHolderName },
    { label: 'Billing Address', text: data.customerInfo.billingAddress },
    { label: 'Shipping Address (Commercial)', text: data.customerInfo.shippingAddress },
    { label: 'Warranty', text: data.yardInfo.warranty },
  ];

  for (let i = 0; i < boxData.length; i++) {
    const { label, text } = boxData[i];
    const boxY = y - (i * (boxHeight + 10));

    page.drawRectangle({
      x: margin,
      y: boxY - boxHeight,
      width: boxWidth,
      height: boxHeight,
      color: rgb(0.9, 0.9, 0.9),
      borderColor: rgb(0, 0, 0.8),
      borderWidth: 1,
    });

    page.drawRectangle({
      x: margin,
      y: boxY - boxHeight,
      width: 100,
      height: boxHeight,
      color: rgb(0.8, 0.8, 0.8),
      borderColor: rgb(0, 0, 0.8),
      borderWidth: 1,
    });

    page.drawText(label, {
      x: margin + 10,
      y: boxY - boxHeight + (boxHeight / 2) - 5,
      size: 10,
      font: bold,
      color: rgb(0.07, 0.15, 0.3),
    });

    page.drawText(text, {
      x: margin + 110,
      y: boxY - boxHeight + (boxHeight / 2) - 5,
      size: 10,
      font: times,
      color: rgb(0, 0, 0.8),
    });
  }


 const tableBottomY = 120; // This is the lowest point of your table.
                            // A value like 120 means the table ends 120 points from the bottom of the page.
  // --- End of table/content simulation ---

  // --- Footer Section (your note) ---

  const textContent = "I hereby Chuck & Eddie's Used Auto Parts to charge the order as described above on the Card.\n" +
    "PLEASE SHIP THEPART BLIND-NO PAPERWORK, NO MILES FOR ENGINES AND\n" +
    "SEND THE PICTURE OF THE PART BEFORE YOU SHIP IT.\n" +
    "YOU CAN EMAIL OR FAX THE INVOICE BACK TO US\n" +
    "Thank you for your business!";

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12; // You can adjust this

  // Calculate the width of each line to find the longest line for centering
  const lines = textContent.split('\n');
  let longestLineWidth = 0;
  for (const line of lines) {
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    if (lineWidth > longestLineWidth) {
      longestLineWidth = lineWidth;
    }
  }
   const { width: pageWidth, height: pageHeight } = page.getSize();

  // Calculate the x-coordinate for centering the longest line
  const centerX = (pageWidth - longestLineWidth) / 2;

  // Calculate the total height of the text block
  const lineHeight = fontSize * 1.2; // A common line height multiplier
  const totalTextHeight = lines.length * lineHeight;

  // Calculate the y-coordinate to place the text.
  // We want it *below* tableBottomY, so we subtract from tableBottomY.
  // 'tableBottomY' is distance from the bottom, so higher value means higher on page.
  // If your tableBottomY is 120 (120 points from the bottom of the page),
  // and your text needs to appear below it, then its starting Y will be less than 120.
  const startY = tableBottomY - totalTextHeight - 20; // 20 points of padding below the table

  // Draw the text onto the page
  page.drawText(textContent, {
    x: centerX, // Use the calculated center X for horizontal centering
    y: startY + 200,
    font: font,
    size: fontSize,
    color: rgb(0, 0, 0.5), // A dark blue color, for example
    // pdf-lib's drawText can't center multiple lines directly,
    // so we calculate centerX based on the longest line.
    // For perfect centering of each line, you would draw each line individually.
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