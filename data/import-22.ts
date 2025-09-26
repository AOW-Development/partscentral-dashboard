import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { readdirSync } from 'fs';
import { join, extname } from 'path';

const prisma = new PrismaClient();

// 1️⃣ HEADER-TO-COLUMN mapping
const headerMap: Record<string, string> = {
  make:             'Make Name' , // also "9" ,   
  model:            'Model Name',
  year:             'Model Year',
  partType:         'Part Name',
  subPart:          'Sub Part Name', // sub Part Name
  inStock:          'Stock',
  miles:            'Miles',
  actualPrice:      'Actual Price 1',
  discountedPrice:  'Discount Price 1',
  miles2:           'Miles_1',
  actualPrice2:     'Actual Price 2',
  discountedPrice2: 'Discount Price 2',
  // sku is generated, so no mapping needed
};

async function importWorkbook(buffer: Buffer | ArrayBuffer) {
  const wb = XLSX.read(buffer, { type: buffer instanceof Buffer ? 'buffer' : 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  // Get the actual header row to check for required columns
  const headerRowRaw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })[0];
  const headerRow = Array.isArray(headerRowRaw) ? headerRowRaw : [];
  const sheetHeaders = headerRow.map(h => (typeof h === 'string' ? h : '').trim().toLowerCase().replace(/\s+/g, ''));

  // Only require core columns
  const requiredHeaders = ['makename', 'modelname', 'modelyear', 'partname', 'subpartname', 'stock'];
  const missing = requiredHeaders.filter(h => !sheetHeaders.includes(h));
  if (missing.length) {
    console.warn(`Skipping file: missing columns: ${missing.join(', ')}`);
    return; // skip this file
  }

  for (const raw of rawRows) {
    // Create a new object with trimmed headers as keys
    const normalizedRaw: Record<string, any> = {};
    for (const k in raw) {
      if (Object.prototype.hasOwnProperty.call(raw, k)) {
        normalizedRaw[(typeof k === 'string' ? k : '').trim()] = raw[k];
      }
    }

    // Map columns to our desired fields using headerMap
    const row: Record<string, any> = {};
    for (const [field, colName] of Object.entries(headerMap)) {
      const val = normalizedRaw[colName];
      // trim strings, leave other types as is
      row[field] = typeof val === 'string' ? val.trim() : val;
    }

    // ── your entire upsert block BELOW stays exactly the same ──

    // 1. Upsert Make
    const make = await prisma.make.upsert({
      where: { name: row.make },
      create: { name: row.make },
      update: {},
    });

    // 2. Upsert Model
    const model = await prisma.model.upsert({
      where: { name_makeId: { name: String(row.model), makeId: make.id } },
      create: { name: String(row.model), makeId: make.id },
      update: {},
    });

    // 3. Upsert Year
    const year = await prisma.year.upsert({
      where: { value: String(row.year) },
      create: { value: String(row.year) },
      update: {},
    });

    // 4. Upsert ModelYear
    const modelYear = await prisma.modelYear.upsert({
      where: { modelId_yearId: { modelId: model.id, yearId: year.id } },
      create: { modelId: model.id, yearId: year.id },
      update: {},
    });

    // 5. Upsert PartType
    const partType = await prisma.partType.upsert({
      where: { name: row.partType },
      create: { name: row.partType },
      update: {},
    });

    // 6. Upsert SubParts (do NOT split by comma, use full string)
    const subPartName = (row.subPart ?? '').toString().trim();
    const subPart = await prisma.subPart.upsert({
      where: { name_partTypeId: { name: subPartName, partTypeId: partType.id } },
      create: { name: subPartName, partTypeId: partType.id },
      update: {},
    });
    const subParts = [subPart];

    const baseSku = [
      String(row.make),
      String(row.model),
      String(row.year),
      String(row.partType),
      String(row.subPart)
    ].join('-').replace(/\s+/g, '').toUpperCase();

    // 7. Create Product
    const product = await prisma.product.upsert({
      where: { sku: baseSku },
      create: {
        sku: baseSku,
        modelYear: { connect: { id: modelYear.id } },
        partType: { connect: { id: partType.id } },
        inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === 'Part Available' || row.inStock === 'yes',
        // actualprice: Number(row.actualPrice),
        // discountedPrice: Number(row.discountedPrice),
        // miles: row.miles ? String(row.miles) : null,
        subParts: {
          connect: subParts.map(sp => ({ id: sp.id })),
        },
      },
      update: {
        inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === "Part Available" || row.inStock === "yes",
        // actualprice: Number(row.actualPrice),
        // discountedPrice: Number(row.discountedPrice),
        // miles: row.miles ? String(row.miles) : null,
        subParts: {
          set: subParts.map(sp => ({ id: sp.id })),
        },
        modelYear: { connect: { id: modelYear.id } },
        partType: { connect: { id: partType.id } },
      },
    });


    
// 8. Upsert ProductVariant
// Helper function to clean price strings
const cleanPrice = (price: any): number => {
  if (price === null || price === undefined) return 0;
  const str = String(price).replace(/[^0-9.]/g, '');
  return str ? Number(str) : 0;
};

// 8. Upsert ProductVariant (Variant 1)
const miles1 = row.miles ? String(row.miles).replace(/\s+/g, '').toUpperCase() : 'N/A';
const variantSku1 = baseSku + '-' + miles1;
await prisma.productVariant_1.upsert({
  where: { sku: variantSku1 },
  create: {
    sku: variantSku1,
    productId: product.id,
    miles: row.miles ? String(row.miles) : null,
    actualprice: cleanPrice(row.actualPrice),
    discountedPrice: cleanPrice(row.discountedPrice),
    inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === 'Part Available' || row.inStock === 'yes',
    // ...add other fields as needed
  },
  update: {
    miles: row.miles ? String(row.miles) : null,
    actualprice: cleanPrice(row.actualPrice),
    discountedPrice: cleanPrice(row.discountedPrice),
    inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === 'Part Available' || row.inStock === 'yes',
    // ...add other fields as needed
  },
});
// console.log('row.miles2:', row.miles2, 'row.actualPrice2:', row.actualPrice2, 'row.discountedPrice2:', row.discountedPrice2);
// 9. Upsert ProductVariant (Variant 2, if present)
if (row.miles2 || row.actualPrice2 || row.discountedPrice2) {
  const miles2 = row.miles2 ? String(row.miles2).replace(/\s+/g, '').toUpperCase() : 'N/A';
  const variantSku2 = baseSku + '-' + miles2;
  await prisma.productVariant_1.upsert({
    where: { sku: variantSku2 },
    create: {
      sku: variantSku2,
      productId: product.id,
      miles: row.miles2 ? String(row.miles2) : null,
      actualprice: cleanPrice(row.actualPrice2),
      discountedPrice: cleanPrice(row.discountedPrice2),
      inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === 'Part Available' || row.inStock === 'yes',
    },
    update: {
      miles: row.miles2 ? String(row.miles2) : null,
      actualprice: cleanPrice(row.actualPrice2),
      discountedPrice: cleanPrice(row.discountedPrice2),
      inStock: row.inStock === 'Yes' || row.inStock === 'YES' || row.inStock === 'Part Available' || row.inStock === 'yes',
    }
  });
}

  }
}

async function main() {
  // — Option A: batch all XLSX in ./data/
  const dataDir = join(__dirname,'data');
  const files = readdirSync(dataDir).filter(f => extname(f).toLowerCase() === '.xlsx');
  for (const f of files) {
    const wb = XLSX.readFile(join(dataDir, f));
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const headers = Object.keys(XLSX.utils.sheet_to_json(sheet, { defval: '' })[0] || {});
    console.log(`File: ${f} | Headers:`, headers);
    const buf = await import('fs/promises').then(m => m.readFile(join(dataDir, f)));
    await importWorkbook(buf);
  }

  // — Option B: fetch from a list of URLs
  /*
  const urls = [
    'https://…/transmission.xlsx',
    'https://…/engine.xlsx',
    // …etc
  ];
  for (const url of urls) {
    const res = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
    await importWorkbook(res.data);
  }
  */

  console.log('All imports complete');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
