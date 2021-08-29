const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const Tours = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;
//todo 1 connect to the DB with mongoose
// connecting to DB  with mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB CONNECTION SUCCESSFUL 👌'))
  .catch((err) => console.log('ERROR IN CONNECTION 🤯'));

const tours = JSON.parse(
  readFileSync(__dirname + '/tours-simple.json', 'utf-8')
);

const importData = async () => {
  try {
    await Tours.create(tours);
    console.log('data successfully loaded 🤯');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteAllData = async () => {
  try {
    await Tours.deleteMany();
    console.log('tours deleted 🤯');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const command = process.argv[2];
if (command === '--import') {
  importData();
  console.log(command);
} else if (command === '--delete') {
  deleteAllData();
  console.log(command);
}
console.log(process.argv);
// command line use  Node fileName --[import or delete];
