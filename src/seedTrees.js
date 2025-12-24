const mongoose = require('mongoose');
require('dotenv').config();

const Tree = require('./models/Tree');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Tree.deleteMany({});

  await Tree.insertMany([
    { species: 'Oak', lat: 46.067, lng: 11.121 },
    { species: 'Pine', lat: 46.068, lng: 11.123 },
    { species: 'Maple', lat: 46.066, lng: 11.119 }
  ]);

  console.log('Trees seeded');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
