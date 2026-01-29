const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const { parse } = require('csv-parse/sync');
const Tree = require('./models/Tree');

// Normalizza le chiavi del CSV: spazi/accents/maiuscole
function normKey(k) {
  return String(k)
    .trim()
    .toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
    .replace(/\s+/g, '_');                            
}

// "46° 3' 57,59''" / "46° 3' 57,59″" -> decimale
function dmsToDecimal(dms) {
  if (!dms) return NaN;

  const s = String(dms)
    .trim()
    .replace(',', '.')
    .replace(/″|''/g, '"')   
    .replace(/’/g, "'");     

  const m = s.match(/(\d+)\s*°\s*(\d+)\s*'\s*(\d+(?:\.\d+)?)\s*"/);
  if (!m) return NaN;

  const deg = Number(m[1]);
  const min = Number(m[2]);
  const sec = Number(m[3]);
  return deg + min / 60 + sec / 3600;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  await Tree.deleteMany({});
  console.log('Existing trees removed');

  const csvText = fs.readFileSync('data/trees_trento.csv', 'utf-8');

  const rawRows = parse(csvText, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true
  });

  if (!rawRows.length) {
    console.log('CSV vuoto o non parsato.');
    process.exit(0);
  }

  // Normalizzo tutte le righe: chiavi "stabili"
  const rows = rawRows.map(r => {
    const out = {};
    for (const k of Object.keys(r)) out[normKey(k)] = r[k];
    return out;
  });

  // Debug minimo 
  console.log('Normalized headers:', Object.keys(rows[0]));

  const docs = [];
  let skipped = 0;

  for (const r of rows) {
    
    const lat = dmsToDecimal(r.LATITUDINE_SU_GIS);
    const lng = dmsToDecimal(r.LONGITUDINE_SU_GIS);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      skipped++;
      continue;
    }

    const species =
        (r.SPECIE_NOME_VOLGARE && String(r.SPECIE_NOME_VOLGARE).trim()) ||'Unknown';

    const scientificName =
        (r.SPECIE_NOME_SCIENTIFICO && String(r.SPECIE_NOME_SCIENTIFICO).trim()) || undefined;

    docs.push({ species, scientificName, lat, lng });
  }

  console.log('Valid rows:', docs.length, '| Skipped:', skipped);

  if (!docs.length) {
    console.log('Nessuna riga valida: controlla header e formato coordinate.');
    process.exit(0);
  }

  const res = await Tree.insertMany(docs);
  console.log('Imported', res.length, 'trees');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});