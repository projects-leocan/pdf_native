const Chart = require('chart.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new PDF document
const doc = new PDFDocument();

// Create a canvas element using the Chart.js node-canvas module
const { createCanvas, registerFont } = require('canvas');
const canvas = createCanvas(400, 300);
const ctx = canvas.getContext('2d');

const invoice = {
    items: [
      {
        videoUrl: "https:2000.com",
        description: "Toner Cartridge",
        viewCount: 2,
      },
      {
        videoUrl: "https:2000.com",
        description: "Toner Cartridge",
        viewCount: 2,
      }
    ]
  };


function createInvoice(invoice, path) {
  generateInvoiceTable(doc, invoice);
}


function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 500;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "ViewCount"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.videoUrl,
      item.description,
      item.viewCount
    );

    generateHr(doc, position + 20);
  }
}


function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 200, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

// Generate the Himalaya graph using Chart.js
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Elevation',
        data: [1000, 2000, 1500, 3000, 2500, 4000],
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: false,
    maintainAspectRatio: true,
  },
});
        
// Create a PDF file and write the graph to it
doc.pipe(fs.createWriteStream('pdfData.pdf'));

// Draw the chart onto the PDF document
const chartImage = new Buffer(canvas.toDataURL().split(',')[1], 'base64');

doc
  .fontSize(25)
  .text('Total Walking Distance', 50, 50);

doc.image(chartImage, {
  fit: [400, 300],
  align: 'center',
  valign: 'center',
});

doc
  .fontSize(25)
  .text('Exercise Video', 50 ,450 );

createInvoice(invoice)


// Finalize the PDF document
doc.end();

console.log('PDF generated successfully!');
